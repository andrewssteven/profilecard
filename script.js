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



// Contact Form Validation and Submission

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Displays error message for a field
 * @param {string} fieldId - ID of the input field
 * @param {string} message - Error message to display
 */
function showError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errorDiv = document.querySelector(
    `[data-testid="test-contact-error-${fieldId
      .replace(/([A-Z])/g, "-$1")
      .toLowerCase()
      .replace("full-name", "name")}"]`
  );

  if (input && errorDiv) {
    input.classList.add("error");
    input.setAttribute("aria-invalid", "true");
    errorDiv.textContent = message;
  }
}

/**
 * Clears error message for a field
 * @param {string} fieldId - ID of the input field
 */
function clearError(fieldId) {
  const input = document.getElementById(fieldId);
  const errorDiv = document.querySelector(
    `[data-testid="test-contact-error-${fieldId
      .replace(/([A-Z])/g, "-$1")
      .toLowerCase()
      .replace("full-name", "name")}"]`
  );

  if (input && errorDiv) {
    input.classList.remove("error");
    input.removeAttribute("aria-invalid");
    errorDiv.textContent = "";
  }
}

/**
 * Validates a single form field
 * @param {string} fieldId - ID of the field to validate
 * @param {string} value - Value to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateField(fieldId, value) {
  clearError(fieldId);

  switch (fieldId) {
    case "fullName":
      if (!value.trim()) {
        showError(fieldId, "Full name is required");
        return false;
      }
      if (value.trim().length < 2) {
        showError(fieldId, "Full name must be at least 2 characters");
        return false;
      }
      break;

    case "email":
      if (!value.trim()) {
        showError(fieldId, "Email is required");
        return false;
      }
      if (!isValidEmail(value.trim())) {
        showError(
          fieldId,
          "Please enter a valid email address (e.g., name@example.com)"
        );
        return false;
      }
      break;

    case "subject":
      if (!value.trim()) {
        showError(fieldId, "Subject is required");
        return false;
      }
      if (value.trim().length < 3) {
        showError(fieldId, "Subject must be at least 3 characters");
        return false;
      }
      break;

    case "message":
      if (!value.trim()) {
        showError(fieldId, "Message is required");
        return false;
      }
      if (value.trim().length < 10) {
        showError(fieldId, "Message must be at least 10 characters");
        return false;
      }
      break;
  }

  return true;
}

/**
 * Validates the entire form
 * @returns {boolean} - True if all fields are valid
 */
function validateForm() {
  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  let isValid = true;

  isValid = validateField("fullName", fullName) && isValid;
  isValid = validateField("email", email) && isValid;
  isValid = validateField("subject", subject) && isValid;
  isValid = validateField("message", message) && isValid;

  return isValid;
}

/**
 * Shows success message after form submission
 * @param {string} name - Name of the person who submitted the form
 */
function showSuccessMessage(name) {
  const successDiv = document.querySelector(
    '[data-testid="test-contact-success"]'
  );
  if (successDiv) {
    successDiv.textContent = `Thank you, ${name}! Your message has been sent successfully. We'll get back to you soon.`;

    // Scroll to success message
    successDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });

    // Hide success message after 8 seconds
    setTimeout(() => {
      successDiv.textContent = "";
    }, 8000);
  }
}

/**
 * Resets the form to its initial state
 */
function resetForm() {
  const form = document.getElementById("contactForm");
  if (form) {
    form.reset();

    // Clear any remaining errors
    ["fullName", "email", "subject", "message"].forEach(clearError);
  }
}

/**
 * Handles form submission
 * @param {Event} event - Submit event
 */
function handleSubmit(event) {
  event.preventDefault();

  // Clear any previous success message
  const successDiv = document.querySelector(
    '[data-testid="test-contact-success"]'
  );
  if (successDiv) {
    successDiv.textContent = "";
  }

  // Validate form
  if (!validateForm()) {
    // Focus on first error field
    const firstError = document.querySelector(
      ".form-input.error, .form-textarea.error"
    );
    if (firstError) {
      firstError.focus();
    }
    return;
  }

  // Get form data
  const formData = {
    fullName: document.getElementById("fullName").value.trim(),
    email: document.getElementById("email").value.trim(),
    subject: document.getElementById("subject").value.trim(),
    message: document.getElementById("message").value.trim(),
  };

  // Disable submit button during "submission"
  const submitButton = document.querySelector(
    '[data-testid="test-contact-submit"]'
  );
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
  }

  // Simulate API call
  setTimeout(() => {
    // Log form data (in a real app, this would be sent to a server)
    console.log("Form submitted:", formData);

    // Show success message
    showSuccessMessage(formData.fullName);

    // Reset form
    resetForm();

    // Re-enable submit button
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Send Message";
    }
  }, 1000);
}

/**
 * Sets up real-time validation for form fields
 */
function setupRealtimeValidation() {
  const fields = ["fullName", "email", "subject", "message"];

  fields.forEach((fieldId) => {
    const input = document.getElementById(fieldId);
    if (input) {
      // Validate on blur (when user leaves the field)
      input.addEventListener("blur", function () {
        if (this.value.trim() !== "") {
          validateField(fieldId, this.value);
        }
      });

      // Clear error on input (while typing)
      input.addEventListener("input", function () {
        if (this.classList.contains("error")) {
          clearError(fieldId);
        }
      });
    }
  });
}

