/**
 * أحفاد الفراعنة للديكور - المحرك البرمجي النهائي 2025
 * يشمل: القائمة المتجاوبة، الكتابة الآلية، تحكم الهيدر، أنيميشن الظهور، والمعرض المطور
 */

document.addEventListener('DOMContentLoaded', () => {
    
   
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); 
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

       
      // إغلاق القائمة عند الضغط على أي رابط داخلها
const navLinksItems = document.querySelectorAll('.navigation a');
navLinksItems.forEach(link => {
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

   
    const header = document.querySelector('header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
            header.style.padding = '10px 8%';
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.8)';
        } else {
            header.style.background = 'transparent';
            header.style.padding = '20px 8%';
            header.style.boxShadow = 'none';
        }
    };
    window.addEventListener('scroll', handleScroll);

    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealOnScroll.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    const scrollElements = document.querySelectorAll('.service-item, .gallery-item, .contact-wrapper > div');
    scrollElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        revealOnScroll.observe(el);
    });

    if (!document.getElementById('reveal-styles')) {
        const style = document.createElement('style');
        style.id = 'reveal-styles';
        style.innerHTML = '.active { opacity: 1 !important; transform: translateY(0) !important; }';
        document.head.appendChild(style);
    }

   
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const imgSrc = img.src;
            const imgTitle = this.querySelector('h3') ? this.querySelector('h3').innerText : 
                             (img.alt ? img.alt : 'أحد أعمالنا الفنية');
            
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
            animation: 'fadeIn 0.4s ease'
        });

        lightbox.innerHTML = `
            <div style="text-align:center; max-width: 900px; width: 100%;">
                <img src="${src}" style="max-width:100%; max-height:75vh; border:2px solid #c5a059; border-radius: 4px; box-shadow: 0 0 50px rgba(197, 160, 89, 0.4); margin-bottom: 20px;">
                <h3 style="color:#fff; font-family:Cairo; font-weight:400; font-size: 1.5rem; letter-spacing: 1px;">${title}</h3>
                <p style="color:#c5a059; margin-top:10px; font-size:13px; opacity: 0.8;">إضغط في أي مكان للعودة للمعرض</p>
            </div>
        `;

        lightbox.onclick = () => {
            lightbox.style.opacity = '0';
            setTimeout(() => lightbox.remove(), 300);
        };
        
        document.body.appendChild(lightbox);
    }
});


