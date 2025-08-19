document.addEventListener('DOMContentLoaded', () => {
    // ===== SELECTORS =====
    const fadeElements = document.querySelectorAll('.fade-in');
    const skillsSection = document.querySelector('.skills-section');
    const profileWrapper = document.querySelector('.profile-wrapper-notes');
    const noteBubble = document.querySelector('.note-bubble');
    const socialIcons = document.querySelectorAll('.server-icon');
    const clickSound = document.getElementById('click-sound');
    const toast = document.getElementById('discord-toast');
    const toastSound = document.getElementById('toast-sound');
    const toastClose = document.getElementById('toast-close');

    // ===== SOUND UNLOCK FLAG =====
    let soundUnlocked = false;

    // ===== UNLOCK TOAST SOUND ON FIRST CLICK =====
    document.addEventListener('click', () => {
        if (!soundUnlocked && toastSound) {
            toastSound.play().then(() => {
                toastSound.pause();
                toastSound.currentTime = 0;
                soundUnlocked = true;
            }).catch(() => {});
        }
    }, { once: true });

    // ===== SOCIAL ICON CLICK SOUND =====
    if (clickSound && socialIcons.length) {
        socialIcons.forEach(icon => {
            icon.addEventListener('click', () => {
                clickSound.currentTime = 0;
                clickSound.play();
            });
        });
    }

    // ===== FADE-IN ON SCROLL =====
    if (fadeElements.length) {
        const fadeObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        fadeElements.forEach(el => fadeObserver.observe(el));
    }

    // ===== SKILL BAR ANIMATION =====
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skills = entry.target.querySelectorAll('.skill');
                    skills.forEach(skill => {
                        const level = parseInt(skill.getAttribute('data-level'), 10);
                        const barFill = skill.querySelector('.skill-inner-fill');
                        const percentText = skill.querySelector('.skill-percent');
                        barFill.style.width = `${level}%`;
                        animatePercent(percentText, level);
                    });
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        skillsObserver.observe(skillsSection);
    }

    function animatePercent(el, target) {
        let current = 0;
        const duration = 1200;
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            current = Math.floor(progress * target);
            el.textContent = `${current}%`;
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    }

    // ===== VERSE ON HOVER =====
    if (profileWrapper && noteBubble) {
        const verses = [
            "Psalm 23:1", "John 3:16", "Phil 4:13", "Isaiah 41:10",
            "Romans 8:28", "Psalm 46:1", "Matthew 5:16", "Jeremiah 29:11",
            "Proverbs 3:5-6", "Joshua 1:9"
        ];
        profileWrapper.addEventListener('mouseenter', () => {
            const randomVerse = verses[Math.floor(Math.random() * verses.length)];
            noteBubble.textContent = randomVerse;
        });
    }

    // ===== TOAST SHOW AFTER 5 SECONDS =====
    setTimeout(() => {
        if (!toast) return;

        toast.classList.remove('hidden');
        void toast.offsetWidth; // Force reflow for animation
        toast.classList.add('show');

        if (toastSound && soundUnlocked) {
            toastSound.currentTime = 0;
            toastSound.play().catch(err => {
                console.warn('Autoplay blocked:', err);
            });
        }
    }, 5000);

    // ===== TOAST CLOSE BUTTON =====
    if (toastClose) {
        toastClose.addEventListener('click', e => {
            e.stopPropagation();
            toast.classList.remove('show');
            setTimeout(() => toast.classList.add('hidden'), 400);
        });
    }

    // ===== TOAST CLICK = DOWNLOAD CV =====
    if (toast) {
        toast.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = 'Raymart-Catudio-CV-2025.pdf'; // Path to your PDF
            link.download = 'Raymart-Catudio-CV-2025.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        // ===== Keyboard support =====
        toast.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toast.click();
            }
        });
    }
});
