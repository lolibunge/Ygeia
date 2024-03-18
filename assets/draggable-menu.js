class DraggableMenu extends HTMLElement {
    constructor() {
        super();

        // Retrieve parent container
        const container = document.getElementById('draggable-menu-container');

        // Retrieve data attributes
        const menuDataAttribute1 = container.getAttribute('data-menu1');
        const menuDataAttribute2 = container.getAttribute('data-menu2');

        try {
            const menuData = JSON.parse(menuDataAttribute1 || '[]');
            const menuData2 = JSON.parse(menuDataAttribute2 || '[]');
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }

        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.menuStartX = 0;
        this.menuStartY = 0;
        this.points = {
            'left': { x: 100, y: window.innerHeight / 2 },
            'bottom-left': { x: 100, y: window.innerHeight - 100 },
            'bottom': { x: window.innerWidth / 2, y: window.innerHeight - 100 },
            'bottom-right': { x: window.innerWidth - 100, y: window.innerHeight - 100 },
            'right': { x: window.innerWidth - 100, y: window.innerHeight / 2 }
        };

        this.menu = document.createElement('div');
        this.menu.className = 'menu';
        this.appendChild(this.menu);

        // Create the menu list container
        this.menuList = document.createElement('ul');
        this.menuList.className = 'menu-list';
        this.menu.appendChild(this.menuList);

        // Set the initial position to 'bottom'
        this.menu.style.left = `${this.points['bottom'].x - this.menu.offsetWidth / 2}px`;
        this.menu.style.top = `${this.points['bottom'].y - this.menu.offsetHeight / 2}px`;

        // Add draggable points (just for visual reference)
        for (let position in this.points) {
            let point = document.createElement('div');
            point.className = `point ${position}`;
            this.appendChild(point);
        }

        this.menu.addEventListener('mousedown', this.handleDragStart.bind(this));
        this.menu.addEventListener('touchstart', this.handleDragStart.bind(this), { passive: false });

        window.addEventListener('mousemove', this.handleDragMove.bind(this));
        window.addEventListener('touchmove', this.handleDragMove.bind(this), { passive: false });

        window.addEventListener('mouseup', this.handleDragEnd.bind(this));
        window.addEventListener('touchend', this.handleDragEnd.bind(this));

        this.menu.addEventListener('click', (event) => {
            // Check if the click occurred inside the menu
            if (!event.target.closest('.menu-list')) {
                // If not a click inside the menu list, toggle the 'menu-open' class
                this.menu.classList.toggle('menu-open');
                headerDrawer.classList.toggle('menu-overlay');
                console.log("Header Drawer: " + headerDrawer);
            }
        });

        // Concatenate menuData2 with menuData
        const combinedMenuData = menuData.concat(menuData2);

        // Load menu items from the combined data
        const menuItems = combinedMenuData.map(item => {
            // Check if the item comes from menuData2
            const isMenuData2Item = menuData2.includes(item);

            // Assign a class based on whether it's from menuData2 or not
            const itemClass = isMenuData2Item ? 'menu-item menu-item2' : 'menu-item';

            return `<li class="${itemClass}"><a href="${item.url}">${item.title}</a></li>`;
        });

        // Add the 'custom-header-search' snippet before the menu items
        const searchSnippet = `
            <!-- Add your custom-header-search snippet here -->
            <li class="search-bar">
                <form id="custom-search-form" action="/search" method="get">
                    <button type="submit"><svg class="modal__toggle-open icon icon-search" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg></button>
                    <input type="text" name="q" id="search" placeholder="Search products...">
                </form>
            </li>
        `;

        // Combine the 'custom-header-search' snippet with the menu items
        const finalMenuItems = [searchSnippet, ...menuItems];

        // Add menu items to the menu list container
        this.menuList.innerHTML = finalMenuItems.join('');
    }

    handleDragStart(e) {
        e.preventDefault();
        this.isDragging = true;
        this.startX = e.clientX || e.touches[0].clientX;
        this.startY = e.clientY || e.touches[0].clientY;
        let rect = this.menu.getBoundingClientRect();
        this.menuStartX = rect.left;
        this.menuStartY = rect.top;
        document.body.classList.add('no-select');
    }

    handleDragMove(e) {
        if (this.isDragging) {
            let clientX = e.clientX || e.touches[0].clientX;
            let clientY = e.clientY || e.touches[0].clientY;
            let dx = clientX - this.startX;
            let dy = clientY - this.startY;

            this.menu.style.left = `${this.menuStartX + dx}px`;
            this.menu.style.top = `${this.menuStartY + dy}px`;
        }
    }

    handleDragEnd() {
        if (this.isDragging) {
            this.isDragging = false;
            document.body.classList.remove('no-select');

            // Snap to closest point
            let menuCenter = {
                x: this.menu.offsetLeft + this.menu.offsetWidth / 2,
                y: this.menu.offsetTop + this.menu.offsetHeight / 2
            };
            let closestPoint = null;
            let closestDistance = Infinity;

            for (let position in this.points) {
                let point = this.points[position];
                let dx = point.x - menuCenter.x;
                let dy = point.y - menuCenter.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestPoint = point;
                }
            }

            this.menu.style.left = `${closestPoint.x - this.menu.offsetWidth / 2}px`;
            this.menu.style.top = `${closestPoint.y - this.menu.offsetHeight / 2}px`;

            // Position menu list items based on menu's position
            this.positionMenuListItems(closestPoint);
        }
    }

    positionMenuListItems(menuPosition) {
        const menuListItems = this.menuList;
        switch (menuPosition) {
            case this.points['bottom']:
                // Position for bottom center
                menuListItems.style.top = '-350px';
                menuListItems.style.left = '-60px';
                menuListItems.style.right = '0';
                break;
            case this.points['left']:
                // Position for left side
                menuListItems.style.top = '-60px';
                menuListItems.style.left = '150px';
                menuListItems.style.right = 'unset';
                break;
            case this.points['right']:
                // Position for right side
                menuListItems.style.top = '-60px';
                menuListItems.style.left = 'unset';
                menuListItems.style.right = '150px';
                break;
            case this.points['bottom-right']:
                // Position for right side
                menuListItems.style.top = '-240px';
                menuListItems.style.left = 'unset';
                menuListItems.style.right = '130px';
                break;
            case this.points['bottom-left']:
                // Position for right side
                menuListItems.style.top = '-240px';
                menuListItems.style.left = '130px';
                menuListItems.style.right = 'unset';
                break;
            default:
                // Default position
                menuListItems.style.top = '-350px';
                menuListItems.style.left = '-60px';
                menuListItems.style.right = '0';
                break;
        }
    }

    connectedCallback() {
        const headerDrawer = document.getElementById('shopify-section-header-drawer');
        // Add a click event listener to the document to close the menu when clicking outside of it
        document.addEventListener('click', (event) => {
            if (!this.menu.contains(event.target)) {
                // Click occurred outside the menu, so close it
                this.menu.classList.remove('menu-open');
                headerDrawer.classList.remove('menu-overlay');
            }
        });
    }
}

customElements.define('draggable-menu', DraggableMenu);

// Get references to the elements
const searchIcon = document.getElementById("search-icon");
console.log('Search Icon: ' + searchIcon);

searchIcon.addEventListener('click', function () {
    console.log('Second Search Icon: ' + searchIcon);
    //this.setAttribute('data-open-search', true);
    this.toggleAttribute("data-open-search");
});
