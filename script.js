// Mobile menu toggling
const menuBtn = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');
menuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('hidden');
    const isOpen = !mobileNav.classList.contains('hidden');
    menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

mobileNav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
    })
);

// Photo stack logic
(function () {
    const stackEl = document.getElementById('photoStack');
    if (!stackEl) return;

    const imgs = Array.from(stackEl.querySelectorAll('.stack-img'));
    let current = 0;

    //  COLOR PALETTES 
    // Defined a color palette for each image. The order must match the image order in the html
    const imageColorPalettes = [
        // Palette for photo1 (Monochromatic Green)
        ['#7fe8a8', '#9ff2c6', '#ccfeec', '#e6fff6', '#dfffe8', '#86ffc1'],
        // Palette for photo2 (Purple & Cyan)
        ['#1e0033', '#310054', '#5e00a3', '#0d6f8a', '#17a9d1', '#59d2f0'],
        // Palette for photo3 (light modern blue)
        ['#eef6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6'],
        // Palette for photo4 (warm pastel/peach)
        ['#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316'],
        // Palette for photo5 (Muted Purple & Teal)
        ['#1e1c24', '#3c3847', '#575269', '#4d757d', '#6daeb8', '#98d2dc'],
        // Palette for photo6 (Violet & Cream)
        ['#110033', '#250075', '#3900b3', '#7e6a9e', '#b5a7c9', '#ede6f5']
    ];//END OF COLOR PALETTES

    // Initialize stack positions and background
    function layout() {
        // UPDATE BACKGROUND 
        const palette = imageColorPalettes[current];
        const root = document.documentElement;
        root.style.setProperty('--s1', palette[0]);
        root.style.setProperty('--s2', palette[1]);
        root.style.setProperty('--s3', palette[2]);
        root.style.setProperty('--s4', palette[3]);
        root.style.setProperty('--s5', palette[4]);
        root.style.setProperty('--s6', palette[5]);
        // END OF UPDATE BACKGROUND

        // Arrange images in stack
        for (let i = 0; i < imgs.length; i++) {
            const idx = (current + i) % imgs.length;
            const img = imgs[idx];
            img.classList.remove('active', 'behind');
            // Top image
            if (i === 0) {
                img.classList.add('active');
                img.style.zIndex = String(100 - i);
                img.style.transform = `translate3d(0,0,0) scale(1) rotate(0deg)`;
                img.style.opacity = '1';
            } else {
                // Stacked behind images with subtle offsets
                const offsetY = 8 + i * 6; // vertical offset per layer
                const scale = 1 - (i * 0.03);
                const rotate = (i % 2 === 0) ? -4 + i * 0.5 : 4 - i * 0.5;
                img.classList.add('behind');
                img.style.zIndex = String(100 - i - 10);
                img.style.transform = `translate3d(${i * 8}px, ${offsetY}px, -${i * 20}px) scale(${scale}) rotate(${rotate}deg)`;
                img.style.opacity = String(Math.max(0.7, 1 - i * 0.06));
            }
        }
    }

    // Cycle to next photo
    function next() {
        current = (current + 1) % imgs.length;
        layout();
    }

    // Cycle to previous photo
    function prev() {
        current = (current - 1 + imgs.length) % imgs.length;
        layout();
    }

    // Click or keyboard handlers
    stackEl.addEventListener('click', (e) => {
        e.preventDefault();
        next();
    });

    // Keyboard accessibility: left/right arrows, enter/space
    stackEl.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            next();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prev();
        }
    });

    // Preventionn image dragging on desktop which breaks the interaction
    imgs.forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });

    // Initial layout calling
    layout();
})();