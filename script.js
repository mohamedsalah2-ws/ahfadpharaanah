/**
 * أحفاد الفراعنة للديكور - المحرك البرمجي النهائي 2025
 * يشمل: الكتابة الآلية، تحكم الهيدر، أنيميشن الظهور، والمعرض المطور
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. تأثير الكتابة الآلية (Typing Effect) لعنوان الهيرو ---
    const bronzeText = document.querySelector('.bronze-text');
    if (bronzeText) {
        const fullText = bronzeText.innerText;
        bronzeText.innerText = ''; // تفريغ النص للبدء بالكتابة
        let charIndex = 0;

        function typeEffect() {
            if (charIndex < fullText.length) {
                bronzeText.innerHTML += fullText.charAt(charIndex);
                charIndex++;
                setTimeout(typeEffect, 150); // سرعة الكتابة بالملي ثانية
            }
        }
        // بدء التأثير بعد تأخير بسيط لجذب الانتباه
        setTimeout(typeEffect, 500);
    }

    // --- 2. التحكم في الهيدر عند التمرير ---
    const header = document.querySelector('header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.style.background = '#0a0a0a';
            header.style.padding = '10px 8%';
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.8)';
        } else {
            header.style.background = 'transparent';
            header.style.padding = '20px 8%';
            header.style.boxShadow = 'none';
        }
    };
    window.addEventListener('scroll', handleScroll);

    // --- 3. أنيميشن ظهور العناصر (Scroll Reveal) باستخدام IntersectionObserver ---
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealOnScroll.unobserve(entry.target); // تحسين الأداء
            }
        });
    }, revealOptions);

    // استهداف العناصر (الخدمات، المعرض، كروت التواصل)
    const scrollElements = document.querySelectorAll('.service-item, .gallery-item, .contact .card');
    scrollElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        revealOnScroll.observe(el);
    });

    // حقن كلاس النشاط في الـ CSS برمجياً
    if (!document.getElementById('reveal-styles')) {
        const style = document.createElement('style');
        style.id = 'reveal-styles';
        style.innerHTML = '.active { opacity: 1 !important; transform: translateY(0) !important; }';
        document.head.appendChild(style);
    }

    // --- 4. معرض الصور المطور (Lightbox) ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const imgSrc = img.src;
            // محاولة جلب العنوان من h3 داخل الـ overlay أو الـ alt بتاع الصورة
            const imgTitle = this.querySelector('h3') ? this.querySelector('h3').innerText : 
                             (img.alt ? img.alt : 'أحد أعمالنا الفنية');
            
            createLightbox(imgSrc, imgTitle);
        });
    });

    function createLightbox(src, title) {
        const lightbox = document.createElement('div');
        lightbox.id = 'custom-lightbox';
        
        // تنسيق طبقة العرض (Inline Styles للفخامة والتحكم الكامل)
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
            animation: 'fadeIn 0.4s ease'
        });

        lightbox.innerHTML = `
            <div style="text-align:center; max-width: 900px; width: 100%;">
                <img src="${src}" style="max-width:100%; max-height:75vh; border:2px solid #c5a059; border-radius: 4px; box-shadow: 0 0 50px rgba(197, 160, 89, 0.4); margin-bottom: 20px;">
                <h3 style="color:#fff; font-family:Cairo; font-weight:400; font-size: 1.5rem; letter-spacing: 1px;">${title}</h3>
                <p style="color:#c5a059; margin-top:10px; font-size:13px; opacity: 0.8;">إضغط في أي مكان للعودة للمعرض</p>
            </div>
        `;

        // إغلاق المعرض عند الضغط
        lightbox.onclick = () => {
            lightbox.style.opacity = '0';
            setTimeout(() => lightbox.remove(), 300);
        };
        
        document.body.appendChild(lightbox);
    }
});