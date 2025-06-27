// Ensure GSAP and ScrollTrigger are loaded before this script runs
document.addEventListener('DOMContentLoaded', () => {

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin); // Also register ScrollToPlugin

    // --- DOM Elements ---
    const subCategorySection = document.getElementById('subCategorySection');
    const subCategoryTitle = document.getElementById('subCategoryTitle');
    const subCategoryGrid = subCategorySection.querySelector('.sub-category-grid');
    const modelSelectionSection = document.getElementById('modelSelectionSection');
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const backButton = document.getElementById('backButton'); // Back button to index.html

    // Modal elements
    const mainModal = document.getElementById('mainModal'); // The main modal container
    const closeModalButton = document.getElementById('closeModalButton');
    const modalLoading = document.getElementById('modalLoading'); // Loading state in modal
    const modelDetailsContainer = document.getElementById('modelDetailsContainer'); // Model info view
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const viewProductsBtn = document.getElementById('viewProductsBtn');

    const productListContainer = document.getElementById('productListContainer'); // Products list view
    const currentModelNameSpan = document.getElementById('currentModelName');
    const productsGrid = document.getElementById('productsGrid');
    const backToModelDetailsBtn = document.getElementById('backToModelDetails');

    const productDetailContainer = document.getElementById('productDetailContainer'); // Single product detail view
    const productDetailName = document.getElementById('productDetailName');
    const productDetailPartCode = document.getElementById('productDetailPartCode');
    const mainProductImage = document.getElementById('mainProductImage'); // Main image in detail view
    const thumbnailNav = document.getElementById('thumbnailNav'); // Thumbnails for carousel
    const prevImageBtn = document.getElementById('prevImageBtn');
    const nextImageBtn = document.getElementById('nextImageBtn');
    const productDetailDescription = document.getElementById('productDetailDescription');
    const productSpecifications = document.getElementById('productSpecifications'); // For product specs
    const backToProductListBtn = document.getElementById('backToProductList');

    // Fullscreen overlay elements
    const fullscreenOverlay = document.getElementById('fullscreenOverlay');
    const fullscreenImage = document.getElementById('fullscreenImage');
    const closeFullscreenBtn = document.getElementById('closeFullscreen');
    const fullscreenPrevBtn = document.getElementById('fullscreenPrevBtn');
    const fullscreenNextBtn = document.getElementById('fullscreenNextBtn');

    // Search elements
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const searchResultsGrid = document.getElementById('searchResultsGrid');


    // --- Data Structure for Sub-Categories (Expand this greatly with real data) ---
    const catalogueData = {
        spares: {
            title: "Spares Categories",
            items: [
                { id: "spares-batteries", name: "Batteries & Power", image: "images/spares/batteries-icon.png", description: "High-performance battery packs and charging components." },
                { id: "spares-body-panels", name: "Body & Panels", image: "images/spares/body-panels-icon.png", description: "Replacement body parts and aesthetic panels." },
                { id: "spares-drivetrain", name: "Drivetrain", image: "images/spares/drivetrain-icon.png", description: "Motor, controller, and transmission components." },
                { id: "spares-brakes", name: "Brakes & Suspension", image: "images/spares/brakes-icon.png", description: "Braking system parts and suspension components." }
            ]
        },
        'accessories-merchandise': {
            title: "Accessories & Merchandise Categories",
            items: [
                { id: "anm-accessories", name: "Accessories", image: "images/anm/accessories-icon.png", description: "Essential and aesthetic add-ons for your scooter." },
                { id: "anm-merchandise", name: "Merchandise", image: "images/anm/merchandise-icon.png", description: "Apparel, collectibles, and lifestyle products." },
                { id: "anm-helmets-gear", name: "Helmets & Gear", image: "images/anm/helmets-icon.png", description: "Safety helmets and riding gear." },
                { id: "anm-upgrades", name: "Performance Upgrades", image: "images/anm/upgrades-icon.png", description: "Enhance your scooter's performance." }
            ]
        },
        'charging-infrastructure': {
            title: "Charging Infrastructure Solutions",
            items: [
                { id: "ci-home-chargers", name: "Home Chargers", image: "images/ci/home-charger-icon.png", description: "Personal charging units for your home." },
                { id: "ci-public-network", name: "Public Network", image: "images/ci/public-charger-icon.png", description: "Information on Ather Grid public charging points." }
            ]
        }
    };

    // --- Placeholder Data for Models (Expand this as needed) ---
    // In a real app, you might fetch models dynamically based on the category/sub-category
    const modelsData = [
        { id: "ather-450x", name: "Ather 450X", image: "images/models/ather450x.png", description: "The flagship intelligent electric scooter, offering exhilarating performance and smart features. This model represents the pinnacle of Ather's engineering and design, providing a seamless and connected riding experience." },
        { id: "ather-450s", name: "Ather 450S", image: "images/models/ather450s.png", description: "The new entry point into the Ather experience, balancing performance with affordability. The 450S is designed for daily commutes, offering efficient power delivery and essential smart features for urban mobility." }
        // Add more models here
    ];

    // --- Placeholder Data for Products (Crucial: Expand this with ALL your products) ---
    // Products should ideally have 'modelId' (or 'all') and 'categoryId' (or 'all')
    // Added 'specifications' array for product details
    const productsData = [
        // Products for Ather 450X - Batteries & Power
        { id: "battery-pack-450x", modelId: "ather-450x", categoryId: "spares-batteries", name: "Ather 450X High-Density Battery Pack", partCode: "ATH-BP-450X-HD", images: ["images/products/battery-pack-1.jpg", "images/products/battery-pack-2.jpg", "images/products/battery-pack-3.jpg"], description: "Genuine high-density battery pack for Ather 450X, ensuring optimal range and performance. Designed for durability and long life.", specifications: [{key: "Capacity", value: "3.7 kWh"}, {key: "Voltage", value: "50.4 V"}]},
        { id: "motor-controller-450x", modelId: "ather-450x", categoryId: "spares-drivetrain", name: "Ather 450X Motor Controller Unit", partCode: "ATH-MCU-450X", images: ["images/products/motor-controller-1.jpg", "images/products/motor-controller-2.jpg"], description: "Advanced motor controller unit for precise power management and smooth acceleration. Ensures efficient energy conversion.", specifications: [{key: "Type", value: "PMSM Controller"}, {key: "Max Power", value: "6 kW"}]},
        { id: "front-fender-450x", modelId: "ather-450x", categoryId: "spares-body-panels", name: "Ather 450X Front Fender (Black)", partCode: "ATH-FF-450X-BLK", images: ["images/products/front-fender-1.jpg", "images/products/front-fender-2.jpg"], description: "Original front fender in matte black, perfect replacement for damaged parts. Ensures protection from splashes and debris.", specifications: [{key: "Material", value: "ABS Plastic"}, {key: "Color", value: "Matte Black"}]},
        { id: "brake-pads-450x", modelId: "ather-450x", categoryId: "spares-brakes", name: "Ather 450X Performance Brake Pads", partCode: "ATH-BRPD-450X", images: ["images/products/brake-pads-1.jpg", "images/products/brake-pads-2.jpg"], description: "High-performance ceramic brake pads for the 450X, offering superior stopping power and durability.", specifications: [{key: "Compound", value: "Ceramic"}, {key: "Compatibility", value: "450X Front/Rear"}]},

        // Products for Ather 450S - Batteries & Power
        { id: "battery-pack-450s", modelId: "ather-450s", categoryId: "spares-batteries", name: "Ather 450S Standard Battery Pack", partCode: "ATH-BP-450S-STD", images: ["images/products/battery-pack-1.jpg", "images/products/battery-pack-2.jpg"], description: "Standard capacity battery pack for Ather 450S, optimized for daily commutes. Reliable power source for your ride.", specifications: [{key: "Capacity", value: "2.9 kWh"}, {key: "Voltage", value: "48 V"}]},
        { id: "brake-lever-450s", modelId: "ather-450s", categoryId: "spares-brakes", name: "Ather 450S Brake Lever Set", partCode: "ATH-BRL-450S", images: ["images/products/brake-lever-1.jpg"], description: "Durable aluminum alloy brake lever set for Ather 450S. Ensures responsive braking control.", specifications: [{key: "Material", value: "Aluminum Alloy"}, {key: "Position", value: "Left & Right"}]},

        // Accessories & Merchandise - Accessories (applicable to 'all' models)
        { id: "scooter-cover", modelId: "all", categoryId: "anm-accessories", name: "All-Weather Scooter Cover", partCode: "ATH-ACC-SC01", images: ["images/products/scooter-cover-1.jpg", "images/products/scooter-cover-2.jpg"], description: "Premium waterproof and dustproof cover for all Ather models. Protects your scooter from elements.", specifications: [{key: "Material", value: "Polyester"}, {key: "Features", value: "UV Protection, Dustproof"}]},
        { id: "seat-cover", modelId: "all", categoryId: "anm-accessories", name: "Comfort Seat Cover", partCode: "ATH-ACC-SC02", images: ["images/products/seat-cover-1.jpg"], description: "Ergonomic seat cover for enhanced riding comfort. Easy to install and clean.", specifications: [{key: "Material", value: "Mesh Fabric"}, {key: "Features", value: "Breathable, Anti-slip"}]},

        // Accessories & Merchandise - Merchandise
        { id: "ather-tshirt", modelId: "all", categoryId: "anm-merchandise", name: "Ather Branded T-Shirt", partCode: "ATH-MERCH-TS01", images: ["images/products/tshirt-1.jpg", "images/products/tshirt-2.jpg"], description: "High-quality cotton t-shirt with Ather branding. Available in various sizes.", specifications: [{key: "Material", value: "100% Cotton"}, {key: "Sizes Available", value: "S, M, L, XL"}]},
        { id: "ather-keychain", modelId: "all", categoryId: "anm-merchandise", name: "Ather Logo Keychain", partCode: "ATH-MERCH-KC01", images: ["images/products/keychain-1.jpg"], description: "Stylish metal keychain with embossed Ather logo.", specifications: [{key: "Material", value: "Zinc Alloy"}, {key: "Finish", value: "Matte Chrome"}]},


        // Charging Infrastructure - Home Chargers
        { id: "ather-dot", modelId: "all", categoryId: "ci-home-chargers", name: "Ather Dot Home Charger", partCode: "ATH-CI-DOT", images: ["images/products/ather-dot-1.jpg", "images/products/ather-dot-2.jpg"], description: "Compact and efficient home charging solution for all Ather scooters. Easy to install and manage via the app.", specifications: [{key: "Charging Speed", value: "1.2 kW"}, {key: "Installation", value: "Wall Mountable"}, {key: "Connectivity", value: "Wi-Fi"}]},
        { id: "portable-charger", modelId: "all", categoryId: "ci-home-chargers", name: "Portable Charger", partCode: "ATH-CI-PORT", images: ["images/products/portable-charger-1.jpg"], description: "Convenient portable charger for on-the-go charging needs.", specifications: [{key: "Power Output", value: "650 W"}, {key: "Weight", value: "2 kg"}]},

        // Charging Infrastructure - Public Network (Example entry)
        { id: "ather-grid-info", modelId: "all", categoryId: "ci-public-network", name: "Ather Grid Public Charging Network", partCode: "ATH-CI-GRIDINFO", images: ["images/products/grid-station-1.jpg", "images/products/grid-station-2.jpg"], description: "Information and guidance on accessing the widespread Ather Grid fast-charging network across cities.", specifications: [{key: "Type", value: "Fast Charging"}, {key: "Availability", value: "24/7 (most locations)"}, {key: "Access", value: "Ather App"}]}

        // Add more products for other categories and models as per your actual inventory
    ];


    // --- State Management ---
    let currentState = 'subCategories'; // Initial state for category pages
    let currentSubCategory = null; // Stores which sub-category was clicked
    let currentModel = null; // Stores which model was clicked (for modal)
    let currentProduct = null; // Stores which product is being viewed in detail in the modal
    let currentProductImageIndex = 0; // For carousel and fullscreen image viewer

    // Determine the current main category based on the URL (e.g., 'spares', 'accessories-merchandise')
    const pathSegments = window.location.pathname.split('/');
    const currentPageFileName = pathSegments[pathSegments.length - 1];
    const currentMainCategory = currentPageFileName.split('.')[0];


    // --- Helper Functions ---

    /**
     * Hides all primary content sections on the sub-page.
     */
    function hideAllContentSections() {
        subCategorySection.classList.add('hidden');
        modelSelectionSection.classList.add('hidden');
        searchResultsContainer.classList.add('hidden');
    }

    /**
     * Shows a specific primary content section.
     * @param {HTMLElement} section - The section to show.
     */
    function showSection(section) {
        hideAllContentSections();
        section.classList.remove('hidden');
        // Scroll to the top of the newly shown section
        gsap.to(window, { duration: 0.5, scrollTo: { y: section.offsetTop - 100 } });
    }

    /**
     * Renders the sub-category grid based on the determined main category.
     */
    function renderSubCategories() {
        subCategoryGrid.innerHTML = ''; // Clear previous content
        const data = catalogueData[currentMainCategory];

        if (!data || !data.items || data.items.length === 0) {
            subCategoryGrid.innerHTML = '<p style="text-align: center; color: #666;">No sub-categories found for this section.</p>';
            return;
        }

        subCategoryTitle.textContent = data.title; // Set the title of the sub-category section

        data.items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'figure-item'; // Reusing 'figure-item' for consistent styling
            card.dataset.subCategoryId = item.id; // Store sub-category ID
            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <figcaption>${item.name}</figcaption>
                <p>${item.description}</p>
            `;
            subCategoryGrid.appendChild(card);
        });

        // Apply GSAP animation to the newly rendered items
        animateGridItems('.sub-category-grid .figure-item');
    }

    /**
     * Renders the model selection grid based on the selected sub-category.
     * (Currently shows all models. In a real app, filter based on relevance.)
     * @param {string} subCategoryId - The ID of the sub-category (e.g., 'spares-batteries').
     */
    function renderModels(subCategoryId) {
        const modelGrid = modelSelectionSection.querySelector('.model-selection-grid');
        modelGrid.innerHTML = ''; // Clear previous model content

        // Filter models if specific models are relevant to certain sub-categories
        // For now, show all models.
        const modelsToShow = modelsData.filter(model => {
            // Example: If 'spares-batteries' only applies to 'ather-450x',
            // you'd have a logic here, e.g., if (subCategoryId === 'spares-batteries') return model.id === 'ather-450x';
            return true; // Show all for now
        });

        if (modelsToShow.length === 0) {
            modelGrid.innerHTML = '<p style="text-align: center; color: #666;">No specific models apply to this category, showing general products.</p>';
            // If no specific models, maybe auto-show all relevant products directly?
            // Or indicate there are no model-specific products.
            // For now, just show the message.
            return;
        }

        modelsToShow.forEach(model => {
            const card = document.createElement('div');
            card.className = 'figure-item';
            card.dataset.modelId = model.id;
            card.innerHTML = `
                <img src="${model.image}" alt="${model.name}">
                <figcaption>${model.name}</figcaption>
            `;
            modelGrid.appendChild(card);
        });
        animateGridItems('.model-selection-grid .figure-item');
    }

    /**
     * Renders products for a given model and sub-category within the modal.
     * @param {string} modelId - The ID of the selected model.
     * @param {string} subCategoryId - The ID of the selected sub-category.
     */
    function renderProductsForModel(modelId, subCategoryId) {
        productsGrid.innerHTML = ''; // Clear previous products

        // Filter products based on both modelId and categoryId
        const filteredProducts = productsData.filter(product =>
            (product.modelId === modelId || product.modelId === 'all') &&
            (product.categoryId === subCategoryId || product.categoryId === 'all')
        );

        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = '<p style="text-align: center; color: #666;">No products found for this model and category.</p>';
            return;
        }

        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.productId = product.id; // Store product ID
            // Use optional chaining for images[0] in case it's missing
            productCard.innerHTML = `
                <img src="${product.images?.[0] || 'images/placeholder-product.png'}" alt="${product.name}">
                <h3>${product.name}</h3>
                ${product.partCode ? `<p class="part-code">Part Code: ${product.partCode}</p>` : ''}
                <p>${product.description.substring(0, 100)}...</p>
            `;
            productsGrid.appendChild(productCard);
        });
        animateGridItems('#productsGrid .product-card');
    }

    /**
     * Displays details for a specific product in the modal's product detail view.
     * @param {string} productId - The ID of the product to display.
     */
    function displayProductDetail(productId) {
        currentProduct = productsData.find(p => p.id === productId);
        if (!currentProduct) {
            console.error("Product not found:", productId);
            return;
        }

        productDetailName.textContent = currentProduct.name;
        productDetailPartCode.textContent = `Part Code: ${currentProduct.partCode || 'N/A'}`;
        productDetailDescription.textContent = currentProduct.description;

        // Populate product specifications
        productSpecifications.innerHTML = ''; // Clear previous specs
        if (currentProduct.specifications && currentProduct.specifications.length > 0) {
            let specsHtml = '<div class="product-specs-grid">';
            currentProduct.specifications.forEach(spec => {
                specsHtml += `
                    <div class="spec-item">
                        <strong>${spec.key}:</strong> <span>${spec.value}</span>
                    </div>
                `;
            });
            specsHtml += '</div>';
            productSpecifications.innerHTML = specsHtml;
        } else {
            productSpecifications.innerHTML = '<p class="no-specs">No specifications available.</p>';
        }

        // Reset and populate carousel
        currentProductImageIndex = 0;
        updateCarousel(); // Show first image
        populateThumbnails(); // Build thumbnail navigation

        productListContainer.classList.add('hidden');
        productDetailContainer.classList.remove('hidden');
    }

    /**
     * Updates the main image in the product detail carousel.
     */
    function updateCarousel() {
        if (!currentProduct || !currentProduct.images || currentProduct.images.length === 0) {
            mainProductImage.src = 'images/placeholder-product.png'; // Fallback image
            mainProductImage.alt = 'No image available';
            // Hide carousel controls if no images
            prevImageBtn.classList.add('hidden');
            nextImageBtn.classList.add('hidden');
            thumbnailNav.classList.add('hidden');
            return;
        }
        mainProductImage.src = currentProduct.images[currentProductImageIndex];
        mainProductImage.alt = `${currentProduct.name} image ${currentProductImageIndex + 1}`;

        // Show carousel controls if images exist
        prevImageBtn.classList.remove('hidden');
        nextImageBtn.classList.remove('hidden');
        thumbnailNav.classList.remove('hidden');

        updateThumbnailActiveState();
    }

    /**
     * Populates the thumbnail navigation for the carousel.
     */
    function populateThumbnails() {
        thumbnailNav.innerHTML = '';
        if (!currentProduct || !currentProduct.images) return;

        currentProduct.images.forEach((imageSrc, index) => {
            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = `Thumbnail ${index + 1}`;
            img.dataset.index = index;
            if (index === currentProductImageIndex) {
                img.classList.add('active-thumbnail');
            }
            img.addEventListener('click', () => {
                currentProductImageIndex = index;
                updateCarousel();
            });
            thumbnailNav.appendChild(img);
        });
    }

    /**
     * Updates the 'active-thumbnail' class on thumbnails and scrolls the active one into view.
     */
    function updateThumbnailActiveState() {
        thumbnailNav.querySelectorAll('img').forEach((img, index) => {
            if (index === currentProductImageIndex) {
                img.classList.add('active-thumbnail');
                // Scroll active thumbnail into view if it's outside the scrollable area
                img.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            } else {
                img.classList.remove('active-thumbnail');
            }
        });
    }


    // --- Modal Functions ---

    /**
     * Opens the main modal and shows loading state.
     */
    function openModal() {
        mainModal.classList.add('show');
        modalLoading.classList.remove('hidden');
        modelDetailsContainer.classList.add('hidden');
        productListContainer.classList.add('hidden');
        productDetailContainer.classList.add('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
    }

    /**
     * Closes the main modal.
     */
    function closeModal() {
        mainModal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
        currentModel = null; // Clear modal state
        currentProduct = null;
        currentProductImageIndex = 0;
        // Also ensure fullscreen is closed if open
        closeFullscreen();
    }

    /**
     * Opens the fullscreen image viewer.
     */
    function openFullscreen() {
        if (currentProduct && currentProduct.images && currentProduct.images.length > 0) {
            fullscreenImage.src = currentProduct.images[currentProductImageIndex];
            fullscreenOverlay.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling background
        }
    }

    /**
     * Closes the fullscreen image viewer.
     */
    function closeFullscreen() {
        fullscreenOverlay.classList.remove('show');
        // Restore body scroll only if modal is also closed, otherwise modal should keep it hidden
        if (!mainModal.classList.contains('show')) {
            document.body.style.overflow = '';
        }
    }

    // --- Search Functionality (Page-specific search) ---
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (searchTerm) {
            let results = [];
            // Filter products within the current category scope
            productsData.forEach(product => {
                const isRelevantCategory = (product.categoryId === currentSubCategory || product.categoryId === 'all');
                const isRelevantModel = (product.modelId === currentModel?.id || product.modelId === 'all');

                if ((product.name.toLowerCase().includes(searchTerm) ||
                     product.description.toLowerCase().includes(searchTerm) ||
                     (product.partCode && product.partCode.toLowerCase().includes(searchTerm))) &&
                    isRelevantCategory && isRelevantModel)
                {
                    results.push(product);
                }
            });
            displaySearchResults(results, searchTerm);
        } else {
            hideSearchResults(); // If search input is empty, clear results
        }
    });

    function displaySearchResults(results, searchTerm) {
        searchResultsGrid.innerHTML = '';
        if (results.length > 0) {
            results.forEach(item => {
                const resultCard = `
                    <div class="product-card search-result-card" data-product-id="${item.id}">
                        <img src="${item.images?.[0] || 'images/placeholder-product.png'}" alt="${item.name}">
                        <h3>${item.name}</h3>
                        ${item.partCode ? `<p class="part-code">Part Code: ${item.partCode}</p>` : ''}
                        <p>${item.description.substring(0, 100)}...</p>
                    </div>
                `;
                searchResultsGrid.insertAdjacentHTML('beforeend', resultCard);
            });

            // Add event listeners to search result cards to open modal
            searchResultsGrid.querySelectorAll('.search-result-card').forEach(card => {
                card.addEventListener('click', () => {
                    openModal(); // Open main modal
                    // Now, need to directly show product detail in the modal for search results
                    // This bypasses model/product list views
                    modalLoading.classList.add('hidden');
                    displayProductDetail(card.dataset.productId);
                });
            });

            showSection(searchResultsContainer);
            currentState = 'search-results';
        } else {
            searchResultsGrid.innerHTML = `<p style="text-align: center; color: #666;">No results found for "${searchTerm}" in this category.</p>`;
            showSection(searchResultsContainer);
            currentState = 'search-results';
        }
    }

    function hideSearchResults() {
        searchResultsContainer.classList.add('hidden');
        searchResultsGrid.innerHTML = ''; // Clear results
        searchInput.value = ''; // Clear search input
        // Return to the previous state before search
        if (currentState === 'search-results') { // Only if we were previously in search
            if (currentModel) {
                showSection(modelSelectionSection); // Go back to models if a model was selected
                currentState = 'models';
            } else {
                showSection(subCategorySection); // Go back to sub-categories
                currentState = 'subCategories';
            }
        }
    }


    // --- Event Listeners ---

    // Event listener for Sub-Category Card Clicks
    subCategoryGrid.addEventListener('click', (event) => {
        const card = event.target.closest('.figure-item');
        if (card) {
            currentSubCategory = card.dataset.subCategoryId; // Store which sub-category was clicked
            showSection(modelSelectionSection); // Show model selection section
            currentState = 'models'; // Update current state
            renderModels(currentSubCategory); // Render models for the chosen sub-category
        }
    });

    // Event listener for Model Selection Card Clicks (to open modal)
    modelSelectionSection.addEventListener('click', (event) => {
        const card = event.target.closest('.figure-item');
        if (card) {
            const modelId = card.dataset.modelId;
            currentModel = modelsData.find(model => model.id === modelId);

            if (currentModel) {
                openModal();
                // Simulate loading for demonstration
                setTimeout(() => {
                    modalLoading.classList.add('hidden');
                    modelDetailsContainer.classList.remove('hidden');
                    modalImage.src = currentModel.image;
                    modalTitle.textContent = currentModel.name;
                    modalDescription.textContent = currentModel.description;
                }, 500); // Simulate 0.5 second load time
            }
        }
    });

    // Close Modal Button
    closeModalButton.addEventListener('click', closeModal);

    // View Products Button inside modal (from model details)
    viewProductsBtn.addEventListener('click', () => {
        if (currentModel && currentSubCategory) {
            modelDetailsContainer.classList.add('hidden');
            productListContainer.classList.remove('hidden');
            currentModelNameSpan.textContent = currentModel.name;
            renderProductsForModel(currentModel.id, currentSubCategory);
        } else {
            // Fallback for cases where a product might be directly accessible without model/sub-category
            console.warn("View Products clicked without a selected model or sub-category. Implement fallback if needed.");
            // Example fallback: show all products for the main category
            // productsGrid.innerHTML = 'Showing all products in category...';
            // renderProductsForModel('all', currentMainCategory); // You'd need to adjust filter logic
        }
    });

    // Back to Model Details button inside modal (from product list)
    backToModelDetailsBtn.addEventListener('click', () => {
        productListContainer.classList.add('hidden');
        modelDetailsContainer.classList.remove('hidden');
        productsGrid.innerHTML = ''; // Clear products grid
    });

    // Event listener for Product Card Clicks inside the modal (from product list)
    productsGrid.addEventListener('click', (event) => {
        const productCard = event.target.closest('.product-card');
        if (productCard) {
            const productId = productCard.dataset.productId;
            displayProductDetail(productId);
        }
    });

    // Back to Product List button inside modal (from product detail view)
    backToProductListBtn.addEventListener('click', () => {
        productDetailContainer.classList.add('hidden');
        productListContainer.classList.remove('hidden');
        currentProduct = null; // Clear current product for next detail view
        currentProductImageIndex = 0;
    });

    // Carousel Navigation
    prevImageBtn.addEventListener('click', () => {
        if (currentProduct && currentProduct.images && currentProduct.images.length > 0) {
            currentProductImageIndex = (currentProductImageIndex - 1 + currentProduct.images.length) % currentProduct.images.length;
            updateCarousel();
        }
    });

    nextImageBtn.addEventListener('click', () => {
        if (currentProduct && currentProduct.images && currentProduct.images.length > 0) {
            currentProductImageIndex = (currentProductImageIndex + 1) % currentProduct.images.length;
            updateCarousel();
        }
    });

    // Fullscreen Image Overlay Triggers
    mainProductImage.addEventListener('click', openFullscreen);
    closeFullscreenBtn.addEventListener('click', closeFullscreen);

    fullscreenPrevBtn.addEventListener('click', () => {
        if (currentProduct && currentProduct.images) {
            currentProductImageIndex = (currentProductImageIndex - 1 + currentProduct.images.length) % currentProduct.images.length;
            fullscreenImage.src = currentProduct.images[currentProductImageIndex];
        }
    });

    fullscreenNextBtn.addEventListener('click', () => {
        if (currentProduct && currentProduct.images) {
            currentProductImageIndex = (currentProductImageIndex + 1) % currentProduct.images.length;
            fullscreenImage.src = currentProduct.images[currentProductImageIndex];
        }
    });

    // Back Button Logic for sub-pages (Handles navigation back within the category page or to index.html)
    backButton.addEventListener('click', () => {
        if (currentState === 'search-results') {
            hideSearchResults(); // Clear search results and go back to previous view
        }
        else if (currentState === 'models') {
            showSection(subCategorySection); // Go back to sub-categories
            currentState = 'subCategories';
            currentSubCategory = null; // Clear sub-category state
            modelSelectionSection.querySelector('.model-selection-grid').innerHTML = ''; // Clear models grid
        } else if (currentState === 'subCategories') {
            // If on sub-categories, back button goes to index.html
            const redirectPage = backButton.dataset.redirect || 'index.html'; // Fallback to index.html
            window.location.href = redirectPage;
        }
    });

    // --- GSAP Animation Function ---
    // This function animates elements (fading in and sliding up) when they enter the viewport.
    function animateGridItems(selector) {
        gsap.utils.toArray(selector).forEach(item => {
            gsap.fromTo(item,
                { opacity: 0, translateY: 50 }, // Initial state
                {
                    opacity: 1,
                    translateY: 0,
                    duration: 0.8, // Animation duration
                    ease: "power3.out", // Easing function
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%", // Animation starts when top of item is 85% down from viewport top
                        toggleActions: "play none none none", // Play animation once
                        // markers: true // Uncomment for visual debugging of ScrollTrigger
                    }
                }
            );
        });
    }

    // On page load, render the specific sub-category grid for this page
    if (currentMainCategory) {
        renderSubCategories();
    }
});