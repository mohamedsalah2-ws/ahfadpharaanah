/**
 * أحفاد الفراعنة للديكور - المحرك البرمجي النهائي 2025
 * يشمل: القائمة المتجاوبة، الكتابة الآلية، تحكم الهيدر، أنيميشن الظهور، والمعرض المطور
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. القائمة المتجاوبة (Mobile Menu) ---
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        // فتح وإغلاق القائمة عند الضغط على الزر
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); 
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // إغلاق القائمة عند الضغط على أي رابط (هنا كان الخطأ)
        const allLinks = document.querySelectorAll('.navigation a');
        allLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });

        // إغلاق القائمة عند الضغط خارجها
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }

    // --- 2. تأثير الكتابة الآلية ---
    const bronzeText = document.querySelector('.bronze-text');
    if (bronzeText) {
        const fullText = bronzeText.innerText;
        bronzeText.innerText = ''; 
        let charIndex = 0;

        function typeEffect() {
            if (charIndex < fullText.length) {
                bronzeText.innerHTML += fullText.charAt(charIndex);
                charIndex++;
                setTimeout(typeEffect, 150); 
            }
        }
        setTimeout(typeEffect, 500);
    }

    // --- 3. تحكم الهيدر عند التمرير ---
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
            header.style.padding = '10px 8%';
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.8)';
        } else {
            header.style.background = 'transparent';
            header.style.padding = '20px 8%';
            header.style.boxShadow = 'none';
        }
    });

    // --- 4. أنيميشن ظهور العناصر عند التمرير ---
    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealOnScroll.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.15 });

    const scrollElements = document.querySelectorAll('.service-item, .gallery-item, .contact-wrapper > div');
    scrollElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        revealOnScroll.observe(el);
    });
});

