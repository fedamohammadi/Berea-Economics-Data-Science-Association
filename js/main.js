document.addEventListener('DOMContentLoaded', function() {
    const mainContentArea = document.querySelector('main');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    // This function sets up event listeners for dynamically loaded content
    function setupPageEventListeners() {
        // Find any buttons inside the loaded content that navigate
        const navButtons = mainContentArea.querySelectorAll('.nav-button');
        navButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const pageId = this.dataset.page;
                loadPage(pageId);
            });
        });

        // Add listeners for the "Read More" buttons on any page
        const readMoreButtons = document.querySelectorAll('.read-more-button');
        readMoreButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const articleId = this.dataset.articleId;
                // When "Read More" is clicked, load the resources page and pass the article ID
                loadPage('resources', articleId);
            });
        });

        // Add listeners for the "Back" buttons within the article view
        const backToResourcesButtons = mainContentArea.querySelectorAll('.back-to-resources-button');
        backToResourcesButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                // When "Back" is clicked, reload the main resources page
                loadPage('resources');
            });
        });
    }
    
    // The main function to load content from files
    async function loadPage(pageId, articleId = null) {
        try {
            const response = await fetch(`pages/${pageId}.html`);
            if (!response.ok) throw new Error(`Page not found: ${pageId}.html`);
            
            const html = await response.text();
            mainContentArea.innerHTML = html;

            // Update which nav link is marked as 'active'
            navLinks.forEach(link => {
                link.classList.toggle('active', link.dataset.page === pageId);
            });
            
            // If an articleId was passed, switch to the article view
            if (pageId === 'resources' && articleId) {
                const resourcesList = mainContentArea.querySelector('#resources-list');
                const articleView = mainContentArea.querySelector('#article-view');
                const targetArticle = mainContentArea.querySelector(`#article-content-${articleId}`);

                if (resourcesList && articleView && targetArticle) {
                    resourcesList.style.display = 'none';
                    articleView.style.display = 'block';
                    targetArticle.classList.remove('hidden');
                }
            }

            // Re-run event listener setup for the new content
            setupPageEventListeners();

            // Icons need to be re-rendered after new content is loaded
            feather.replace();
            
            window.scrollTo(0, 0); // Scroll to top of the new page

        } catch (error) {
            mainContentArea.innerHTML = `<p class="text-center text-red-500">Error: Could not load page content.</p>`;
            console.error('Failed to load page:', error);
        }
    }

    // Add click listeners to all main navigation elements
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.dataset.page;
            mobileMenu.classList.add('hidden');
            loadPage(pageId);
        });
    });
    
    // Add click listeners to buttons on the page that also navigate
    setupPageEventListeners();

    // Mobile menu toggle
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Load the initial home page on first visit
    loadPage('home');
});

