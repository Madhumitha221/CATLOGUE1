// Ensure GSAP and ScrollTrigger are loaded in your HTML before this script
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/ScrollTrigger.min.js"></script>

gsap.registerPlugin(ScrollTrigger);

// --- 1. Global Variables & DOM Elements ---
const mainCategoriesSection = document.getElementById('mainCategoriesSection');
const dynamicContentSection = document.getElementById('dynamicContentSection');
const dynamicSectionTitle = document.getElementById('dynamicSectionTitle');
const subCategoryGrid = document.getElementById('subCategoryGrid');
const modelSelectionGrid = document.getElementById('modelSelectionGrid');
const productsGrid = document.getElementById('productsGrid');
const backButtonContainer = document.querySelector('.back-button-container');
const productModal = document.getElementById('productModal');
const closeButton = productModal.querySelector('.close-button');
const modalLoading = document.getElementById('modalLoading');
const modelDetailsContainer = document.getElementById('modelDetailsContainer');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const mainProductImage = document.getElementById('mainProductImage');
const thumbnailNav = document.getElementById('thumbnailNav');
const prevImageBtn = document.getElementById('prevImageBtn');
const nextImageBtn = document.getElementById('nextImageBtn');
const fullscreenOverlay = document.getElementById('fullscreenOverlay');
const fullscreenImage = document.getElementById('fullscreenImage');
const fullscreenClose = document.getElementById('fullscreenClose');
const fullscreenPrevBtn = document.getElementById('fullscreenPrevBtn');
const fullscreenNextBtn = document.getElementById('fullscreenNextBtn');

let currentView = 'categories'; // 'categories', 'subCategories', 'models', 'products'
let currentCategory = null;
let currentModel = null;
let currentProducts = []; // Stores products for the current view
let currentProductImageIndex = 0; // For product image carousel
let currentFullscreenImageIndex = 0; // For fullscreen image viewer

