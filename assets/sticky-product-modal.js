class StickyProductModal extends HTMLElement {
    constructor() {
        super();
        this.currentStep = 1;
        this.numSteps = 0;
        this.selectedOptions = []; 
        this.productData = null;
        this.modal = null;
    }

    get productHandle() {
        return this.getAttribute('data-handle');
    }

    connectedCallback() {
        // Render the modal structure
        this.renderModal();

        // Initialize currentStep and show the first step
        this.currentStep = 1;

        // Fetch product data after setting up the button click event
        this.openModalButton = document.getElementById('configure-product-button');
        this.openModalButton.addEventListener('click', () => {
            this.showModal();
        });

        // Fetch product data
        this.fetchProductData(this.productHandle);

        // Set up event listeners for option selectors, timeline, and "Next" button
        this.finalizeSetup();
    }

    createSteps(product) {
        const stepsContainer = document.querySelector('.steps');
        const timeline = document.querySelector('.timeline');
        const numSteps = product.options.length;
        this.numSteps = numSteps;
    
        // Clear any existing content in stepsContainer
        stepsContainer.innerHTML = '';
    
        // Check if the product has options
        console.log('Product options length:', product.options.length);
    
        if (product.options.length === 1) {
            // If the product has no options, show the final step directly
            console.log('Product has no options:', product);
            this.showFinalStep(product);
        } else {
            // Loop through the options to create steps dynamically
            for (let index = 0; index < numSteps; index++) {
                const option = product.options[index];
                const optionName = option.name;
                const optionValues = option.values;
    
                const step = document.createElement('div');
                step.className = 'step';
                step.id = `step${index + 1}`;
    
                // Create a label for the step
                const stepLabel = document.createElement('h2');
                stepLabel.textContent = `Step ${index + 1}: Select ${optionName}`;
                step.appendChild(stepLabel);
    
                // Create a selector for this step
                const selector = document.createElement('select');
                selector.className = 'option-selector';
                selector.id = `selector-step${index + 1}`;
                const firstOptionElement = document.createElement('option');
                firstOptionElement.textContent = "Choose an option";
                selector.appendChild(firstOptionElement);
    
                // Add options to the selector based on optionValues
                optionValues.forEach((value) => {
                    const optionElement = document.createElement('option');
                    optionElement.value = value;
                    optionElement.textContent = value; // You can customize the display text here
                    selector.appendChild(optionElement);
                });
    
                // Append the selector to the step
                step.appendChild(selector);
    
                // Append the step to the container
                stepsContainer.appendChild(step);
                
                selector.addEventListener('change', () => {
                    // Save the selected option value
                    const selectedValue = selector.value;
                
                    if (selectedValue !== "Choose an option") { // Check if a valid option is selected
                        // Update the selected option value for the current step
                        this.selectedOptions[index] = selectedValue; // Store the selected option value
                    } else {
                        // User selected the default option ("Choose an option"), so set the value to null
                        this.selectedOptions[index] = null;
                    }
                
                    // Hide the current step
                    step.style.display = 'none';
                
                    if (index + 2 <= numSteps) {
                        // Show the next step if it exists
                        this.showStep(index + 2);
                    } else {
                        // If there are no more steps, show the final step
                        this.showFinalStep(product);
                    }
                });
                

            }
    
            // Initially, show the first step and hide the rest
            this.showStep(1);
        }
    }
    
    
    // Add a method to show a specific step and hide the rest
    showStep(stepNumber) {
        const stepsContainer = document.querySelector('.steps');
    
        if (stepNumber >= 1 && stepNumber <= this.numSteps) {
            const allSteps = stepsContainer.querySelectorAll('.step');
            allSteps.forEach((step) => {
                step.style.display = 'none';
            });
    
            const currentStep = stepsContainer.querySelector(`#step${stepNumber}`);
            if (currentStep) {
                currentStep.style.display = 'block';
            }
        }
    }
    
    // Define the checkOptionsAndEnableNextButtons function
    checkOptionsAndEnableNextButtons() {
        // Get references to your option selectors (you may need to modify this part)
        const currentStep = this.currentStep;
        const selector = document.querySelector(`#selector-step${currentStep}`);
    
        // Check if the selector for the current step has a value
        if (selector && selector.value) {
            // Enable the "Next" button for the current step
            const nextButton = document.querySelector('#next-button');
            nextButton.disabled = false;
        } else {
            // Disable the "Next" button for the current step
            const nextButton = document.querySelector('#next-button');
            nextButton.disabled = true;
        }
    }
    
    


    showModal() {
        if (this.modal) {
            this.modal.style.display = 'block';
        }
    }

    renderModal() {
        const modal = document.createElement('div');
        modal.id = 'myModal';
        modal.className = 'modal';

        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" id="closeModal">&times;</span>
                <div class="steps"></div>
                <div class="timeline"></div>
            </div>
        `;

        document.body.appendChild(modal);
        this.modal = modal;

        const closeModalButton = modal.querySelector('#closeModal');
        closeModalButton.addEventListener('click', () => {
            this.closeModal();
        });
    }

    fetchProductData(productHandle) {
        // Construct the URL to fetch product data based on the provided productHandle
        const productUrl = `/products/${productHandle}.json`;
    
        // Fetch the product data
        fetch(productUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status} (${productHandle})`);
                }
                return response.json();
            })
            .then((data) => {
                // Process the received data
                console.log('Product data received:', data);
    
                if (data.product) {
                    this.productData = data.product;
                    // Create steps based on the fetched product data
                    if (this.productData.options && this.productData.options.length > 0) {
                        this.createSteps(this.productData);
                    } else {
                        this.showFinalStep();
                    }
                } else {
                    console.error('Product data does not contain a "product" field:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching product data: ', error);
            });
    }
    

    finalizeSetup() {
        // Set up event listeners for option selectors, timeline, and "Next" button
        // Example:
        // const modelSelector = document.querySelector('#model-selector');
        // modelSelector.addEventListener('change', () => {
        //     this.checkOptionsAndEnableNextButtons();
        // });
    }

    closeModal() {
        this.modal.style.display = 'none';
    }

    addToCart(variantId, quantity) {
        // Check if the productData is available
        if (!this.productData) {
            alert('Product data is not available.');
            return;
        }
    
        // Validate the quantity
        if (isNaN(quantity) || quantity <= 0) {
            alert('Please enter a valid quantity.');
            return;
        }
    
        // Create a cart item object
        const cartItem = {
            id: variantId,     // Use the variantId passed as a parameter
            quantity: quantity,
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

    findVariantBySelectedOptions() {
        if (!this.productData || !this.productData.variants) {
            return null; // No variants available
        }

        const variants = this.productData.variants;
    
        for (const variant of variants) {
            const variantOptions = variant.options || []; // Ensure variantOptions is an array

            if (
                this.selectedOptions[0] == variant.option1 &&
                this.selectedOptions[1] == variant.option2 &&
                this.selectedOptions[2] == variant.option3
            ) return variant;
            
        }
    
        return this.productData.variants[0]; // No matching variant found
    }
    

    addToCartAjax(cartItems) {
        // Use the Shopify AJAX API to add the product to the cart
        fetch('/cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: cartItems }),
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
    
    showFinalStep() {
        const stepsContainer = document.querySelector('.steps');
        const allSteps = stepsContainer.querySelectorAll('.step');
    
        // Hide all previous steps
        allSteps.forEach((step) => {
            step.style.display = 'none';
        });
    
        const finalStep = document.createElement('div');
        finalStep.id = 'final-step';
        finalStep.className = 'step';
    
        // Define selectedVariant variable
        let selectedVariant = null;
    
        // Define addToCartButton variable
        let addToCartButton = null;
    
        // Assuming this.productData contains the product information
        if (this.productData) {
            // Create elements to display product information
            const productImageContainer = document.createElement('div');
            productImageContainer.className = 'product-image__container';
            const productImage = document.createElement('img');
            productImage.src = this.productData.image.src; // Replace with the actual image URL
            productImage.alt = this.productData.title;
            productImage.style.height = '200px';
    
            const productInfoContainer = document.createElement('div');
            productInfoContainer.className = 'product-info__container';
            const productTitle = document.createElement('h2');
            productTitle.textContent = this.productData.title;
    
            const productPrice = document.createElement('p');
            productPrice.className = 'product-price';
            productPrice.textContent = `Price: $${this.productData.variants[0].price}`;
    
            // Create a quantity selector
            const productActions = document.createElement('div');
            productActions.className = 'product-actions__container';
            const quantityContainer = document.createElement('div');
            quantityContainer.className = 'product-quantity__container';
            const quantitySelector = document.createElement('input');
            const quantityLabel = document.createElement('label');
            quantityLabel.className = 'product-quantity__label';
            quantityLabel.textContent = "Quantity";
            quantitySelector.type = 'number';
            quantitySelector.min = 1;
            quantitySelector.id = 'quantity';
            quantitySelector.value = 1; // Initial quantity
    
            // Create an "Add to Cart" button
            addToCartButton = document.createElement('button');
            addToCartButton.className = 'btn';
            addToCartButton.textContent = 'Add to Cart';
    
            // Append elements to the final step
            productImageContainer.appendChild(productImage);
            productInfoContainer.appendChild(productTitle);
            productInfoContainer.appendChild(productPrice);
    
            // Append selected options to the final step
            if (this.selectedOptions.length > 0) {
                this.selectedOptions.forEach((optionValue, index) => {
                    const optionName = this.productData.options[index].name;
                    const productOption = document.createElement('p');
                    productOption.className = `option-${optionName.toLowerCase()}`;
                    productOption.textContent = `${optionName}: ${optionValue}`;
                    productInfoContainer.appendChild(productOption);
                });
            } else {
                console.log("No selected options in selectedOptions.");
            }
    
            quantityContainer.appendChild(quantityLabel);
            quantityContainer.appendChild(quantitySelector);
            productActions.appendChild(quantityContainer);
            productActions.appendChild(addToCartButton);
            productInfoContainer.appendChild(productActions);
    
            finalStep.appendChild(productImageContainer);
            finalStep.appendChild(productInfoContainer);
    
            // Find the selected variant based on the properties
            selectedVariant = this.findVariantBySelectedOptions();
    
            if (!selectedVariant) {
                alert('Selected options combination not found.');
                return;
            }
        } else {
            console.log("this.productData is not populated or is falsy.");
        }
    
        // Append the final step to the container
        stepsContainer.appendChild(finalStep);
    
        // Set a timeout to delay displaying the final step (for debugging purposes)
        setTimeout(() => {
            finalStep.style.display = 'flex';
        }, 1000); // Delay displaying the final step for 1 second (adjust as needed)
    
        // Add click event listener to "Add to Cart" button
        if (addToCartButton) {
            addToCartButton.addEventListener('click', () => {
                // Check if a variant has been selected
                if (!selectedVariant) {
                    alert('Please select a valid product variant.');
                    return;
                }
    
                const quantity = parseInt(document.getElementById('quantity').value);
    
                if (isNaN(quantity) || quantity <= 0) {
                    alert('Please enter a valid quantity.');
                    return;
                }
    
                // Call the addToCart function with the selected variantId and quantity
                this.addToCart(selectedVariant.id, quantity);
            });
        }
    }
    
    
    
    
    
}

customElements.define('sticky-product-modal', StickyProductModal);
