class StickyProductModal extends HTMLElement {
    constructor() {
        super();
        this.currentStep = 1;
        this.numSteps = 0; // Initialize numSteps
    }

    get productHandle() {
        return this.getAttribute('data-handle');
    }

    connectedCallback() {
        this.render();
        this.fetchProductData(this.productHandle);
        console.log('Product Handle: ' + this.productHandle);
    }

    createSteps(product) {
        const stepsContainer = document.querySelector('.steps');
        let finalStep = document.getElementById('step' + (this.numSteps + 1));
    
        // Calculate the number of steps based on product.options
        const numSteps = product.options.length;
        // Set the number of steps as an instance variable
        this.numSteps = numSteps;
    
        product.options.slice(0, numSteps).forEach((option, index) => {
            if (index < 2) { // Limit to the first two options, you can remove this condition if you want all options
                const optionName = option.name;
                // Create HTML elements
                const step = document.createElement('div');
                step.className = 'step';
                step.id = `step${index + 1}`;
    
                const title = document.createElement('h2');
                title.textContent = `Step ${index + 1}: Select ${optionName}:`;
    
                const label = document.createElement('label');
                label.setAttribute('for', optionName.toLowerCase());
                label.textContent = `Choose ${optionName}:`;
    
                const select = document.createElement('select');
                select.className = 'option-selector';
                select.id = optionName.toLowerCase();
    
                // Log option values for debugging
                console.log('Option Values ' + optionName + ' - ' + option.values);
    
                // Iterate through option.values to add them as options in the select element
                option.values.forEach(optionValue => {
                    const optionElement = document.createElement('option');
                    optionElement.value = optionValue;
                    optionElement.textContent = optionValue;
                    select.appendChild(optionElement);
                });
    
                const button = document.createElement('button');
                button.className = 'btn';
                button.id = `nextStep${index + 1}`;
                button.textContent = 'Next';
    
                // Append elements to the container
                step.appendChild(title);
                step.appendChild(label);
                step.appendChild(select);
                step.appendChild(button);
    
                // Check if finalStep exists before inserting elements
                if (finalStep) {
                    stepsContainer.insertBefore(step, finalStep);
                } else {
                    stepsContainer.appendChild(step);
                }
            }
        });

        
        // Create the final step for product information
        finalStep = document.createElement('div'); // Reassign finalStep here
        finalStep.className = 'step';
        finalStep.id = 'step' + (numSteps + 1);
    
        const finalStepHeading = document.createElement('h2');
        finalStepHeading.textContent = `Step ${numSteps + 1}: Product Information`;
        finalStep.appendChild(finalStepHeading);
    
        const finalStepProdInf = document.createElement('div');
        finalStepProdInf.className = 'product-info';
        finalStep.appendChild(finalStepProdInf);
    
        // Create placeholders for dynamic content
        const productImage = document.createElement('img');
        productImage.id = 'product-image';
        const productName = document.createElement('h3');
        productName.id = 'product-name';
        const selectedPrice = document.createElement('p');
        selectedPrice.id = 'selectedPrice';
        const selectedModel = document.createElement('p');
        selectedModel.id = 'selectedModel';
        const selectedColor = document.createElement('p');
        selectedColor.id = 'selectedColor';
        const productQuantity = document.createElement('label');
        productQuantity.setAttribute('for', 'quantity');
        const inputQuantity = document.createElement('input');
        inputQuantity.setAttribute('type', 'number');
        inputQuantity.setAttribute('value', '1');
        inputQuantity.id = 'quantity';
        const productAvailability = document.createElement('p');
        productAvailability.id = 'availability';
        const addToCartFinalStep = document.createElement('button');
        addToCartFinalStep.className = 'btn add_to_cart';
        addToCartFinalStep.id = 'addToCart';
        addToCartFinalStep.textContent = 'Add to Cart';
    
        finalStepProdInf.appendChild(productImage);
        finalStepProdInf.appendChild(productName);
        finalStepProdInf.appendChild(selectedPrice);
        finalStepProdInf.appendChild(selectedModel);
        finalStepProdInf.appendChild(selectedColor);
        finalStepProdInf.appendChild(productQuantity);
        finalStepProdInf.appendChild(inputQuantity);
        finalStepProdInf.appendChild(productAvailability);
        finalStepProdInf.appendChild(addToCartFinalStep);
    
        stepsContainer.appendChild(finalStep);
        // stepsContainer.insertBefore(step, finalStep);
    
        // Show the first step
        this.showStep(1);
    }
    