// --- 2. Data (Example data structure, you'll expand this) ---
const catalogueData = {
    "spares": {
        title: "Ather Spares",
        // These items will not be dynamically loaded if 'redirectPage' is present
        // They are kept here for potential future dynamic loading on spares.html itself
        items: [
            { id: "brake-pads", name: "Brake Pads", description: "High-performance brake pads for superior stopping power.", page: "products" },
            { id: "tyres", name: "Tyres", description: "Durable tyres for all-weather grip and stability.", page: "products" },
            // ... more spares
        ],
        // ADD THIS LINE FOR REDIRECTION
        redirectPage: "spares.html" // <--- Specify the HTML file to redirect to
    },
    "accessories-merchandise": {
        title: "Accessories & Merchandise",
        items: [
            { id: "helmets", name: "Helmets", description: "Stylish and safe helmets for Ather riders.", page: "products" },
            { id: "t-shirts", name: "T-Shirts", description: "Official Ather merchandise.", page: "products" },
            // ... more accessories/merchandise
        ],
        // ADD THIS LINE FOR REDIRECTION
        redirectPage: "accessories-merchandise.html" // <--- Specify the HTML file to redirect to
    },
    "charging-infrastructure": {
        title: "Charging Infrastructure",
        items: [
            { id: "home-charger", name: "Home Chargers", description: "Compact and efficient chargers for home use.", page: "products" },
            { id: "ather-grid", name: "Ather Grid Locations", description: "Find public charging points.", page: "locations" }, // Example: link to a map
            // ... more charging options
        ],
        // ADD THIS LINE FOR REDIRECTION
        redirectPage: "charging-infrastructure.html" // <--- Specify the HTML file to redirect to
    },
    // Example of a category that *stays* on the current page and loads dynamically:
    "scooters": {
        title: "Ather Scooters",
        items: [
            { id: "ather-450x-model", name: "Ather 450X", description: "Our flagship intelligent electric scooter.", type: "model", icon: "images/ather450x-icon.png" },
            { id: "ather-450s-model", name: "Ather 450S", description: "The new standard for urban mobility.", type: "model", icon: "images/ather450s-icon.png" }
        ]
    },


    // Add specific product data here, e.g.:
    // YOU NEED TO MAKE SURE THESE PRODUCT IDs MATCH the 'id' in your items above,
    // or you'll need a more robust way to fetch product data.
    "product-brake-pads": {
        name: "Ather Performance Brake Pads",
        description: "Optimized for the Ather 450X, these brake pads offer enhanced durability and consistent braking performance in all conditions. Made from a high-grade ceramic compound to reduce wear.",
        partCode: "ATH-BP-001",
        images: ["images/brake_pads_1.jpg", "images/brake_pads_2.jpg", "images/brake_pads_3.jpg"],
        specifications: [
            { key: "Material", value: "Ceramic Composite" },
            { key: "Compatibility", value: "Ather 450X, 450S" },
            { key: "Durability", value: "15,000 km" }
        ]
    },
    "product-tyres": {
        name: "Ather High-Grip Tyres",
        description: "Specifically designed for electric scooter performance, offering superior grip and extended life. Ideal for urban commuting and spirited riding.",
        partCode: "ATH-TY-002",
        images: ["images/tyre_1.jpg", "images/tyre_2.jpg"],
        specifications: [
            { key: "Type", value: "Tubeless" },
            { key: "Material", value: "Dual Compound Rubber" },
            { key: "Compatibility", value: "Ather 450X, 450S" }
        ]
    },
    "product-helmets": {
        name: "Ather Smart Helmet",
        description: "A blend of safety and technology. Features integrated Bluetooth, advanced ventilation, and a lightweight design for maximum comfort and protection.",
        partCode: "ATH-HLM-001",
        images: ["images/helmet_1.jpg", "images/helmet_2.jpg", "images/helmet_3.jpg"],
        specifications: [
            { key: "Size", value: "M, L, XL" },
            { key: "Features", value: "Bluetooth, Ventilation" },
            { key: "Material", value: "ABS Shell" }
        ]
    },
    "product-t-shirts": {
        name: "Ather Branded T-Shirt",
        description: "Comfortable and stylish t-shirt featuring the iconic Ather logo. Perfect for everyday wear.",
        partCode: "ATH-TS-001",
        images: ["images/tshirt_1.jpg", "images/tshirt_2.jpg"],
        specifications: [
            { key: "Material", value: "100% Cotton" },
            { key: "Sizes", value: "S, M, L, XL" }
        ]
    },
    "product-home-charger": {
        name: "AtherDot Home Charger",
        description: "The intelligent home charging solution for your Ather scooter. Compact, weather-resistant, and easy to install.",
        partCode: "ATH-CHG-001",
        images: ["images/charger_1.jpg", "images/charger_2.jpg"],
        specifications: [
            { key: "Charging Speed", value: "1.2 kW" },
            { key: "Installation", value: "Wall Mount" },
            { key: "Features", value: "Overcharge Protection" }
        ]
    },
    "product-ather-grid": {
        name: "Ather Grid Public Charging Points",
        description: "Access a widespread network of fast-charging points. Locate the nearest Ather Grid for convenient charging on the go.",
        partCode: "ATH-GRID-LOC",
        images: ["images/grid_station_1.jpg", "images/grid_station_2.jpg"],
        specifications: [
            { key: "Type", value: "Fast Charging" },
            { key: "Availability", value: "24/7 (most locations)" }
        ]
    },
    // Example product data for a specific model (e.g., Ather 450X accessories/parts)
    "products-for-ather-450x-model": {
        items: [
            { id: "product-brake-pads", name: "Ather Performance Brake Pads", description: "For 450X.", partCode: "ATH-BP-001", images: ["images/brake_pads_1.jpg"], type: "product" },
            { id: "product-tyres", name: "Ather High-Grip Tyres", description: "For 450X.", partCode: "ATH-TY-002", images: ["images/tyre_1.jpg"], type: "product" }
        ]
    },
    // You would add more product-for-{modelId} entries here.
};


