class StickyProductModal extends HTMLElement {
    constructor() {
        super();
        this.currentStep = 1;
    }

    get productHandle() {
        return this.getAttribute('data-handle');
    }

    connectedCallback() {
        this.render();
        this.fetchProductData(this.productHandle);
        console.log('Product Handle: ' + this.productHandle);
    }

    openModal() {
        this.modal.style.display = 'block';
    }

    closeModal() {
        this.modal.style.display = 'none';
        this.currentStep = 3;
        this.showStep(this.currentStep);
    }

    // Function to move to the next step
    nextStep(step) {
        const timelineRadios = document.getElementsByName('step');
        for (let i = 0; i < timelineRadios.length; i++) {
            if (timelineRadios[i].value == step) {
                timelineRadios[i].checked = true;
                break;
            }
        }

        this.currentStep = step; // Update the currentStep property

        // Call the showStep method to display the current step
        this.showStep(this.currentStep);
    }

    // Function to show a specific step
    showStep(step) {
        const steps = document.getElementsByClassName('step');
        for (let i = 0; i < steps.length; i++) {
            steps[i].style.display = 'none';
        }
        steps[step - 1].style.display = 'block';

        // Update the timeline to reflect the current step
        const timelineRadios = document.getElementsByName('step');
        for (let i = 0; i < timelineRadios.length; i++) {
            const timelineStep = timelineRadios[i].parentNode.querySelector('.timeline-step');
            if (timelineRadios[i].value == step) {
                timelineStep.classList.add('active');
            } else {
                timelineStep.classList.remove('active');
            }
        }

        if (step === 3) {
            // Update product information in step 3
            const selectedModel = document.getElementById('model').value;
            const selectedColor = document.getElementById('color').value;
            document.getElementById('selectedModel').textContent = selectedModel;
            document.getElementById('selectedColor').textContent = selectedColor;
        }
    }

