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

    // ============================================
    // INFOGRAPHIC MODAL
    // ============================================
    const infographicToggles = document.querySelectorAll('.infographic-toggle');
    const modal = document.getElementById('infographicModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalImages = document.getElementById('modalImages');
    const modalClose = document.getElementById('modalClose');
    const modalBackdrop = modal.querySelector('.modal-backdrop');

    // Infographic data for each subject
    const infographicData = {
        os: {
            title: 'Operating System Infographics',
            images: [
                { src: 'os_infographic1.png', alt: 'OS Infographic 1' },
                { src: 'os_infographic2.png', alt: 'OS Infographic 2' }
            ]
        },
        daa: {
            title: 'Design & Analysis of Algorithm Infographics',
            images: [
                { src: 'daa_infographic_1.png', alt: 'DAA Infographic 1' },
                { src: 'daa_infographic_2.png', alt: 'DAA Infographic 2' }
            ]
        },
        uiux: {
            title: 'UI/UX Infographics',
            images: [
                { src: 'uiux_infographic1.png', alt: 'UI/UX Infographic 1' },
                { src: 'uiux_infographic2.png', alt: 'UI/UX Infographic 2' }
            ]
        },
        cc: {
            title: 'Cloud Computing Infographics',
            images: [
                { src: 'cc_infographic1.png', alt: 'CC Infographic 1' },
                { src: 'cc_infographic2.png', alt: 'CC Infographic 2' },
                { src: 'cc_infographic3.png', alt: 'CC Infographic 3' },
                { src: 'cc_infographic4.png', alt: 'CC Infographic 4' },
                { src: 'cc_infographic5.png', alt: 'CC Infographic 5' },
                { src: 'cc_infographic6.png', alt: 'CC Infographic 6' },
                { src: 'cc_infographic7.png', alt: 'CC Infographic 7' }
            ]
        },
        genai: {
            title: 'Generative AI Infographics',
            images: [
                { src: 'genai_infographic1.png', alt: 'GEN AI Infographic 1' }
            ]
        }
    };

    function openModal(subject) {
        const data = infographicData[subject];
        if (!data) return;

        modalTitle.textContent = data.title;
        modalImages.innerHTML = data.images.map(img => `
            <div class="modal-image-card">
                <img src="${img.src}" alt="${img.alt}" loading="lazy">
            </div>
        `).join('');

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Add zoom functionality to modal images
        modalImages.querySelectorAll('.modal-image-card').forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('img');
                openZoom(img.src, img.alt);
            });
        });
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Zoom overlay
    let zoomOverlay = null;
    function openZoom(src, alt) {
        if (!zoomOverlay) {
            zoomOverlay = document.createElement('div');
            zoomOverlay.className = 'image-zoom-overlay';
            zoomOverlay.innerHTML = `
                <button class="zoom-close">&times;</button>
                <img src="" alt="">
            `;
            document.body.appendChild(zoomOverlay);

            zoomOverlay.querySelector('.zoom-close').addEventListener('click', closeZoom);
            zoomOverlay.addEventListener('click', (e) => {
                if (e.target === zoomOverlay) closeZoom();
            });
        }

        zoomOverlay.querySelector('img').src = src;
        zoomOverlay.querySelector('img').alt = alt;
        zoomOverlay.classList.add('active');
    }

    function closeZoom() {
        if (zoomOverlay) zoomOverlay.classList.remove('active');
    }

    infographicToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const subject = btn.getAttribute('data-subject');
            openModal(subject);
        });
    });

    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (zoomOverlay && zoomOverlay.classList.contains('active')) {
                closeZoom();
            } else if (modal.classList.contains('active')) {
                closeModal();
            }
        }
    });
});