// --- 3. Animation Functions ---
function animateCardsIn(elements) {
    gsap.fromTo(elements,
        { opacity: 0, translateY: 50 },
        {
            opacity: 1,
            translateY: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
                trigger: elements[0] ? elements[0].closest('section') : 'body',
                start: "top 85%",
                toggleActions: "play none none none"
            }
        }
    );
}

// Initial animation for main category cards (if already rendered in HTML)
document.addEventListener('DOMContentLoaded', () => {
    const categoryCards = mainCategoriesSection.querySelectorAll('.category-card');
    if (categoryCards.length > 0) {
        animateCardsIn(categoryCards);
    }
});


// --- 4. Navigation & Display Logic ---
function showSection(sectionToShow, title, dataItems = []) {
    currentProducts = dataItems; // Store current products for modal/carousel
    dynamicSectionTitle.textContent = title;

    // Hide all dynamic grids
    subCategoryGrid.classList.add('hidden');
    modelSelectionGrid.classList.add('hidden');
    productsGrid.classList.add('hidden');

    // Clear previous content
    subCategoryGrid.innerHTML = '';
    modelSelectionGrid.innerHTML = '';
    productsGrid.innerHTML = '';

    // Show the appropriate grid and populate
    let targetGrid;
    if (sectionToShow === 'subCategories') {
        targetGrid = subCategoryGrid;
        populateGrid(subCategoryGrid, dataItems, 'sub-category');
    } else if (sectionToShow === 'models') {
        targetGrid = modelSelectionGrid;
        populateGrid(modelSelectionGrid, dataItems, 'model');
    } else if (sectionToShow === 'products') {
        targetGrid = productsGrid;
        populateGrid(productsGrid, dataItems, 'product');
    }

    if (targetGrid) {
        targetGrid.classList.remove('hidden');
        // Animate elements within the targetGrid only if they are newly added or not already animated
        // For existing elements, ScrollTrigger handles it.
        // We ensure a fresh animation if the grid is populated.
        animateCardsIn(targetGrid.querySelectorAll('.figure-item, .product-card'));
    }

    // Toggle section visibility
    mainCategoriesSection.classList.add('hidden');
    dynamicContentSection.classList.remove('hidden');
    backButtonContainer.classList.remove('hidden');

    // Scroll to the top of the dynamic content section
    gsap.to(window, { duration: 0.5, scrollTo: { y: dynamicContentSection.offsetTop - 100 } });
}


function showCategoryList() {
    currentView = 'categories';
    currentCategory = null;
    currentModel = null;
    currentProducts = [];

    mainCategoriesSection.classList.remove('hidden');
    dynamicContentSection.classList.add('hidden');
    backButtonContainer.classList.add('hidden');

    // Scroll to the main categories section
    gsap.to(window, { duration: 0.5, scrollTo: { y: mainCategoriesSection.offsetTop - 100 } });
}

function goBack() {
    if (currentView === 'products' && currentModel) {
        // Go from products back to models (e.g., from "Brake Pads for 450X" back to "450X" model page)
        // Find the model's data to repopulate the model selection grid
        // This assumes your model data is structured as catalogueData[`category-modelId`]
        const modelKey = `${currentCategory}-${currentModel}`; // e.g., "scooters-ather-450x-model"
        const modelEntry = catalogueData[currentCategory].items.find(item => item.id === currentModel && item.type === 'model');

        if (modelEntry) {
            // Repopulate models if coming from model-specific products
            showSection('models', `${catalogueData[currentCategory].title} Models`, catalogueData[currentCategory].items.filter(item => item.type === 'model'));
            currentView = 'models';
        } else {
            // Fallback: If not coming from a model, go back to sub-categories
            showSection('subCategories', catalogueData[currentCategory].title, catalogueData[currentCategory].items);
            currentView = 'subCategories';
        }
    } else if (currentView === 'products' || currentView === 'models' || currentView === 'subCategories') {
        // Go from any sub-level back to main categories
        showCategoryList();
    }
}