/**
 * Sets up keyboard navigation enhancements
 */
function setupKeyboardNavigation() {
  const form = document.getElementById("contactForm");
  if (form) {
    // Allow Enter to submit form, but only from input fields (not textarea)
    form.addEventListener("keydown", function (event) {
      if (
        event.key === "Enter" &&
        event.target.tagName !== "TEXTAREA" &&
        event.target.tagName !== "BUTTON"
      ) {
        event.preventDefault();
        form.dispatchEvent(new Event("submit"));
      }
    });
  }
}

/**
 * Initialize contact form functionality
 */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", handleSubmit);
    setupRealtimeValidation();
    setupKeyboardNavigation();
    console.log("Contact form initialized");
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initContactForm);
} else {
  initContactForm();
}


// About Page JavaScript - Enhancements for accessibility and user experience

/**
 * Sets up smooth scroll for internal links
 */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        // Set focus to target for accessibility
        target.setAttribute("tabindex", "-1");
        target.focus();
      }
    });
  });
}

/**
 * Adds reading progress indicator
 */
function setupReadingProgress() {
  const progressBar = document.createElement("div");
  progressBar.className = "reading-progress";
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    z-index: 9999;
    transition: width 0.2s ease;
  `;
  document.body.prepend(progressBar);

  function updateProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercentage =
      (scrollTop / (documentHeight - windowHeight)) * 100;
    progressBar.style.width = `${Math.min(scrollPercentage, 100)}%`;
  }

  window.addEventListener("scroll", updateProgress);
  updateProgress();
}

/**
 * Adds intersection observer for sections
 */
function setupScrollAnimations() {
  if ("IntersectionObserver" in window) {
    const sections = document.querySelectorAll(".about-section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });
  }
}

/**
 * Enhances keyboard navigation
 */
function setupKeyboardNavigation() {
  // Add skip to main content link
  const skipLink = document.createElement("a");
  skipLink.href = "#main-content";
  skipLink.textContent = "Skip to main content";
  skipLink.className = "skip-link";
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--primary-color);
    color: white;
    padding: 8px;
    text-decoration: none;
    z-index: 10000;
    border-radius: 0 0 4px 0;
  `;
  skipLink.addEventListener("focus", function () {
    this.style.top = "0";
  });
  skipLink.addEventListener("blur", function () {
    this.style.top = "-40px";
  });

  document.body.prepend(skipLink);

  // Add id to main if not present
  const main = document.querySelector('[data-testid="test-about-page"]');
  if (main && !main.id) {
    main.id = "main-content";
  }
}

/**
 * Adds print functionality
 */
function setupPrintStyles() {
  // Add print button (optional)
  const printButton = document.createElement("button");
  printButton.textContent = "Print This Page";
  printButton.className = "print-button";
  printButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 50px;
    cursor: pointer;
    box-shadow: var(--shadow-lg);
    font-weight: 600;
    display: none;
    z-index: 1000;
  `;

  printButton.addEventListener("click", () => {
    window.print();
  });

  // Show print button on desktop
  if (window.innerWidth > 768) {
    printButton.style.display = "block";
  }

  window.addEventListener("resize", () => {
    printButton.style.display = window.innerWidth > 768 ? "block" : "none";
  });

  document.body.appendChild(printButton);
}

/**
 * Estimates reading time
 */
function calculateReadingTime() {
  const content = document.querySelector(".about-container");
  if (!content) return;

  const text = content.textContent || "";
  const wordCount = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words/min

  const readingTimeElement = document.createElement("p");
  readingTimeElement.textContent = `📖 Estimated reading time: ${readingTime} minute${
    readingTime > 1 ? "s" : ""
  }`;
  readingTimeElement.style.cssText = `
    text-align: center;
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    margin-top: var(--spacing-sm);
  `;

  const header = document.querySelector(".about-header");
  if (header) {
    header.appendChild(readingTimeElement);
  }
}

/**
 * Adds back to top button
 */
function setupBackToTop() {
  const backToTopButton = document.createElement("button");
  backToTopButton.innerHTML = "↑";
  backToTopButton.setAttribute("aria-label", "Back to top");
  backToTopButton.className = "back-to-top";
  backToTopButton.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    background: var(--primary-color);
    color: white;
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: var(--shadow-lg);
    font-size: 24px;
    display: none;
    z-index: 1000;
    transition: all 0.3s ease;
  `;

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  function toggleBackToTop() {
    if (window.pageYOffset > 300) {
      backToTopButton.style.display = "block";
    } else {
      backToTopButton.style.display = "none";
    }
  }

  window.addEventListener("scroll", toggleBackToTop);
  document.body.appendChild(backToTopButton);
}

/**
 * Initialize about page functionality
 */
function initAboutPage() {
  console.log("About page initialized");

  // Core functionality
  setupSmoothScroll();
  setupKeyboardNavigation();
  setupScrollAnimations();

  // Enhancements
  setupReadingProgress();
  calculateReadingTime();
  setupBackToTop();
  setupPrintStyles();

  // Add loaded class for transitions
  document.body.classList.add("loaded");

  // Log page view (for analytics in real app)
  console.log("About page viewed at:", new Date().toISOString());
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAboutPage);
} else {
  initAboutPage();
}
