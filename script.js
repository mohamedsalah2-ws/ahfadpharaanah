document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // --- 1. قائمة الموبايل ---
    // =========================================================
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

    // =========================================================
    // --- 2. تأثير الكتابة على النص الذهبي ---
    // =========================================================
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

    // =========================================================
    // --- 3. تغيير خلفية الهيدر عند التمرير ---
    // =========================================================
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

    // =========================================================
    // --- 4. تأثير الظهور عند التمرير ---
    // =========================================================
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

    // =========================================================
    // --- 5. إغلاق مودال الصور عند الضغط على الخلفية ---
    // =========================================================
    const folderModal = document.getElementById('folder-modal');
    if (folderModal) {
        folderModal.addEventListener('click', (e) => {
            if (e.target.id === 'folder-modal' || e.target.classList.contains('modal-slider-container')) {
                closeModal();
            }
        });

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
            const swipeThreshold = 50;
            if (touchStartX - touchEndX > swipeThreshold) changeImage(1);
            if (touchEndX - touchStartX > swipeThreshold) changeImage(-1);
        }
    }

    // =========================================================
    // --- 6. توليد الـ Thumbnail من الفيديو تلقائياً ---
    //
    //  كيفية التحكم في اللقطة؟
    //  أضف data-time="10" على الـ <img> في HTML
    //  مثال: <img class="video-thumb-auto" data-video="videos/project1.mp4" data-time="10">
    //  لو مش حاطط data-time هياخد الثانية 1 تلقائياً
    // =========================================================
    function generateVideoThumbnail(videoSrc, imgElement) {
        const video = document.createElement('video');
        video.src = videoSrc;
        video.crossOrigin = 'anonymous';
        video.muted = true;
        video.playsInline = true;
        video.preload = 'metadata';

        video.addEventListener('loadeddata', () => {
            // اقرأ الثانية من data-time، لو مش موجودة استخدم 1
            const seekTime = parseFloat(imgElement.dataset.time) || 1;
            video.currentTime = seekTime;
        });

        video.addEventListener('seeked', () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 360;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

            try {
                imgElement.src = canvas.toDataURL('image/jpeg', 0.85);
            } catch (e) {
                console.warn('تعذّر توليد الـ thumbnail بسبب قيود CORS:', videoSrc);
            }
        });

        video.addEventListener('error', () => {
            console.warn('فشل تحميل الفيديو:', videoSrc);
        });

        video.load();
    }

    // طبّق على كل كروت الفيديو
    document.querySelectorAll('.video-thumb-auto').forEach(img => {
        const videoSrc = img.dataset.video;
        if (videoSrc) generateVideoThumbnail(videoSrc, img);
    });

    // =========================================================
    // --- 7. إغلاق مودال الفيديو عند الضغط على الخلفية ---
    // =========================================================
    const videoModal = document.getElementById('video-modal');
    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target.id === 'video-modal') closeVideo();
        });
    }
});


// =========================================================
// --- محرك المجلدات وعرض الصور ---
// =========================================================

let currentFolderImages = [];
let currentImageIndex = 0;

function openFolder(folderId, folderTitle) {
    const hiddenFolder = document.getElementById(folderId);
    if (hiddenFolder) {
        const images = hiddenFolder.querySelectorAll('img');
        if (images.length > 0) {
            currentFolderImages = Array.from(images).map(img => img.src);
            currentImageIndex = 0;
            document.getElementById('modal-folder-title').innerText = folderTitle;
            updateModalView();
            document.getElementById('folder-modal').style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
}

function changeImage(step) {
    const imgElement = document.getElementById('modal-main-img');
    imgElement.style.opacity = '0';
    setTimeout(() => {
        currentImageIndex += step;
        if (currentImageIndex >= currentFolderImages.length) currentImageIndex = 0;
        if (currentImageIndex < 0) currentImageIndex = currentFolderImages.length - 1;
        updateModalView();
        imgElement.style.opacity = '1';
    }, 200);
}

function updateModalView() {
    document.getElementById('modal-main-img').src = currentFolderImages[currentImageIndex];
    document.getElementById('image-counter').innerText = (currentImageIndex + 1) + ' / ' + currentFolderImages.length;
}

function closeModal() {
    document.getElementById('folder-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}


// =========================================================
// --- محرك عرض الفيديوهات ---
// =========================================================

function openVideo(videoSrc) {
    const videoModal = document.getElementById('video-modal');
    const videoPlayer = document.getElementById('main-video-player');
    if (videoModal && videoPlayer) {
        videoPlayer.src = videoSrc;
        videoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        videoPlayer.play();
    }
}

function closeVideo() {
    const videoModal = document.getElementById('video-modal');
    const videoPlayer = document.getElementById('main-video-player');
    if (videoModal && videoPlayer) {
        videoModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
        videoPlayer.src = '';
    }
}
