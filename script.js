gsap.registerPlugin(ScrollTrigger);

// Animation d'entrée des sections
gsap.utils.toArray(".section").forEach((section) => {
    gsap.from(section, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });
});

// Carrousel GSAP
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const projects = document.querySelectorAll('.project');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');
    
    console.log('Nombre de projets trouvés:', projects.length);
    console.log('Nombre d\'indicateurs trouvés:', indicators.length);
    
    if (projects.length === 0) return;
    
    let currentIndex = 0;
    const projectWidth = 1200; // Largeur exacte d'un projet
    
    // Fonction pour mettre à jour les indicateurs
    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // Fonction pour aller au projet suivant
    function nextProject() {
        currentIndex = (currentIndex + 1) % projects.length;
        updateCarousel();
    }
    
    // Fonction pour aller au projet précédent
    function prevProject() {
        currentIndex = (currentIndex - 1 + projects.length) % projects.length;
        updateCarousel();
    }
    
    // Fonction pour aller à un projet spécifique
    function goToProject(index) {
        currentIndex = index;
        updateCarousel();
    }
    
    // Fonction pour mettre à jour la position du carrousel
    function updateCarousel() {
        gsap.to(carousel, {
            x: -currentIndex * projectWidth,
            duration: 0.8,
            ease: "power2.inOut"
        });
        
        updateIndicators();
    }
    
    // Initialiser l'état du carrousel
    updateIndicators();
    
    // Écouteurs d'événements pour les boutons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            clearInterval(autoplayTimer);
            prevProject();
            autoplayTimer = setInterval(nextProject, 8000);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            clearInterval(autoplayTimer);
            nextProject();
            autoplayTimer = setInterval(nextProject, 8000);
        });
    }
    
    // Écouteurs d'événements pour les indicateurs
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            clearInterval(autoplayTimer);
            goToProject(index);
            autoplayTimer = setInterval(nextProject, 8000);
        });
    });
    
    // Défilement automatique
    let autoplayTimer = setInterval(nextProject, 8000);
    
    // Pause du défilement automatique au survol
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoplayTimer);
    });
    
    // Reprise du défilement automatique
    carousel.addEventListener('mouseleave', () => {
        autoplayTimer = setInterval(nextProject, 8000);
    });
    
    // Navigation tactile/clavier
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            clearInterval(autoplayTimer);
            prevProject();
            autoplayTimer = setInterval(nextProject, 8000);
        } else if (e.key === 'ArrowRight') {
            clearInterval(autoplayTimer);
            nextProject();
            autoplayTimer = setInterval(nextProject, 8000);
        }
    });
    
    // Support tactile
    let startX = 0;
    let isDragging = false;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        clearInterval(autoplayTimer);
    });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });
    
    carousel.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextProject();
            } else {
                prevProject();
            }
        }
        
        isDragging = false;
        autoplayTimer = setInterval(nextProject, 8000);
    });
});
