
class ItineraRouter {
    constructor() {
        this.currentPage = 'discover';
        this.init();
    }

    init() {
        this.setupBottomNav();
        
        this.setupBackButtons();
        
        this.setupNavLinks();
        
        this.updateActiveNav();
    }

    setupBottomNav() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const label = item.querySelector('span')?.textContent?.trim() || '';
                this.navigateToPage(label.toLowerCase());
            });
        });
    }

    setupBackButtons() {
        const backButtons = document.querySelectorAll('#back-btn, [id*="back"], button:has(i.fa-arrow-left), button:has(i.fa-chevron-left)');
        backButtons.forEach(btn => {
            if (!btn.dataset.navigated) {
                btn.dataset.navigated = 'true';
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.goBack();
                });
            }
        });
    }

    setupNavLinks() {
        const profileIcons = document.querySelectorAll('#profile-icon, [id*="profile"]');
        profileIcons.forEach(icon => {
            icon.addEventListener('click', () => this.navigateTo('profile'));
        });

        const searchPills = document.querySelectorAll('#search-pill, [id*="search"]:not(input)');
        searchPills.forEach(pill => {
            if (pill.tagName === 'BUTTON' || pill.onclick === null) {
                pill.addEventListener('click', () => this.navigateTo('search'));
            }
        });

        const quickViewBtns = document.querySelectorAll('.quick-view-btn, [class*="quick-view"]');
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo('stay-detail');
            });
        });

        const stayCards = document.querySelectorAll('.stay-card, .featured-card');
        stayCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button') && !e.target.closest('.save-btn') && !e.target.closest('.compare-btn')) {
                    this.navigateTo('stay-detail');
                }
            });
        });

        const viewPlanBtns = document.querySelectorAll('button:has-text("View Plan"), [class*="view-plan"]');
        viewPlanBtns.forEach(btn => {
            if (btn.textContent.includes('View Plan')) {
                btn.addEventListener('click', () => this.navigateTo('trip-planner'));
            }
        });

        const viewTripsBtns = document.querySelectorAll('button:has-text("View My Trips"), [id*="view-trips"]');
        viewTripsBtns.forEach(btn => {
            if (btn.textContent.includes('View My Trips') || btn.id.includes('view-trips')) {
                btn.addEventListener('click', () => this.navigateTo('my-trips'));
            }
        });

        const rewardsBtns = document.querySelectorAll('button:has-text("Rewards"), [id*="rewards"]');
        rewardsBtns.forEach(btn => {
            if (btn.textContent.includes('Rewards') || btn.textContent.includes('Rewards Dashboard')) {
                btn.addEventListener('click', () => this.navigateTo('rewards'));
            }
        });

        const budgetBtns = document.querySelectorAll('[class*="budget"], button:has-text("Budget")');
        budgetBtns.forEach(btn => {
            if (btn.textContent.includes('Budget') || btn.className.includes('budget')) {
                btn.addEventListener('click', () => this.navigateTo('budget'));
            }
        });

        const mapBtns = document.querySelectorAll('[class*="map"], button:has-text("Map")');
        mapBtns.forEach(btn => {
            if (btn.textContent.includes('Map') || btn.className.includes('map')) {
                btn.addEventListener('click', () => this.navigateTo('map-explorer'));
            }
        });
    }

    navigateToPage(pageName) {
        const pageMap = {
            'discover': 'index.html',
            'stays': 'search.html',
            'trips': 'my-trips.html',
            'map': 'map-explorer.html',
            'budget': 'budget-dashboard.html',
            'profile': 'profile.html',
            'rewards': 'rewards-dashboard.html'
        };

        const fileName = pageMap[pageName.toLowerCase()] || 'index.html';
        this.navigateToFile(fileName);
    }

    navigateTo(page) {
        const pageMap = {
            'discover': 'index.html',
            'search': 'search.html',
            'search-stays': 'search.html',
            'results': 'search-results.html',
            'search-results': 'search-results.html',
            'stay-detail': 'stay-detail.html',
            'stay-quick-view': 'stay-quick-view.html',
            'my-trips': 'my-trips.html',
            'trip-planner': 'trip-planner.html',
            'profile': 'profile.html',
            'rewards': 'rewards-dashboard.html',
            'rewards-dashboard': 'rewards-dashboard.html',
            'budget': 'budget-dashboard.html',
            'budget-dashboard': 'budget-dashboard.html',
            'map-explorer': 'map-explorer.html',
            'map': 'map-explorer.html',
            'checkout': 'checkout.html',
            'checkout-wizard': 'checkout.html',
            'room-selection': 'room-selection.html',
            'confirmation': 'confirmation.html',
            'compare': 'compare-stays.html',
            'compare-stays': 'compare-stays.html',
            'booking-summary': 'booking-summary.html'
        };

        const fileName = pageMap[page.toLowerCase()] || 'index.html';
        this.navigateToFile(fileName);
    }

    navigateToFile(fileName) {
        if (fileName === window.location.pathname.split('/').pop()) {
            return;
        }
        window.location.href = fileName;
    }

    goBack() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            this.navigateTo('discover');
        }
    }

    updateActiveNav() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navMap = {
            'index.html': 'discover',
            'search.html': 'stays',
            'search-results.html': 'stays',
            'stay-detail.html': 'stays',
            'stay-quick-view.html': 'stays',
            'my-trips.html': 'trips',
            'trip-planner.html': 'trips',
            'map-explorer.html': 'map',
            'budget-dashboard.html': 'budget',
            'profile.html': 'profile',
            'rewards-dashboard.html': 'rewards',
            'checkout.html': 'stays',
            'room-selection.html': 'stays',
            'confirmation.html': 'trips',
            'compare-stays.html': 'stays',
            'booking-summary.html': 'trips'
        };

        const activePage = navMap[currentPath] || 'discover';
        
        document.querySelectorAll('.nav-item').forEach(item => {
            const label = item.querySelector('span')?.textContent?.trim().toLowerCase() || '';
            if (label === activePage) {
                item.classList.add('bg-primary/10');
                const icon = item.querySelector('i');
                const span = item.querySelector('span');
                if (icon) {
                    icon.classList.remove('text-gray-400');
                    icon.classList.add('text-primary');
                }
                if (span) {
                    span.classList.remove('text-gray-400', 'font-medium');
                    span.classList.add('text-primary', 'font-semibold');
                }
            } else {
                item.classList.remove('bg-primary/10');
                const icon = item.querySelector('i');
                const span = item.querySelector('span');
                if (icon) {
                    icon.classList.remove('text-primary');
                    icon.classList.add('text-gray-400');
                }
                if (span) {
                    span.classList.remove('text-primary', 'font-semibold');
                    span.classList.add('text-gray-400', 'font-medium');
                }
            }
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.router = new ItineraRouter();
    });
} else {
    window.router = new ItineraRouter();
}

window.ItineraRouter = ItineraRouter;

