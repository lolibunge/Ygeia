class StickyProductModal extends HTMLElement {
    constructor() {
        super();
        this.currentStep = 1;
        this.numSteps = 0; // Initialize numSteps
        this.selectedModel = ''; // Initialize selectedModel as an empty string
        this.selectedColor = ''; // Initialize selectedColor as an empty string
        this.productData = null;
        
    }


    get productHandle() {
        return this.getAttribute('data-handle');
    }

    connectedCallback() {
        this.render();
        this.fetchProductData(this.productHandle);
        console.log('Product Handle: ' + this.productHandle);
        this.currentStep = 1; // Initialize the current step to 1
        this.showStep(this.currentStep); 
    }

    createSteps(product) {
        const stepsContainer = document.querySelector('.steps');
        const timeline = document.querySelector('.timeline');
        const numSteps = product.options.length;
        this.numSteps = numSteps;

        // Check if there are no options, i.e., numSteps is 0
        if (numSteps === 1) {
            console.log('no options');
        }else {
            // Iterate through product options to create elements
            product.options.slice(0, numSteps).forEach((option, index) => {
                if (index < 2) {
                    const optionName = option.name;
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

                    const defaultOptionElement = document.createElement('option');
                    defaultOptionElement.textContent = 'Choose an option';
                    select.appendChild(defaultOptionElement);

                    option.values.forEach(optionValue => {
                        const optionElement = document.createElement('option');
                        optionElement.value = optionValue;
                        optionElement.textContent = optionValue;
                        select.appendChild(optionElement);

                        optionElement.addEventListener('change', () => {
                            this.checkOptionsAndEnableNextButtons();
                        });
                    });

                    const button = document.createElement('button');
                    button.className = 'btn';
                    button.id = `nextStep${index + 1}`;
                    button.textContent = 'Next';

                    step.appendChild(title);
                    step.appendChild(label);
                    step.appendChild(select);
                    step.appendChild(button);

                    stepsContainer.appendChild(step);

                    const timelineLabel = document.createElement('label');
                    const timelineInput = document.createElement('input');
                    timelineInput.setAttribute('type', 'radio');
                    timelineInput.setAttribute('name', 'step');
                    timelineInput.setAttribute('value', `${index + 1}`);
                    const timelineStep = document.createElement('div');
                    timelineStep.className = 'timeline-step';
                    timelineStep.id = `radio-step${index + 1}`;
                    timelineStep.textContent = `Step ${index + 1}`;

                    timeline.appendChild(timelineLabel);
                    timelineLabel.appendChild(timelineInput);
                    timelineLabel.appendChild(timelineStep);

                    this.checkOptionsAndEnableNextButtons();
                }
            });

            const finalStep = document.createElement('div');
            finalStep.className = 'step';

            const finalStepHeading = document.createElement('h2');
            finalStep.appendChild(finalStepHeading);
            
        }


        // Create the final step for product information
        const finalStep = document.createElement('div');
        finalStep.className = 'step';

        const finalStepHeading = document.createElement('h2');       
        finalStep.appendChild(finalStepHeading);

        const finalStepProdInf = document.createElement('div');
        finalStepProdInf.className = 'product-info';
        finalStep.appendChild(finalStepProdInf);

        // Create placeholders for dynamic content
        const productImageContainer = document.createElement('div');
        const productImage = document.createElement('img');
        productImage.id = 'product-image';
        const productInfoContainer = document.createElement('div');
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

        if (product.options.length > 1) {
            this.numSteps = numSteps;
            finalStep.id = 'step' + (numSteps + 1);
            finalStepHeading.textContent = `Step ${numSteps + 1}: Product Information`;
        } else {
            const variant = product.variants;
            finalStep.id = 'finalStep';
            finalStepHeading.textContent = 'Final Step: Product Information';
            productImage.src = product.image.src;
            productName.textContent = product.title;
            selectedPrice.textContent = `$${variant[0].price}`;
            console.log('Variant Price: ', variant[0].price);
            //selectedModel.textContent = variant[0].option1;
        }

        productImageContainer.appendChild(productImage);
        productInfoContainer.appendChild(productName);
        productInfoContainer.appendChild(selectedPrice);
        productInfoContainer.appendChild(selectedModel);
        productInfoContainer.appendChild(selectedColor);
        productInfoContainer.appendChild(productQuantity);
        productInfoContainer.appendChild(inputQuantity);
        productInfoContainer.appendChild(productAvailability);
        productInfoContainer.appendChild(addToCartFinalStep);

        finalStepProdInf.appendChild(productImageContainer);
        finalStepProdInf.appendChild(productInfoContainer);

        const finalStepTimelineLable = document.createElement('label');
        const finalStepTimelineInput = document.createElement('input');
        finalStepTimelineInput.setAttribute('type','radio');
        finalStepTimelineInput.setAttribute('name','step');
        finalStepTimelineInput.setAttribute('value','3');
        const finalStepTimelineStep = document.createElement('div');
        finalStepTimelineStep.className = 'timeline-step';
        finalStepTimelineStep.id = 'radio-step3';
        finalStepTimelineStep.textContent = 'Review';

        timeline.appendChild(finalStepTimelineLable);
        finalStepTimelineLable.appendChild(finalStepTimelineInput);
        finalStepTimelineLable.appendChild(finalStepTimelineStep);

        stepsContainer.appendChild(finalStep);
        //stepsContainer.insertBefore(step, finalStep);

        // Show the first step
        this.showStep(1);
        
        
    }


    setupEventListeners() {
        // Add an event listener to the "Add to Cart" button
        const addToCartButton = document.getElementById('addToCart');

        const modelSelect = document.getElementById('model');
        const colorSelect = document.getElementById('color');

        modelSelect.addEventListener('change', () => {
            this.selectedModel = modelSelect.value;
            this.updateProductInfo();
        });

        colorSelect.addEventListener('change', () => {
            this.selectedColor = colorSelect.value;
            this.updateProductInfo();
        });
    
        // Add debugging statements to the addToCartButton event listener
        addToCartButton.addEventListener('click', () => {
            const selectedModel = document.getElementById('selectedModel').textContent;
            const selectedColor = document.getElementById('selectedColor').textContent;
    
            // Check availability before adding to the cart
            const availability = this.checkAvailability(selectedModel, selectedColor);
            console.log('Availability:', availability);
    
            if (availability.includes('Out of Stock')) {
                alert('This variant is out of stock and cannot be added to the cart.');
                return;
            }
    
            this.addToCart();
        });
    
        // Add event listeners to all "Next" buttons
        const nextStepButtons = document.querySelectorAll('.step .btn');
        nextStepButtons.forEach((button, index) => {
            button.id = `nextStep${index + 1}`;
            button.addEventListener('click', () => {
                this.nextStep(button.id); // Pass the button's ID to nextStep
            });
        });
    }
    
    
    checkOptionsAndEnableNextButtons() {
        const selectElements = document.querySelectorAll('.option-selector');
        let areOptionsSelected = true; // Assume all options are selected initially
    
        selectElements.forEach(select => {
            if (select.value === 'Choose an option') {
                areOptionsSelected = false;
            }
        });
    
        // Get the "Next" button for the current step
        const currentStep = this.currentStep;
        const nextStepButton = document.querySelector(`#nextStep${currentStep}`);
    
        // Enable or disable the "Next" button based on option selection
        if (nextStepButton) {
            nextStepButton.disabled = !areOptionsSelected;
        }
    }
    

    updateProductInfo() {
        // Access the product data
        const product = this.productData.product;
    
        // Update the product information placeholders
        const productImage = document.getElementById('product-image');
        const productName = document.getElementById('product-name');
        const selectedPrice = document.getElementById('selectedPrice');
        const selectedModelElement = document.getElementById('selectedModel');
        const selectedColorElement = document.getElementById('selectedColor');
    
        if (this.currentStep === this.numSteps + 1) {
            // Display information for the final step
            productImage.src = product.images[0].src;
            productName.textContent = product.title;
            selectedPrice.textContent = `$${this.getPriceForModel(product, this.selectedModel)}`;
        } else {
            // Display selected model and color for other steps
            productImage.src = ''; // Clear image
            productName.textContent = '';
            selectedPrice.textContent = '';
        }
    
        // Display the selected model and color
        selectedModelElement.textContent = this.selectedModel;
        selectedColorElement.textContent = this.selectedColor;
    }
    
    getPriceForModel(product, model) {
        const variant = product.variants.find(variant => variant.option1 === model);
        return variant ? variant.price : '';
    }

    openModal() {
        this.modal.style.display = 'block';
    }

    closeModal() {
        this.modal.style.display = 'none';
        this.currentStep = 1; // Reset the current step to the first step
        this.showStep(this.currentStep);
    }

    nextStep(buttonId) {

        
        
        const currentStep = this.currentStep;
        
        const nextStep = currentStep + 1;

        // Check if this is the final step
        if (currentStep > this.numSteps) {
            this.closeModal(); // Close the modal on the final step
        } else {
            if(this.selectedModel === ''){
                alert("Please select a Model");
            }else if(this.selectedColor === ''){
                alert("Please select a Color");
            }else {
                this.showStep(nextStep);
                this.currentStep = nextStep;
            }
        }
    }
    
    

    showStep(step) {
        const selectedModelElement = document.getElementById('selectedModel');
        const selectedColorElement = document.getElementById('selectedColor');

        
        // Get all elements with the class "step"
        console.log('Step:', step);
        const steps = document.getElementsByClassName('step');
        console.log('Number of Steps:', steps.length);

        // Check if the step index is valid (between 1 and the number of steps)
        if (step >= 1 && step <= steps.length) {
            // Hide all steps by setting their display style to "none"
            for (let i = 0; i < steps.length; i++) {
                steps[i].style.display = 'none';
            }
    
            // Show the current step by setting its display style to "block"
            const currentStepElement = steps[step - 1];
            currentStepElement.style.display = 'block';
    
            // Update the timeline to reflect the current step
            const timelineRadios = document.getElementsByName('step');
            for (let i = 0; i < timelineRadios.length; i++) {
                const timelineStep = timelineRadios[i].parentNode.querySelector('.timeline-step');
                const timelineStepValue = parseInt(timelineRadios[i].value);
    
                if (timelineStepValue === step) {
                    timelineStep.classList.add('active');
                } else {
                    timelineStep.classList.remove('active');
                }
    
                // Disable timeline radio buttons for steps ahead of the current step
                timelineRadios[i].disabled = timelineStepValue > step;
            }
    
            // Enable or disable "Next" buttons based on the current step
            const nextStepButtons = document.querySelectorAll('.step button');
            nextStepButtons.forEach((button, index) => {
                button.disabled = index + 1 !== step; // Disable buttons for steps other than the current step
            });
        } else {
            // Handle the case where the step index is out of range
            console.error('Invalid step index:', step);
        }
    }
    
    

   // Function to add the product to the cart
    addToCart() {
        // Get the selected model, color, and quantity
        const selectedModel = this.selectedModel; // Use the property directly
        const selectedColor = this.selectedColor; // Use the property directly
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


    findVariantByOptions(selectedModel, selectedColor) {
        // Check if productData is available
        if (this.productData) {
            const variants = this.productData.product.variants;
    
            // Debugging: Log selectedModel and selectedColor
            // console.log('Selected Model:', selectedModel);
            // console.log('Selected Color:', selectedColor);
    
            // Find the variant that matches the selected options
            for (const variant of variants) {
                const modelOption = variant.option1;
                const colorOption = variant.option2;
    
                // Debugging: Log variant options
                console.log('Variant Model Option:', modelOption);
                console.log('Variant Color Option:', colorOption);
    
                if (modelOption === selectedModel && colorOption === selectedColor) {
                    // Debugging: Log variant and availability
                    console.log('Matching Variant:', variant);
                    console.log('Inventory Quantity:', variant.inventory_quantity);
    
                    return variant;
                }
            }
        }
    
        return null;
    }

    // Modify the checkAvailability function to correctly find and display inventory quantity
    checkAvailability(selectedModel, selectedColor) {
        console.log('Checking availability for Model:', selectedModel, 'Color:', selectedColor);

        // Call findVariantByOptions to get the selectedVariant
        const selectedVariant = this.findVariantByOptions(selectedModel, selectedColor);

        if (selectedVariant) {
            // Check if the selectedVariant has the 'inventory_quantity' property
            if ('inventory_quantity' in selectedVariant) {
                const inventoryQuantity = selectedVariant.inventory_quantity;
                console.log('Inventory Quantity:', inventoryQuantity);

                if (inventoryQuantity > 0) {
                    return `In Stock (${inventoryQuantity} available)`;
                } else {
                    return 'Out of Stock';
                }
            } else {
                // 'inventory_quantity' property not found in the selectedVariant
                return 'Inventory information not available';
            }
        } else {
            return 'Variant not found';
        }
    }

    fetchProductData(productHandle) {
        // Construct the Shopify product URL
        const productUrl = `/products/${productHandle}.json`;
        console.log('Product URL: ' + productUrl);
    
        // Fetch product data using the URL
        fetch(productUrl)
            .then(response => response.json())  
            .then(data => {
                this.productData = data;
                
                // Check if this.productData and this.productData.product are defined
                if (this.productData && this.productData.product) {
                    
                    const product = this.productData.product;
                    console.log('Product =>', product);
                    this.createSteps(this.productData.product);
    
                    this.setupEventListeners();
    
                    // Set the initial step
                    this.showStep(1);
    
                    // Call updateProductInfo to initialize with default values
                    this.updateProductInfo();
                } else {
                    console.error('Product data or product not found:', this.productData);
                }
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
                <div class="steps"></div>
                <!-- Timeline to display the user's progress -->
                <div class="timeline"></div>
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

        // Now that the HTML structure is in place, we can add event listeners to the radio inputs in the timeline
        this.addTimelineRadioListeners();
    }


    addTimelineRadioListeners() {
        const timelineRadios = document.getElementsByName('step');
        for (let i = 0; i < timelineRadios.length; i++) {
            timelineRadios[i].addEventListener('change', (event) => {
                const selectedStep = parseInt(event.target.value);
                this.showStep(selectedStep);
            });
        }
    }
}

customElements.define('sticky-product-modal', StickyProductModal);