    // Function to add the product to the cart
    addToCart() {
        // Get the selected model, color, and quantity
        const selectedModel = document.getElementById('selectedModel').textContent;
        const selectedColor = document.getElementById('selectedColor').textContent;
        const quantity = parseInt(document.getElementById('quantity').value);

        // Check if a valid model, color, and quantity are provided
        if (!selectedModel || !selectedColor || isNaN(quantity) || quantity <= 0) {
            alert('Please select a valid model, color, and quantity.');
            return;
        }

        // Find the variant based on the selected model and color
        const selectedVariant = this.findVariantByOptions(selectedModel, selectedColor);

        // Check if the variant exists
        if (!selectedVariant) {
            alert('Selected model and color combination not found.');
            return;
        }

        // Create a cart item object
        const cartItem = {
            id: selectedVariant.id,
            quantity: quantity
        };

        // Use the Shopify AJAX API to add the product to the cart
        fetch('/cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: [cartItem] }),
        })
        .then(response => response.json())
        .then(data => {
            // Redirect to the cart page upon successful addition
            window.location.href = '/cart'; // Adjust the URL as needed
        })
        .catch(error => {
            console.error('Error adding item to cart:', error);
            alert('An error occurred while adding the item to the cart.');
        });
    }

    // Function to find a product variant by selected options
    findVariantByOptions(selectedModel, selectedColor) {
        // Check if productData is available
        if (this.productData) {
            const variants = this.productData.product.variants;
            // Find the variant that matches the selected options
            return variants.find(variant => {
                return variant.option1 === selectedModel && variant.option2 === selectedColor;
            });
        }
        return null;
    }

    // Function to check availability (customize as needed)
    checkAvailability(selectedModel, selectedColor) {
        const selectedVariant = this.findVariantByOptions(selectedModel, selectedColor);
    if (selectedVariant) {
        // Assuming you have an "inventory_quantity" property in your variant object
        const inventoryQuantity = selectedVariant.inventory_quantity;
        if (inventoryQuantity > 0) {
            return `In Stock (${inventoryQuantity} available)`;
        } else {
            return 'Out of Stock';
        }
    } else {
        return 'Variant not found'; // Handle the case where the variant is not found
    }
    }

    // Add a method to update the product information in step 3
    updateProductInfo() {
        const productImage = this.querySelector('#product-image');
        const productName = this.querySelector('#product-name');
        const modalContent = this.querySelector('.modal-content');
        const timeline = this.querySelector('.timeline');
        
        
        // Get the "Add to Cart" button
        const addToCartButton = document.getElementById('addToCart');

        // Check if productData is available
        if (this.productData) {
            const product = this.productData.product;
            const variants = product.variants;

            // Set the product information
            productImage.setAttribute('src', product.image.src);
            productImage.style.height = '200px';
            productName.textContent = product.title;

            // Get a reference to the <select> elements
            const modelSelect = this.querySelector('#model');
            const colorSelect = this.querySelector('#color');

            // Get the selected model and color
            const selectedModel = modelSelect.value;
            const selectedColor = colorSelect.value;

            // Check variant availability
            const isVariantInStock = this.checkAvailability(selectedModel, selectedColor);

            console.log('Is Variant In stock '+ isVariantInStock);

            // Update the button's disabled attribute based on availability
            addToCartButton.classList.add = 'disabled';

            // Create an array to store unique option1 values
            const uniqueOption1Values = [];

            // Iterate through variants to collect unique option1 values
            for (let i = 0; i < variants.length; i++) {
                const variant = variants[i];
                const option1 = variant.option1;

                // Check if option1 is not already in the uniqueOption1Values array
                if (!uniqueOption1Values.includes(option1)) {
                    uniqueOption1Values.push(option1);
                }
            }

            // Populate the <select> element with options based on unique option1 values
            for (let i = 0; i < uniqueOption1Values.length; i++) {
                const optionValue = uniqueOption1Values[i];
                const optionElement = document.createElement('option');
                optionElement.value = optionValue;
                optionElement.textContent = optionValue;
                modelSelect.appendChild(optionElement);
            }

            // Get a reference to the <select> element
           // const colorSelect = this.querySelector('#color');

            // Create an array to store unique option2 values
            const uniqueOption2Values = [];

            // Iterate through variants to collect unique option2 values
            for (let i = 0; i < variants.length; i++) {
                const variant = variants[i];
                const option2 = variant.option2;

                // Check if option2 is not already in the uniqueOption2Values array
                if (!uniqueOption2Values.includes(option2)) {
                    uniqueOption2Values.push(option2);
                }
            }

            // Populate the <select> element with options based on unique option2 values
            for (let i = 0; i < uniqueOption2Values.length; i++) {
                const optionValue = uniqueOption2Values[i];
                const optionElement = document.createElement('option');
                optionElement.value = optionValue;
                optionElement.textContent = optionValue;
                console.log('Option value '+ optionValue);
                colorSelect.appendChild(optionElement);
            }

            // Print the entire product JSON information to the console
            console.log('Product Data:', this.productData);
        }
    }

    fetchProductData(productHandle) {
        // Construct the Shopify product URL
        const productUrl = `https://dev-ygeia.myshopify.com/products/${productHandle}.json`;
        console.log('Product URL: ' + productUrl);
        // Fetch product data using the URL
        fetch(productUrl)
            .then(response => response.json())
            .then(data => {
                this.productData = data;
                this.updateProductInfo();
            })
            .catch(error => {
                console.error('Error fetching product data: ', error);
            });
    }


    render() {
        // Move the modal HTML structure out of the loop
        this.innerHTML = `
        <div id="myModal" class="modal">
            <div class="modal-content">
                <span class="close" id="closeModal">&times;</span>
                <div class="step" id="step1">
                    <h2>Step 1: Select Model</h2>
                    <label for="model">Choose a Model:</label>
                    <select class="option-selector" id="model"></select>
                    <button class="btn" id="nextStep1">Next</button>
                </div>
                <div class="step" id="step2">
                    <h2>Step 2: Select Color</h2>
                    <label for="color">Choose a Color:</label>
                    <select class="option-selector" id="color"></select>
                    <button class="btn" id="nextStep2">Next</button>
                </div>
                <div class="step" id="step3">
                    <h2>Step 3: Product Information</h2>
                    <div class="product-info">
                        <img src="" alt="" id="product-image">
                        <div class="product-details">
                            <h3 id="product-name">Product Name</h3>
                            <p id="selectedPrice"></p>
                            <p>Model: <span id="selectedModel"></span></p>
                            <p>Color: <span id="selectedColor"></span></p>
                            <label for="quantity">Quantity:</label>
                            <input type="number" id="quantity" value="1">
                            <p id="availability"></p>
                            
                            <button class="btn add_to_cart" id="addToCart">Add to Cart</button>
                        </div>
                    </div>
                </div>
                <!-- Timeline to display the user's progress -->
                <div class="timeline">
                    <label>
                        <input type="radio" name="step" value="1" checked>
                        <div class="timeline-step active" id="radio-step1">Step 1</div>
                    </label>
                    <label>
                        <input type="radio" name="step" value="2">
                        <div class="timeline-step" id="radio-step2">Step 2</div>
                    </label>
                    <label>
                        <input type="radio" name="step" value="3">
                        <div class="timeline-step" id="radio-step3">Review</div>
                    </label>
                </div>
            </div>
        </div>
        `;


        // Add event listeners to the radio inputs in the timeline
        const timelineRadios = document.getElementsByName('step');
        for (let i = 0; i < timelineRadios.length; i++) {
            timelineRadios[i].addEventListener('change', (event) => {
                const selectedStep = parseInt(event.target.value);
                this.nextStep(selectedStep);
            });
        }
        
        // Add an event listener to the "Add to Cart" button
        const addToCartButton = document.getElementById('addToCart');
        // Event listener for the "Add to Cart" button
        addToCartButton.addEventListener('click', () => {
            const selectedModel = document.getElementById('selectedModel').textContent;
            const selectedColor = document.getElementById('selectedColor').textContent;

            // Check availability before adding to the cart
            const availability = this.checkAvailability(selectedModel, selectedColor);
            if (availability.includes('Out of Stock')) {
                alert('This variant is out of stock and cannot be added to the cart.');
                return;
            }

            this.addToCart();
        });

        const nextStepButton1 = document.getElementById('nextStep1');
        nextStepButton1.addEventListener('click', () => {
            this.nextStep(2); // Move to Step 2
        });

        const nextStepButton2 = document.getElementById('nextStep2');
        nextStepButton2.addEventListener('click', () => {
            this.nextStep(3); // Move to Step 3
        });

        // Initialize modal elements
        this.openModalButton = document.getElementById('configure-product-button');
        this.modal = this.querySelector('#myModal');
        this.closeModalButton = this.querySelector('#closeModal');

        // Event listener for the "Buy" button
        this.openModalButton.addEventListener('click', () => {
            this.openModal();
        });

        // Event listener for the close button
        this.closeModalButton.addEventListener('click', () => {
            this.closeModal();
        });
    }
}

customElements.define('sticky-product-modal', StickyProductModal);