// --- 5. Grid Population ---
function populateGrid(gridElement, items, type) {
    gridElement.innerHTML = ''; // Clear previous items

    if (!items || items.length === 0) {
        gridElement.innerHTML = '<p class="no-items-message">No items found here. Please check back later!</p>';
        return;
    }

    items.forEach(item => {
        let itemHtml = '';
        if (type === 'product') {
            // Product Card structure
            itemHtml = `
                <div class="product-card" data-id="${item.id}" data-type="product">
                    <img src="${item.images[0] || 'images/placeholder.png'}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p class="product-description">${item.description}</p>
                    ${item.partCode ? `<p class="part-code">Part Code: ${item.partCode}</p>` : ''}
                </div>
            `;
        } else {
            // Generic Figure Item structure (for categories/models/sub-categories)
            itemHtml = `
                <figure class="figure-item" data-id="${item.id}" data-type="${type}">
                    <img src="${item.icon || item.image || 'images/placeholder-icon.png'}" alt="${item.name} Icon">
                    <figcaption>${item.name}</figcaption>
                    <p>${item.description}</p>
                </figure>
            `;
        }
        gridElement.insertAdjacentHTML('beforeend', itemHtml);
    });

    // Add event listeners to newly created items
    gridElement.querySelectorAll('.figure-item, .product-card').forEach(item => {
        item.addEventListener('click', (event) => {
            const itemId = item.dataset.id;
            const itemType = item.dataset.type; // Will be 'sub-category', 'model', or 'product'
            handleGridItemClick(itemId, itemType);
        });
    });
}

// --- 6. Grid Item Click Handler ---
function handleGridItemClick(itemId, itemType) {
    if (itemType === 'sub-category') {
        const subCategory = catalogueData[currentCategory].items.find(item => item.id === itemId);
        if (!subCategory) {
            console.warn(`Sub-category data not found for ID: ${itemId}`);
            return;
        }

        if (subCategory.page === 'products') {
            // If sub-category directly leads to products (e.g., "Brake Pads" in "Spares")
            // This assumes product data is stored directly under "product-itemId" key
            const productsForSubCategory = catalogueData[`product-${itemId}`] ? [catalogueData[`product-${itemId}`]] : [];
            // If you have a list of products under a sub-category, it would be more like:
            // const productsForSubCategory = catalogueData[`products-under-${itemId}`]?.items || [];

            showSection('products', subCategory.name, productsForSubCategory);
            currentView = 'products';
        } else if (subCategory.page === 'models') {
            // If sub-category leads to models (e.g., "Scooters" -> "450X", "450S")
            const models = catalogueData[`${currentCategory}`]?.items.filter(item => item.type === 'model') || []; // Filter for models within the main category's items
            if (models.length > 0) {
                showSection('models', `${subCategory.name} Models`, models);
                currentView = 'models';
            } else {
                console.warn(`No models found for ${itemId} within ${currentCategory}`);
                showSection('models', `${subCategory.name} Models`, []); // Show empty grid
            }
        } else if (subCategory.page === 'locations') {
            // Handle special cases like map locations
            alert(`Redirecting to map for ${subCategory.name}! (Not implemented in this example)`);
            // You could use window.location.href or open a new map modal here
        }

    } else if (itemType === 'model') {
        currentModel = itemId;
        // Load products for the selected model
        const modelProducts = catalogueData[`products-for-${itemId}`]?.items || []; // Use optional chaining for safety

        if (modelProducts.length > 0) {
            // Find the model's actual name for the title
            const modelName = catalogueData[currentCategory]?.items.find(item => item.id === itemId)?.name || "Selected Model";
            showSection('products', `${modelName} Products`, modelProducts);
            currentView = 'products';
        } else {
            console.warn(`No products found for model ${itemId}`);
            showSection('products', `${catalogueData[currentCategory]?.items.find(item => item.id === itemId)?.name || "Selected Model"} Products`, []); // Show empty grid
        }
    } else if (itemType === 'product') {
        // Open modal for actual product details
        const productId = itemId;
        openProductModal(productId);
    }
}


