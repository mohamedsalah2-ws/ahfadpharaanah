/**
 * أحفاد الفراعنة للديكور - المحرك البرمجي المطور
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. التحكم في القائمة المتجاوبة ---
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        // فتح وإغلاق القائمة عند الضغط على الأيقونة
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); 
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // إغلاق القائمة عند الضغط على أي رابط داخلها (تم التعديل هنا)
        const allNavLinks = document.querySelectorAll('.navigation a');
        allNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });

        // إغلاق القائمة عند الضغط في أي مكان خارجها
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
                setTimeout(typeEffect, 100); // سرعة الكتابة
            }
        }
        setTimeout(typeEffect, 800);
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
                entry.target.classList.add('reveal-active');
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

    // إضافة كلاس التفعيل للأنيميشن
    if (!document.getElementById('reveal-styles')) {
        const style = document.createElement('style');
        style.id = 'reveal-styles';
        style.innerHTML = '.reveal-active { opacity: 1 !important; transform: translateY(0) !important; }';
        document.head.appendChild(style);
    }

    // --- 5. معرض الصور (Lightbox) ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const imgSrc = img.src;
            const imgTitle = this.querySelector('h3') ? this.querySelector('h3').innerText : 'أحفاد الفراعنة للديكور';
            createLightbox(imgSrc, imgTitle);
        });
    });

    function createLightbox(src, title) {
        const lightbox = document.createElement('div');
        lightbox.id = 'custom-lightbox';
        
        Object.assign(lightbox.style, {
            position: 'fixed',
            inset: '0',
            background: 'rgba(0,0,0,0.96)',
            zIndex: '5000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            cursor: 'zoom-out',
            padding: '20px',
            transition: 'opacity 0.3s ease'
        });

        lightbox.innerHTML = `
            <div style="text-align:center; max-width: 900px; width: 100%;">
                <img src="${src}" style="max-width:100%; max-height:75vh; border:2px solid #c5a059; border-radius: 4px; box-shadow: 0 0 50px rgba(197, 160, 89, 0.4); margin-bottom: 20px;">
                <h3 style="color:#fff; font-family:Cairo; font-weight:400; font-size: 1.5rem;">${title}</h3>
                <p style="color:#c5a059; margin-top:10px; font-size:13px;">إضغط في أي مكان للعودة</p>
            </div>
        `;

        lightbox.onclick = () => {
            lightbox.style.opacity = '0';
            setTimeout(() => lightbox.remove(), 300);
        };
        document.body.appendChild(lightbox);
    }
});
