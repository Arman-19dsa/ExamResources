document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // THEME TOGGLE (DARK / LIGHT MODE)
    // ============================================
    const themeToggle = document.getElementById('themeToggle');
    const toggleIcon = themeToggle.querySelector('.toggle-icon');
    const html = document.documentElement;

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
        updateToggleIcon(savedTheme);
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleIcon(newTheme);
    });

    function updateToggleIcon(theme) {
        toggleIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    // ============================================
    // COLLAPSIBLE DROPDOWNS
    // ============================================
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const menu = toggle.nextElementSibling;
            const isOpen = menu.classList.contains('open');
            
            // Close all other open dropdowns
            document.querySelectorAll('.dropdown-menu.open').forEach(openMenu => {
                if (openMenu !== menu) {
                    openMenu.classList.remove('open');
                    openMenu.previousElementSibling.classList.remove('active');
                }
            });

            // Toggle current dropdown
            menu.classList.toggle('open');
            toggle.classList.toggle('active');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu.open').forEach(menu => {
                menu.classList.remove('open');
                menu.previousElementSibling.classList.remove('active');
            });
        }
    });

    // ============================================
    // SEARCH FUNCTIONALITY
    // ============================================
    const searchInput = document.getElementById('searchInput');
    const subjectsGrid = document.getElementById('subjectsGrid');
    const subjectCards = document.querySelectorAll('.subject-card');
    const noResults = document.getElementById('noResults');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        let visibleCount = 0;

        subjectCards.forEach(card => {
            const subjectName = card.getAttribute('data-subject').toLowerCase();
            
            if (subjectName.includes(query)) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show/hide no results message
        if (visibleCount === 0) {
            noResults.style.display = 'block';
            subjectsGrid.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            subjectsGrid.style.display = 'grid';
        }
    });

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});