// --- 7. Main Category Card Event Listener ---
mainCategoriesSection.addEventListener('click', (event) => {
    const card = event.target.closest('.category-card');
    if (card) {
        currentCategory = card.dataset.category;
        const categoryData = catalogueData[currentCategory];

        if (categoryData) {
            // **THIS IS THE KEY CHANGE:** Check for redirectPage first
            if (categoryData.redirectPage) {
                window.location.href = categoryData.redirectPage; // Redirects in the same tab
                return; // Stop further execution
            }

            // Existing logic for categories that load dynamically on the same page
            if (categoryData.items) {
                showSection('subCategories', categoryData.title, categoryData.items);
                currentView = 'subCategories';
            } else {
                console.warn(`No items found for dynamic display in category: ${currentCategory}`);
                // Optionally, show an empty state or error message here
            }
        } else {
            console.warn(`No data found for category: ${currentCategory}`);
        }
    }
});


// --- 8. Product Modal Functions ---
function openProductModal(productId) {
    const product = catalogueData[`product-${productId}`]; // Fetch actual product data

    if (!product) {
        console.error("Product data not found for ID:", productId);
        return;
    }

    // Reset carousel state
    currentProductImageIndex = 0;
    thumbnailNav.innerHTML = '';
    mainProductImage.src = '';
    mainProductImage.alt = '';
    mainProductImage.classList.add('hidden'); // Hide until image is loaded/available

    modalLoading.classList.remove('hidden');
    modelDetailsContainer.classList.add('hidden');
    productModal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent scrolling background

    // Simulate loading
    setTimeout(() => {
        modalTitle.textContent = product.name;
        // Check for partCode and add it if present
        const partCodeHtml = product.partCode ? `<p class="modal-part-code">Part Code: ${product.partCode}</p>` : '';
        modalDescription.innerHTML = `${product.description}${partCodeHtml}`; // Add part code below description

        // Populate product details grid
        const modalProductDetails = document.getElementById('modalProductDetails');
        modalProductDetails.innerHTML = ''; // Clear previous details
        if (product.specifications && product.specifications.length > 0) {
            let detailsHtml = '<div class="product-specs-grid">';
            product.specifications.forEach(spec => {
                detailsHtml += `
                    <div class="spec-item">
                        <strong>${spec.key}:</strong> <span>${spec.value}</span>
                    </div>
                `;
            });
            detailsHtml += '</div>';
            modalProductDetails.insertAdjacentHTML('beforeend', detailsHtml);
        }

        // Setup image carousel
        if (product.images && product.images.length > 0) {
            product.images.forEach((imgSrc, index) => {
                const thumbnail = document.createElement('img');
                thumbnail.src = imgSrc;
                thumbnail.alt = `${product.name} Thumbnail ${index + 1}`;
                thumbnail.dataset.index = index;
                thumbnail.addEventListener('click', () => showProductImage(index));
                thumbnailNav.appendChild(thumbnail);
            });
            showProductImage(0); // Show the first image
            prevImageBtn.classList.remove('hidden'); // Show controls if images exist
            nextImageBtn.classList.remove('hidden');
            thumbnailNav.classList.remove('hidden');
            mainProductImage.classList.remove('hidden'); // Show main image now
        } else {
            // Hide carousel controls if no images
            prevImageBtn.classList.add('hidden');
            nextImageBtn.classList.add('hidden');
            thumbnailNav.classList.add('hidden');
            mainProductImage.classList.add('hidden'); // Ensure it's hidden if no images
        }

        modalLoading.classList.add('hidden');
        modelDetailsContainer.classList.remove('hidden');
    }, 500); // Simulate network delay
}

function closeProductModal() {
    productModal.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
    // Also close fullscreen if it's open
    closeFullscreenImage();
}

closeButton.addEventListener('click', closeProductModal);
productModal.addEventListener('click', (event) => {
    if (event.target === productModal) { // Close when clicking outside content
        closeProductModal();
    }
});

