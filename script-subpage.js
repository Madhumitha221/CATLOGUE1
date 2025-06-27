// Ensure GSAP and ScrollTrigger are loaded before this script runs
document.addEventListener('DOMContentLoaded', () => {

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // --- DOM Elements ---
    const subCategorySection = document.getElementById('subCategorySection');
    const subCategoryTitle = document.getElementById('subCategoryTitle');
    const subCategoryGrid = subCategorySection.querySelector('.sub-category-grid');
    const modelSelectionSection = document.getElementById('modelSelectionSection');
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const backButton = document.getElementById('backButton');

    // Modal elements
    const mainModal = document.getElementById('mainModal');
    const closeModalButton = document.getElementById('closeModalButton');
    const modalLoading = document.getElementById('modalLoading');
    const modelDetailsContainer = document.getElementById('modelDetailsContainer');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const viewProductsBtn = document.getElementById('viewProductsBtn');
    const productListContainer = document.getElementById('productListContainer');
    const currentModelNameSpan = document.getElementById('currentModelName');
    const productsGrid = document.getElementById('productsGrid');
    const backToModelDetailsBtn = document.getElementById('backToModelDetails');
    const productDetailContainer = document.getElementById('productDetailContainer');
    const productDetailName = document.getElementById('productDetailName');
    const productDetailPartCode = document.getElementById('productDetailPartCode'); // Fixed typo
    const mainProductImage = document.getElementById('mainProductImage');
    const thumbnailNav = document.getElementById('thumbnailNav');
    const prevImageBtn = document.getElementById('prevImageBtn');
    const nextImageBtn = document.getElementById('nextImageBtn'); // Fixed typo
    const productDetailDescription = document.getElementById('productDetailDescription');
    const backToProductListBtn = document.getElementById('backToProductList');

    // Fullscreen overlay elements
    const fullscreenOverlay = document.getElementById('fullscreenOverlay');
    const fullscreenImage = document.getElementById('fullscreenImage');
    const closeFullscreenBtn = document.getElementById('closeFullscreen');
    const fullscreenPrevBtn = document.getElementById('fullscreenPrevBtn');
    const fullscreenNextBtn = document.getElementById('fullscreenNextBtn');


    // --- Data Structure for Sub-Categories (You can expand this greatly) ---
    const catalogueData = {
        spares: {
            title: "Select the Model", // This title implies selecting a model for spares
            items: [
                {
                    id: "spares-batteries", // Changed ID to be category-specific
                    name: "Batteries & Power",
                    image: "images/450SLOGO.jpg",
                    description: "Advanced battery packs and power management systems for various models, ensuring peak performance and longevity.",
                    associatedModels: ["ather-450s", "ather-450x", "ather-rizta"] // Explicitly list associated models
                },
                {
                    id: "spares-body-panels", // Changed ID
                    name: "Body & Panels",
                    image: "images/450XLOGO.jpeg",
                    description: "Genuine replacement body panels and chassis components designed to perfectly fit your Ather, restoring its sleek look.",
                    associatedModels: ["ather-450x", "ather-450s", "ather-rizta"]
                },
                {
                    id: "spares-drivetrain", // Changed ID
                    name: "Drivetrain",
                    image: "images/Riztalogo.jpg",
                    description: "Essential drivetrain components for Ather models, including motor, controller, and transmission parts for smooth and efficient power delivery.",
                    associatedModels: ["ather-450x", "ather-450s", "ather-rizta"]
                },
                {
                    id: "spares-brakes-suspension", // Changed ID
                    name: "Brakes & Suspension",
                    image: "images/mh.jpg",
                    description: "High-quality braking and suspension parts for various Ather models, crucial for safety and a comfortable ride.",
                    associatedModels: ["ather-450x", "ather-450s", "ather-rizta"]
                }
            ]
        },
        'accessories-merchandise': {
            title: "Select the Model/Category", // More appropriate title
            items: [
                {
                    id: "accessories-450s", // More descriptive ID
                    name: "Accessories for 450S",
                    image: "images/450SLOGO.jpg",
                    description: "Explore a range of custom accessories designed to enhance your Ather 450S experience, from practical add-ons to aesthetic upgrades.",
                    associatedModels: ["ather-450s"] // Directly links to 450S
                },
                {
                    id: "accessories-450x", // More descriptive ID
                    name: "Accessories for 450X",
                    image: "images/450XLOGO.jpeg",
                    description: "Discover premium accessories and performance upgrades tailored specifically for your Ather 450X, boosting style and functionality.",
                    associatedModels: ["ather-450x"]
                },
                {
                    id: "accessories-rizta", // More descriptive ID
                    name: "Accessories for Rizta",
                    image: "images/Riztalogo.jpg",
                    description: "Browse stylish and functional accessories specifically made for the Ather Rizta, ensuring comfort and customization for your daily commute.",
                    associatedModels: ["ather-rizta"]
                },
                {
                    id: "anm-helmets-merchandise", // More descriptive ID
                    name: "General Helmets & Merch",
                    image: "images/anm/helmets-icon.png",
                    description: "Check out official Ather branded helmets for safety, and exclusive apparel and merchandise for all enthusiasts to showcase their Ather pride.",
                    associatedModels: ["all"] // Applies to all models or generic
                }
            ]
        },
        'charging-infrastructure': {
            title: "Select Charging Option", // Adjusted title
            items: [
                {
                    id: "ci-home-chargers",
                    name: "Home Chargers",
                    image: "images/ci/home-charger-icon.png",
                    description: "Convenient and efficient home charging solutions for your Ather scooter, ensuring you're always ready for your next ride.",
                    associatedModels: ["all"]
                },
                {
                    id: "ci-public-network",
                    name: "Public Network",
                    image: "images/ci/public-charger-icon.png",
                    description: "Access information on Ather Grid public fast-charging points across cities, making long rides worry-free and convenient.",
                    associatedModels: ["all"]
                }
            ]
        }
    };

    // --- Placeholder Data for Models and Products (Expand this as needed) ---
    const modelsData = [
        { id: "ather-450x", name: "Ather 450X", image: "images/450XLOGO.jpeg", description: "The flagship intelligent electric scooter, offering exhilarating performance and smart features. This model represents the pinnacle of Ather's engineering and design, providing a seamless and connected riding experience." },
        { id: "ather-450s", name: "Ather 450S", image: "images/450SLOGO.jpg", description: "The new entry point into the Ather experience, balancing performance with affordability. The 450S is designed for daily commutes, offering efficient power delivery and essential smart features for urban mobility." },
        { id: "ather-rizta", name: "Ather Rizta", image: "images/Riztalogo.jpg", description: "The family electric scooter designed for comfort, space, and smart connectivity for everyday urban travel." }
        // Add more models here
    ];

    const productsData = [
        // Products for Ather 450X - Batteries & Power (categoryId changed)
        { id: "battery-pack-450x", modelId: "ather-450x", categoryId: "spares-batteries", name: "Ather 450X High-Density Battery Pack", partCode: "ATH-BP-450X-HD", images: ["images/products/battery-pack-1.jpg", "images/products/battery-pack-2.jpg", "images/products/battery-pack-3.jpg"], description: "Genuine high-density battery pack for Ather 450X, ensuring optimal range and performance. Designed for durability and long life." },
        { id: "motor-controller-450x", modelId: "ather-450x", categoryId: "spares-drivetrain", name: "Ather 450X Motor Controller Unit", partCode: "ATH-MCU-450X", images: ["images/products/motor-controller-1.jpg", "images/products/motor-controller-2.jpg"], description: "Advanced motor controller unit for precise power management and smooth acceleration. Ensures efficient energy conversion." },
        { id: "front-fender-450x", modelId: "ather-450x", categoryId: "spares-body-panels", name: "Ather 450X Front Fender", partCode: "ATH-FF-450X-BLK", images: ["images/products/front-fender-1.jpg"], description: "Original front fender in matte black, perfect replacement for damaged parts. Ensures protection from splashes and debris." },

        // Products for Ather 450S - Batteries & Power (categoryId changed)
        { id: "battery-pack-450s", modelId: "ather-450s", categoryId: "spares-batteries", name: "Ather 450S Standard Battery Pack", partCode: "ATH-BP-450S-STD", images: ["images/products/battery-pack-1.jpg", "images/products/battery-pack-2.jpg"], description: "Standard capacity battery pack for Ather 450S, optimized for daily commutes. Reliable power source for your ride." },
        { id: "brake-lever-450s", modelId: "ather-450s", categoryId: "spares-brakes-suspension", name: "Ather 450S Brake Lever Set", partCode: "ATH-BRL-450S", images: ["images/products/brake-lever-1.jpg"], description: "Durable aluminum alloy brake lever set for Ather 450S. Ensures responsive braking control." },

        // Products for Rizta - Drivetrain (example)
        { id: "rizta-motor-assembly", modelId: "ather-rizta", categoryId: "spares-drivetrain", name: "Ather Rizta Motor Assembly", partCode: "ATH-RZT-MOT", images: ["images/products/rizta-motor.jpg"], description: "Complete motor assembly for Ather Rizta, ensuring smooth and reliable performance." },


        // Accessories & Merchandise - Accessories for 450S (new categoryId)
        { id: "450s-footrest", modelId: "ather-450s", categoryId: "accessories-450s", name: "450S Premium Footrest", partCode: "ACC-450S-FR01", images: ["images/products/450s-footrest.jpg"], description: "Stylish and comfortable footrest designed specifically for the Ather 450S." },
        { id: "450s-seat-upgrade", modelId: "ather-450s", categoryId: "accessories-450s", name: "450S Comfort Seat Upgrade", partCode: "ACC-450S-SEAT", images: ["images/products/450s-seat.jpg"], description: "Enhanced comfort seat for longer rides on your Ather 450S." },

        // Accessories & Merchandise - Accessories for 450X (new categoryId)
        { id: "450x-guard", modelId: "ather-450x", categoryId: "accessories-450x", name: "450X Body Guard Kit", partCode: "ACC-450X-BG", images: ["images/products/450x-guard.jpg"], description: "Protective body guard kit for Ather 450X, safeguarding against scratches and minor impacts." },
        { id: "450x-charger-mount", modelId: "ather-450x", categoryId: "accessories-450x", name: "450X Fast Charger Mount", partCode: "ACC-450X-FCM", images: ["images/products/450x-charger-mount.jpg"], description: "Secure and convenient mount for your Ather 450X portable charger." },


        // Accessories & Merchandise - General Accessories (categoryId changed)
        { id: "scooter-cover", modelId: "all", categoryId: "anm-accessories", name: "All-Weather Scooter Cover", partCode: "ATH-ACC-SC01", images: ["images/products/scooter-cover-1.jpg", "images/products/scooter-cover-2.jpg"], description: "Premium waterproof and dustproof cover for all Ather models. Protects your scooter from elements." },
        { id: "seat-cover", modelId: "all", categoryId: "anm-accessories", name: "Comfort Seat Cover", partCode: "ATH-ACC-SC02", images: ["images/products/seat-cover-1.jpg"], description: "Ergonomic seat cover for enhanced riding comfort. Easy to install and clean." },


        // Accessories & Merchandise - Merchandise (categoryId changed)
        { id: "ather-tshirt", modelId: "all", categoryId: "anm-helmets-merchandise", name: "Ather Branded T-Shirt", partCode: "ATH-MERCH-TS01", images: ["images/products/tshirt-1.jpg"], description: "High-quality cotton t-shirt with Ather branding. Available in various sizes." },
        { id: "ather-helmet-open-face", modelId: "all", categoryId: "anm-helmets-merchandise", name: "Ather Open Face Helmet", partCode: "ATH-HELMET-OF01", images: ["images/products/helmet-open-face.jpg"], description: "Stylish and safe open-face helmet with Ather branding." },


        // Charging Infrastructure - Home Chargers (categoryId unchanged)
        { id: "ather-dot", modelId: "all", categoryId: "ci-home-chargers", name: "Ather Dot Home Charger", partCode: "ATH-CI-DOT", images: ["images/products/ather-dot-1.jpg", "images/products/ather-dot-2.jpg"], description: "Compact and efficient home charging solution for all Ather scooters. Easy to install." },
        { id: "ather-portable-charger", modelId: "all", categoryId: "ci-home-chargers", name: "Ather Portable Charger", partCode: "ATH-CI-PORT", images: ["images/products/portable-charger.jpg"], description: "Lightweight and versatile portable charger for on-the-go charging." }


        // Add more products for other categories and models
    ];


    // --- State Management for sub-pages ---
    let currentState = 'subCategories'; // Always start on subCategories when landing on these pages
    let currentSubCategoryItem = null; // Stores the entire sub-category item object that was clicked
    let currentModel = null; // Stores which model was clicked (for modal)
    let currentProduct = null; // Stores which product is being viewed in detail
    let currentProductImageIndex = 0; // For carousel

    // Determine the current main category based on the URL
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
                <figcaption>${item.name}</figcaption> <p>${item.description}</p>
            `;
            subCategoryGrid.appendChild(card);
        });

        // Apply GSAP animation to the newly rendered items
        animateGridItems('.sub-category-grid .figure-item');
    }

    /**
     * Renders the model selection grid based on the selected sub-category.
     * @param {object} subCategoryItem - The selected sub-category item object.
     */
    function renderModels(subCategoryItem) {
        const modelsToShow = modelsData.filter(model => {
            // If the sub-category has specific associated models, filter by them.
            // Otherwise, show all models (for generic categories like 'general spares').
            if (subCategoryItem.associatedModels && subCategoryItem.associatedModels.length > 0 && subCategoryItem.associatedModels[0] !== 'all') {
                return subCategoryItem.associatedModels.includes(model.id);
            }
            return true; // Show all models if no specific filter or if 'all' is specified
        });

        const modelGrid = modelSelectionSection.querySelector('.model-selection-grid');
        modelGrid.innerHTML = ''; // Clear previous model content

        if (modelsToShow.length === 0) {
            modelGrid.innerHTML = '<p style="text-align: center; color: #666;">No models available for this category.</p>';
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
        gsap.to(window, { duration: 0.5, scrollTo: { y: modelSelectionSection.offsetTop - 100 } });
    }

    /**
     * Renders products for a given model and sub-category within the modal.
     * @param {string} modelId - The ID of the selected model.
     * @param {string} subCategoryId - The ID of the selected sub-category.
     */
    function renderProductsForModel(modelId, subCategoryId) {
        productsGrid.innerHTML = ''; // Clear previous products

        const filteredProducts = productsData.filter(product =>
            (product.modelId === modelId || product.modelId === 'all') &&
            (product.categoryId === subCategoryId || product.categoryId === 'all')
        );

        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = '<p style="text-align: center; color: #666;">No products found for this combination.</p>';
            return;
        }

        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.productId = product.id; // Store product ID
            productCard.innerHTML = `
                <img src="${product.images[0]}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="part-code">Part Code: ${product.partCode}</p>
                <p>${product.description.substring(0, 100)}...</p>
            `;
            productsGrid.appendChild(productCard);
        });
        animateGridItems('#productsGrid .product-card');
    }

    /**
     * Displays details for a specific product in the modal.
     * @param {string} productId - The ID of the product to display.
     */
    function displayProductDetail(productId) {
        currentProduct = productsData.find(p => p.id === productId);
        if (!currentProduct) return;

        productDetailName.textContent = currentProduct.name;
        productDetailPartCode.textContent = `Part Code: ${currentProduct.partCode}`;
        productDetailDescription.textContent = currentProduct.description;

        // Reset and populate carousel
        currentProductImageIndex = 0;
        updateCarousel();
        populateThumbnails();

        productListContainer.classList.add('hidden');
        productDetailContainer.classList.remove('hidden');
    }

    /**
     * Updates the main image in the carousel.
     */
    function updateCarousel() {
        if (!currentProduct || !currentProduct.images || currentProduct.images.length === 0) {
            mainProductImage.src = '';
            return;
        }
        mainProductImage.src = currentProduct.images[currentProductImageIndex];
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
     * Updates the 'active-thumbnail' class on thumbnails.
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
    }


    // --- Event Listeners ---

    // Event listener for Sub-Category Card Clicks
    subCategoryGrid.addEventListener('click', (event) => {
        const card = event.target.closest('.figure-item');
        if (card) {
            const subCategoryId = card.dataset.subCategoryId;
            currentSubCategoryItem = catalogueData[currentMainCategory].items.find(item => item.id === subCategoryId);

            if (currentSubCategoryItem) {
                // If a sub-category is specifically tied to one model and is an 'accessories' type
                // or if it implies a direct product listing, we can adjust the flow.
                if (currentMainCategory === 'accessories-merchandise' && currentSubCategoryItem.associatedModels.length === 1 && currentSubCategoryItem.associatedModels[0] !== 'all') {
                    // This is a direct "Accessories for [Model]" click
                    const impliedModelId = currentSubCategoryItem.associatedModels[0];
                    currentModel = modelsData.find(model => model.id === impliedModelId);

                    if (currentModel) {
                        openModal();
                        // Directly show product list for the implied model and sub-category
                        setTimeout(() => {
                            modalLoading.classList.add('hidden');
                            productListContainer.classList.remove('hidden');
                            currentModelNameSpan.textContent = currentModel.name; // Display the model name
                            renderProductsForModel(currentModel.id, currentSubCategoryItem.id);
                        }, 500);
                    }
                } else {
                    // For general sub-categories (like 'spares') or 'general accessories/merch',
                    // proceed to model selection.
                    showSection(modelSelectionSection);
                    currentState = 'models';
                    renderModels(currentSubCategoryItem); // Pass the entire item for filtering logic
                }
            }
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

    // View Products Button inside modal
    viewProductsBtn.addEventListener('click', () => {
        if (currentModel && currentSubCategoryItem) { // Use currentSubCategoryItem
            modelDetailsContainer.classList.add('hidden');
            productListContainer.classList.remove('hidden');
            currentModelNameSpan.textContent = currentModel.name;
            renderProductsForModel(currentModel.id, currentSubCategoryItem.id); // Pass item.id
        }
    });

    // Back to Model Details button inside modal
    backToModelDetailsBtn.addEventListener('click', () => {
        // If we directly jumped to product list (e.g., from "Accessories for 450S"),
        // going back should close the modal, or go back to sub-categories if preferred.
        // For now, let's make it go back to the model details if it was shown,
        // otherwise, close the modal.
        if (modelDetailsContainer.classList.contains('hidden') && currentMainCategory === 'accessories-merchandise' && currentSubCategoryItem.associatedModels.length === 1 && currentSubCategoryItem.associatedModels[0] !== 'all') {
             closeModal(); // If direct jump, close modal
             // Alternatively, you could go back to the sub-category section if you prefer:
             // showSection(subCategorySection);
             // currentState = 'subCategories';
             // currentSubCategoryItem = null;
        } else {
            productListContainer.classList.add('hidden');
            modelDetailsContainer.classList.remove('hidden');
            productsGrid.innerHTML = ''; // Clear products grid
        }
    });

    // Event listener for Product Card Clicks inside the modal
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
        currentProduct = null;
        currentProductImageIndex = 0;
    });

    // Carousel Navigation
    prevImageBtn.addEventListener('click', () => {
        if (currentProduct && currentProduct.images) {
            currentProductImageIndex = (currentProductImageIndex - 1 + currentProduct.images.length) % currentProduct.images.length;
            updateCarousel();
        }
    });

    nextImageBtn.addEventListener('click', () => {
        if (currentProduct && currentProduct.images) {
            currentProductImageIndex = (currentProductImageIndex + 1) % currentProduct.images.length;
            updateCarousel();
        }
    });

    // Fullscreen Image Overlay
    mainProductImage.addEventListener('click', () => {
        if (currentProduct && currentProduct.images) {
            fullscreenImage.src = currentProduct.images[currentProductImageIndex];
            fullscreenOverlay.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling background
        }
    });

    closeFullscreenBtn.addEventListener('click', () => {
        fullscreenOverlay.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    });

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


    // Back Button Logic for sub-pages
    backButton.addEventListener('click', () => {
        if (currentState === 'models') {
            showSection(subCategorySection); // Go back to sub-categories
            currentState = 'subCategories';
            currentSubCategoryItem = null; // Clear sub-category state
            // No need to re-render sub-categories, they are already there
            gsap.to(window, { duration: 0.5, scrollTo: { y: subCategorySection.offsetTop - 100 } });
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