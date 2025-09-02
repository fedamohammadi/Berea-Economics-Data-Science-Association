document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.querySelector('main');

    // Function to fetch and display a page
    async function loadPage(page, articleId = null) {
        try {
            const response = await fetch(`pages/${page}.html`);
            if (!response.ok) {
                mainContent.innerHTML = `<p class="text-center text-red-500">Error: Could not load page.</p>`;
                return;
            }
            mainContent.innerHTML = await response.text();
            
            // Re-initialize event listeners for the newly loaded content
            initializePageEventListeners(page, articleId);

        } catch (error) {
            console.error('Error loading page:', error);
            mainContent.innerHTML = `<p class="text-center text-red-500">An error occurred. Please try again.</p>`;
        }
    }

    // Function to set up event listeners on a newly loaded page
    function initializePageEventListeners(page, articleId) {
        feather.replace(); // Always run feather icons replacement

        // Add listeners for buttons loaded within the main content
        mainContent.querySelectorAll('.nav-button').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const pageId = this.dataset.page;
                setActivePage(pageId);
            });
        });
        
        mainContent.querySelectorAll('.read-more-button').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const articleId = this.dataset.articleId;
                setActivePage('resources', articleId);
            });
        });


        if (page === 'resources') {
            const backToResourcesButtons = mainContent.querySelectorAll('.back-to-resources-button');
            const resourcesList = mainContent.querySelector('#resources-list');
            const articleView = mainContent.querySelector('#article-view');

            backToResourcesButtons.forEach(button => {
                 button.addEventListener('click', function(e) {
                    e.preventDefault();
                    setActivePage('resources');
                });
            });

            // If an articleId is passed, show the correct article view
            if (articleId) {
                if (resourcesList) resourcesList.style.display = 'none';
                if (articleView) articleView.style.display = 'block';

                mainContent.querySelectorAll('.article-content-view').forEach(view => {
                    view.classList.add('hidden');
                });
                const targetArticle = mainContent.querySelector(`#article-content-${articleId}`);
                if(targetArticle) {
                    targetArticle.classList.remove('hidden');
                    setupTocSmoothScroll(targetArticle);
                }
            }
        }
    }
    
    // Function to set up smooth scrolling for the Table of Contents
    function setupTocSmoothScroll(articleContainer) {
        const tocLinks = articleContainer.querySelectorAll('.toc-link');
        tocLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = articleContainer.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Function to set the active page and handle history
    function setActivePage(page, articleId = null) {
        // Update navigation links in the header
        document.querySelectorAll('header .nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });
        
        // Load the page content
        loadPage(page, articleId);
        
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) mobileMenu.classList.add('hidden');
        
        window.scrollTo(0, 0);
    }

    // --- INITIAL SETUP ---

    // Set default page on initial load
    setActivePage('home');

    // Add click listeners to all STATIC navigation triggers (header and mobile menu)
    document.querySelectorAll('header .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.dataset.page;
            setActivePage(pageId);
        });
    });

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) mobileMenu.classList.toggle('hidden');
        });
    }
});