// Carousel Navigation
prevImageBtn.addEventListener('click', () => {
    // We need the currently displayed product's data to navigate its images
    const currentProductInModal = Object.values(catalogueData).find(data => data.name === modalTitle.textContent && data.images); // Crude way to get product from modal title
    if (currentProductInModal && currentProductInModal.images) {
        currentProductImageIndex = (currentProductImageIndex - 1 + currentProductInModal.images.length) % currentProductInModal.images.length;
        showProductImage(currentProductImageIndex);
    }
});

nextImageBtn.addEventListener('click', () => {
    const currentProductInModal = Object.values(catalogueData).find(data => data.name === modalTitle.textContent && data.images);
    if (currentProductInModal && currentProductInModal.images) {
        currentProductImageIndex = (currentProductImageIndex + 1) % currentProductInModal.images.length;
        showProductImage(currentProductImageIndex);
    }
});

function showProductImage(index) {
    const currentProductInModal = Object.values(catalogueData).find(data => data.name === modalTitle.textContent && data.images);
    if (currentProductInModal && currentProductInModal.images && currentProductInModal.images[index]) {
        mainProductImage.src = currentProductInModal.images[index];
        mainProductImage.alt = `${currentProductInModal.name} Image ${index + 1}`;
        currentProductImageIndex = index;

        // Update active thumbnail class
        thumbnailNav.querySelectorAll('img').forEach((img, i) => {
            if (i === index) {
                img.classList.add('active-thumbnail');
            } else {
                img.classList.remove('active-thumbnail');
            }
        });
    }
}


// Fullscreen Image Viewer
mainProductImage.addEventListener('click', () => {
    const currentProductInModal = Object.values(catalogueData).find(data => data.name === modalTitle.textContent && data.images);
    if (currentProductInModal && currentProductInModal.images && currentProductInModal.images.length > 0) {
        currentFullscreenImageIndex = currentProductImageIndex; // Start fullscreen from current carousel image
        openFullscreenImage(currentProductInModal.images, currentFullscreenImageIndex);
    }
});

function openFullscreenImage(images, startIndex) {
    // Directly pass and use images array for fullscreen for robustness
    fullscreenImage.dataset.images = JSON.stringify(images); // Store for nav
    fullscreenOverlay.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent scrolling background
    showFullscreenImage(startIndex);
}

function closeFullscreenImage() {
    fullscreenOverlay.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
    fullscreenImage.removeAttribute('data-images'); // Clear stored images
}

fullscreenClose.addEventListener('click', closeFullscreenImage);

fullscreenPrevBtn.addEventListener('click', () => {
    const images = JSON.parse(fullscreenImage.dataset.images || '[]');
    if (images.length > 0) {
        currentFullscreenImageIndex = (currentFullscreenImageIndex - 1 + images.length) % images.length;
        showFullscreenImage(currentFullscreenImageIndex);
    }
});

fullscreenNextBtn.addEventListener('click', () => {
    const images = JSON.parse(fullscreenImage.dataset.images || '[]');
    if (images.length > 0) {
        currentFullscreenImageIndex = (currentFullscreenImageIndex + 1) % images.length;
        showFullscreenImage(currentFullscreenImageIndex);
    }
});

function showFullscreenImage(index) {
    const images = JSON.parse(fullscreenImage.dataset.images || '[]');
    if (images[index]) {
        fullscreenImage.src = images[index];
        fullscreenImage.alt = `Full screen image ${index + 1}`;
        currentFullscreenImageIndex = index;
    }
}

// Global click handler to close modal if clicking outside (already handled by modal listener, but kept for clarity)
// window.addEventListener('click', (event) => {
//     if (event.target === productModal) {
//         closeProductModal();
//     }
// });

// Ensure initial view is categories if not already handled by HTML
document.addEventListener('DOMContentLoaded', showCategoryList);

// Back button listener
backButtonContainer.addEventListener('click', goBack);