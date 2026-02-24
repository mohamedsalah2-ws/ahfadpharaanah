/**
 * أحفاد الفراعنة للديكور - المحرك البرمجي المطور V4.1 (دعم السحب والإغلاق الذكي)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. التحكم في القائمة المتجاوبة ---
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); 
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        const allNavLinks = document.querySelectorAll('.navigation a');
        allNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });

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
                setTimeout(typeEffect, 100);
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

    const scrollElements = document.querySelectorAll('.service-item, .contact-wrapper > div, .folder-card'); 
    scrollElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        revealOnScroll.observe(el);
    });

    if (!document.getElementById('reveal-styles')) {
        const style = document.createElement('style');
        style.id = 'reveal-styles';
        style.innerHTML = '.reveal-active { opacity: 1 !important; transform: translateY(0) !important; }';
        document.head.appendChild(style);
    }
    
    // --- إعدادات إغلاق النافذة عند الضغط في الخلفية ---
    const folderModal = document.getElementById('folder-modal');
    if (folderModal) {
        folderModal.addEventListener('click', (e) => {
            // الإغلاق فقط إذا كان الضغط على الخلفية السوداء أو الحاوية، وليس على الصورة أو الأسهم
            if (e.target.id === 'folder-modal' || e.target.classList.contains('modal-slider-container')) {
                closeModal();
            }
        });
        
        // --- إعدادات السحب (Swipe) للموبايل ---
        let touchStartX = 0;
        let touchEndX = 0;

        folderModal.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        folderModal.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50; // المسافة المطلوبة لاعتبار الحركة "سحبة"
            
            // سحب لليسار (الصورة التالية)
            if (touchStartX - touchEndX > swipeThreshold) {
                changeImage(1);
            }
            // سحب لليمين (الصورة السابقة)
            if (touchEndX - touchStartX > swipeThreshold) {
                changeImage(-1);
            }
        }
    }
});

// =========================================================
// --- 5. محرك المجلدات وعرض الصور (بالخارج لتعمل مع HTML) ---
// =========================================================

let currentFolderImages = [];
let currentImageIndex = 0;

// دالة فتح الفولدر
function openFolder(folderId, folderTitle) {
    const hiddenFolder = document.getElementById(folderId);
    
    if (hiddenFolder) {
        const images = hiddenFolder.querySelectorAll('img');
        
        if (images.length > 0) {
            currentFolderImages = Array.from(images).map(img => img.src);
            currentImageIndex = 0;

            document.getElementById('modal-folder-title').innerText = folderTitle;
            
            updateModalView();
            const modal = document.getElementById('folder-modal');
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; 
        } else {
            console.log("لا توجد صور في هذا القسم بعد.");
        }
    }
}

// دالة تقليب الصور يميناً ويساراً
function changeImage(step) {
    const imgElement = document.getElementById('modal-main-img');
    imgElement.style.opacity = '0'; 
    
    setTimeout(() => {
        currentImageIndex += step;
        
        if (currentImageIndex >= currentFolderImages.length) {
            currentImageIndex = 0;
        } else if (currentImageIndex < 0) {
            currentImageIndex = currentFolderImages.length - 1;
        }
        
        updateModalView();
        imgElement.style.opacity = '1'; 
    }, 200);
}

// دالة تحديث الصورة المعروضة
function updateModalView() {
    document.getElementById('modal-main-img').src = currentFolderImages[currentImageIndex];
    document.getElementById('image-counter').innerText = (currentImageIndex + 1) + ' / ' + currentFolderImages.length;
}

// دالة إغلاق النافذة
function closeModal() {
    document.getElementById('folder-modal').style.display = 'none';
    document.body.style.overflow = 'auto'; 
}

// =========================================================
// --- 6. محرك عرض الفيديوهات (Cinematic Video Player) ---
// =========================================================

function openVideo(videoSrc) {
    const videoModal = document.getElementById('video-modal');
    const videoPlayer = document.getElementById('main-video-player');

    if (videoModal && videoPlayer) {
        // تغيير مسار الفيديو وتشغيله
        videoPlayer.src = videoSrc;
        
        // إظهار النافذة
        videoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // إيقاف التمرير
        
        // تشغيل الفيديو تلقائياً
        videoPlayer.play();
    }
}

function closeVideo() {
    const videoModal = document.getElementById('video-modal');
    const videoPlayer = document.getElementById('main-video-player');

    if (videoModal && videoPlayer) {
        // إخفاء النافذة
        videoModal.style.display = 'none';
        document.body.style.overflow = 'auto'; 
        
        // إيقاف الفيديو وتفريغ المسار حتى لا يستمر في الخلفية
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
        videoPlayer.src = "";
    }
}

// إغلاق الفيديو عند الضغط في الخلفية السوداء
document.addEventListener('DOMContentLoaded', () => {
    const videoModal = document.getElementById('video-modal');
    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target.id === 'video-modal') {
                closeVideo();
            }
        });
    }
});
