/* ============================================
   THEME TOGGLE
   ============================================ */
const themeToggle = document.getElementById('themeToggle');
const toggleIcon  = themeToggle.querySelector('.toggle-icon');

const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
toggleIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    toggleIcon.textContent = next === 'dark' ? '☀️' : '🌙';
});

/* ============================================
   SEARCH / FILTER
   ============================================ */
const searchInput  = document.getElementById('searchInput');
const subjectsGrid = document.getElementById('subjectsGrid');
const noResults    = document.getElementById('noResults');

searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    const cards  = subjectsGrid.querySelectorAll('.subject-card');
    let visible  = 0;

    cards.forEach(card => {
        const subject = (card.dataset.subject || '').toLowerCase();
        const match   = !query || subject.includes(query);
        card.style.display = match ? '' : 'none';
        if (match) visible++;
    });

    noResults.style.display = visible === 0 ? 'block' : 'none';
});

/* ============================================
   DROPDOWNS (Unit-wise Notes)
   ============================================ */
document.querySelectorAll('.dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const menu    = btn.nextElementSibling;
        const isOpen  = menu.classList.contains('open');

        // Close all other open menus first
        document.querySelectorAll('.dropdown-menu.open').forEach(m => m.classList.remove('open'));
        document.querySelectorAll('.dropdown-toggle.active').forEach(b => b.classList.remove('active'));

        if (!isOpen) {
            menu.classList.add('open');
            btn.classList.add('active');
        }
    });
});

/* ============================================
   INFOGRAPHIC MODAL
   ============================================ */
const infographicData = {
    os: {
        title: 'Operating System — Infographics',
        images: [
            'os_infographic1.png',
            'os_infographic2.png'
        ]
    },
    daa: {
        title: 'Design & Analysis of Algorithm — Infographics',
        images: [
            'daa_infographic_1.png',
            'daa_infographic_2.png'
        ]
    },
    uiux: {
        title: 'UI/UX — Infographics',
        images: [
            'uiux_infographic1.png',
            'uiux_infographic2.png'
        ]
    },
    cc: {
        title: 'Cloud Computing — Infographics',
        images: [
            'cc_infographic1.png',
            'cc_infographic2.png',
            'cc_infographic3.png',
            'cc_infographic4.png',
            'cc_infographic5.png',
            'cc_infographic6.png',
            'cc_infographic7.png',
            'cc_infographic8.png'
        ]
    },
    genai: {
        title: 'Generative AI — Infographics',
        images: [
            'genai_infographic1.png'
        ]
    }
};

const modal      = document.getElementById('infographicModal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalImages = document.getElementById('modalImages');
const backdrop   = modal.querySelector('.modal-backdrop');

document.querySelectorAll('.infographic-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const subject = btn.dataset.subject;
        const data    = infographicData[subject];
        if (!data) return;

        modalTitle.textContent = data.title;
        modalImages.innerHTML  = '';

        if (data.images && data.images.length > 0) {
            data.images.forEach(src => {
                const card = document.createElement('div');
                card.className = 'modal-image-card';
                const img = document.createElement('img');
                img.src = src;
                img.alt = data.title;
                img.addEventListener('click', () => openZoom(src));
                card.appendChild(img);
                modalImages.appendChild(card);
            });
        } else {
            modalImages.innerHTML = '<p style="color:var(--text-muted);padding:1rem;">No infographics available yet.</p>';
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* Image zoom overlay */
let zoomOverlay = null;

function openZoom(src) {
    if (!zoomOverlay) {
        zoomOverlay = document.createElement('div');
        zoomOverlay.className = 'image-zoom-overlay';
        const img = document.createElement('img');
        const closeBtn = document.createElement('button');
        closeBtn.className = 'zoom-close';
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', () => zoomOverlay.classList.remove('active'));
        zoomOverlay.addEventListener('click', e => {
            if (e.target === zoomOverlay) zoomOverlay.classList.remove('active');
        });
        zoomOverlay.appendChild(img);
        zoomOverlay.appendChild(closeBtn);
        document.body.appendChild(zoomOverlay);
    }
    zoomOverlay.querySelector('img').src = src;
    zoomOverlay.classList.add('active');
}

/* ============================================
   STUDY PROMPTS — Copy & LLM navigation
   ============================================ */
function copyPromptItem(btn) {
    const text = btn.closest('.prompt-item').querySelector('.prompt-item-text').textContent.trim();
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    btn.textContent = '✅ Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = '📋 Copy'; btn.classList.remove('copied'); }, 2000);
}

function copyForLLM(anchor) {
    const text = anchor.closest('.prompt-item').querySelector('.prompt-item-text').textContent.trim();
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    // The href opens the LLM in a new tab automatically
}

function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
}

/* ============================================
   CUSTOM SCROLLBAR — Study Prompts card
   ============================================ */
(function () {
    const area  = document.getElementById('promptsScrollArea');
    const thumb = document.getElementById('scrollThumb');
    const track = document.getElementById('scrollTrack');
    if (!area || !thumb || !track) return;

    function updateThumb() {
        const ratio    = area.clientHeight / area.scrollHeight;
        const thumbH   = Math.max(ratio * track.clientHeight, 30);
        const maxScroll = area.scrollHeight - area.clientHeight;
        const scrollRatio = maxScroll > 0 ? area.scrollTop / maxScroll : 0;
        const thumbTop = scrollRatio * (track.clientHeight - thumbH);

        thumb.style.height = thumbH + 'px';
        thumb.style.top    = thumbTop + 'px';
        track.style.opacity = ratio >= 1 ? '0' : '1';
        track.style.pointerEvents = ratio >= 1 ? 'none' : 'auto';
    }

    area.addEventListener('scroll', updateThumb);
    window.addEventListener('resize', updateThumb);
    // Run after layout settles
    setTimeout(updateThumb, 100);

    // Drag thumb
    let dragging = false, startY = 0, startTop = 0;

    thumb.addEventListener('mousedown', e => {
        dragging  = true;
        startY    = e.clientY;
        startTop  = area.scrollTop;
        e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
        if (!dragging) return;
        const ratio  = (area.scrollHeight - area.clientHeight) / (track.clientHeight - thumb.offsetHeight);
        area.scrollTop = startTop + (e.clientY - startY) * ratio;
    });
    document.addEventListener('mouseup', () => { dragging = false; });

    // Click on track (not thumb)
    track.addEventListener('click', e => {
        if (e.target === thumb) return;
        const rect      = track.getBoundingClientRect();
        const clickRatio = (e.clientY - rect.top) / rect.height;
        area.scrollTop   = clickRatio * (area.scrollHeight - area.clientHeight);
    });
})();