    setupEventListeners() {
        // Add an event listener to the "Add to Cart" button
        const addToCartButton = document.getElementById('addToCart');

        // Access numSteps from the instance
        const numSteps = this.numSteps;

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

        // Inside the setupEventListeners method
        const nextStepButtons = document.querySelectorAll('.btn');
        nextStepButtons.forEach((button, index) => {
            button.id = `nextStep${index + 1}`;
            button.addEventListener('click', () => {
                const currentStep = parseInt(button.id.replace('nextStep', ''));

                if (currentStep < numSteps) {
                    this.nextStep(currentStep + 1); // Move to the next step
                } else if (currentStep === numSteps) {
                    // Handle moving from the last option step to the final step
                    this.nextStep('next'); // Move to the final step
                } else if (currentStep === numSteps + 1) {
                    // Handle moving from the final step back to the last option step
                    this.nextStep(numSteps); // Move back to the last option step
                }
            });
        });
    }

    openModal() {
        this.modal.style.display = 'block';
    }

    closeModal() {
        this.modal.style.display = 'none';
        this.currentStep = 3;
        this.showStep(this.currentStep);
    }

    nextStep(direction) {
        // Define the 'step' variable within this function
        let step = this.currentStep; // Initialize it with the current step
    
        if (direction === 'next' && step < this.numSteps) {
            step++;
        } else if (direction === 'prev' && step > 1) {
            step--;
        }
    
        // Now, you can use the 'step' variable to show the desired step
        this.showStep(step);
    }

    showStep(step) {
        const steps = document.getElementsByClassName('step');
        for (let i = 0; i < steps.length; i++) {
            steps[i].style.display = 'none';
        }
        const currentStepElement = steps[step - 1];
        currentStepElement.style.display = 'block';
    
        // Update the timeline to reflect the current step
        const timelineRadios = document.getElementsByName('step');
        for (let i = 0; i < timelineRadios.length; i++) {
            const timelineStep = timelineRadios[i].parentNode.querySelector('.timeline-step');
            if (parseInt(timelineRadios[i].value) === step) {
                timelineStep.classList.add('active');
            } else {
                timelineStep.classList.remove('active');
            }
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

            this.createSteps(product);

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

            console.log('Is Variant In stock ' + isVariantInStock);

            // Update the button's disabled attribute based on availability
            //addToCartButton.classList.add('disabled');

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
                console.log('Option value ' + optionValue);
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
    
                // Check if this.productData and this.productData.product are defined
               // console.log('Data product:', JSON.stringify(this.productData.product, null, 2));

                // Check if this.productData and this.productData.product are defined
                if (this.productData && this.productData.product) {
                    // Log each property of this.productData.product
                    //console.log('Data product:');
                    for (const prop in this.productData.product) {
                        if (this.productData.product.hasOwnProperty(prop)) {
                            //console.log(`${prop}:`, this.productData.product[prop]);
                        }
                    }
                    const product = this.productData.product;
                    console.log('Product =>', product);
                    // You can now access properties of 'product' and pass it to createSteps
                    this.createSteps(product);
    
                    
                    
                    // Now, you can also call setupEventListeners() here
                    this.setupEventListeners();

                    // Set the initial step
                    this.showStep(1);

                    this.updateProductInfo();
                } else {
                    console.error('Product data or product not found:', this.productData);
                }

            })
            // .catch(error => {
            //     console.error('Error fetching product data: ', error);
            // });
    }
    

    render() {
        // Move the modal HTML structure out of the loop
        this.innerHTML = `
        <div id="myModal" class="modal">
            <div class="modal-content">
                <span class="close" id="closeModal">&times;</span>
                <div class="steps"></div>
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
