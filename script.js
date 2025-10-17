function updateTime() {
  const timeElement = document.querySelector('[data-testid="test-user-time"]');

  if (timeElement) {
    const currentTime = Date.now();
    timeElement.textContent = currentTime;
    timeElement.setAttribute("datetime", new Date(currentTime).toISOString());
  }
}

/* Initialize time display on page load */
function initializeTime() {
  updateTime();
  setInterval(updateTime, 1000);
}

// Avatar Upload Functionality
function setupAvatarUpload() {
  const avatarImg = document.querySelector('[data-testid="test-user-avatar"]');

  if (avatarImg) {
    // Add error handling for avatar loading
    avatarImg.addEventListener("error", function () {
      console.warn("Avatar image failed to load, using fallback");
      this.src =
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%236366f1" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="80" fill="white"%3EJD%3C/text%3E%3C/svg%3E';
    });

    //Add click handler to upload new avatar    
        avatarImg.style.cursor = 'pointer';
        avatarImg.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    
                    reader.addEventListener('load', function(e) {
                        avatarImg.src = e.target.result;
                    });
                    
                    reader.readAsDataURL(file);
                }
            });
            
            input.click();
        });
    
  }
}

/* Enhances keyboard navigation and screen reader support */
function setupAccessibility() {
  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll("a, button");

  interactiveElements.forEach((element) => {
    // Add visual feedback for keyboard focus
    element.addEventListener("focus", function () {
      this.classList.add("keyboard-focused");
    });

    element.addEventListener("blur", function () {
      this.classList.remove("keyboard-focused");
    });
  });

  // Announce dynamic content changes to screen readers
  const timeElement = document.querySelector('[data-testid="test-user-time"]');
  if (timeElement) {
    timeElement.setAttribute("aria-live", "polite");
    timeElement.setAttribute("aria-atomic", "true");
  }
}

// Animation on Scroll (Optional)
function setupScrollAnimations() {
  // Check if Intersection Observer is supported
  if ("IntersectionObserver" in window) {
    const sections = document.querySelectorAll(
      ".profile-section, .profile-social"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    sections.forEach((section) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(20px)";
      section.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      observer.observe(section);
    });
  }
}

// Initialization
function init() {
  console.log("Profile Card initialized");

  // Core functionality
  initializeTime();

  // Optional enhancements
  setupAvatarUpload();
  setupAccessibility();
  setupScrollAnimations();

  // Add loaded class to body for CSS transitions
  document.body.classList.add("loaded");
}

// Run initialization when DOM is fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  // DOM is already loaded
  init();
}