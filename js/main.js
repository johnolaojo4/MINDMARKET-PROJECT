// main.js

document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // 1. Idea card click functionality
  // =========================
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    card.style.cursor = "pointer";

    card.addEventListener("click", (e) => {
      if (e.target.closest(".action-btn")) return;

      const ideaId = card.getAttribute("data-id");

      if (ideaId) {
        window.location.href = `idea-detail.html?id=${ideaId}`;
      } else {
        console.error("Card missing data-id attribute");
      }
    });
  });

  // =========================
  // 2. FAQ toggle functionality
  // =========================
  const faqButtons = document.querySelectorAll(".faq-question");

  faqButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const faqItem = btn.parentElement;
      const answer = faqItem.querySelector(".faq-answer");
      const plusIcon = btn.querySelector(".plus-icon");

      faqItem.classList.toggle("open");

      if (faqItem.classList.contains("open")) {
        answer.style.maxHeight = answer.scrollHeight + "px";
        if (plusIcon) plusIcon.textContent = "−";
      } else {
        answer.style.maxHeight = null;
        if (plusIcon) plusIcon.textContent = "+";
      }
    });
  });

  // =========================
  // 3. Hamburger Menu functionality
  // =========================
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");
  const body = document.body;

  if (hamburger && mobileNav) {
    // Toggle mobile menu
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      hamburger.classList.toggle("active");
      mobileNav.classList.toggle("active");
      body.classList.toggle("menu-open");
    });

    // Close mobile menu when clicking a link
    mobileNav.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        hamburger.classList.remove("active");
        mobileNav.classList.remove("active");
        body.classList.remove("menu-open");
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove("active");
        mobileNav.classList.remove("active");
        body.classList.remove("menu-open");
      }
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        hamburger.classList.remove("active");
        mobileNav.classList.remove("active");
        body.classList.remove("menu-open");
      }
    });
  }

  // =========================
  // 4. Search functionality 
  // =========================
  const searchInput = document.getElementById("searchInput");
  const filterBtn = document.getElementById("filterBtn");

  if (searchInput) {
    // Create "No results" message
    const noResults = document.createElement("p");
    noResults.textContent = "No results found";
    noResults.classList.add("no-results");
    noResults.style.display = "none";
    noResults.style.textAlign = "center";
    noResults.style.marginTop = "1rem";
    noResults.style.color = "#666";
    searchInput.parentElement.appendChild(noResults);

    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase();
      const cards = document.querySelectorAll(".card");
      let anyVisible = false;

      cards.forEach((card) => {
        const title = card.querySelector(".title")?.textContent.toLowerCase() || "";

        if (title.includes(query)) {
          card.style.display = "block"; // show card
          anyVisible = true;
        } else {
          card.style.display = "none"; // hide card
        }
      });

      // Toggle "No results" message
      noResults.style.display = anyVisible ? "none" : "block";
    });
  }

  if (filterBtn) {
    filterBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Filter clicked");
      
    });
  }
});

// File upload functionality
        const uploadArea = document.getElementById('uploadArea');
        const uploadButton = uploadArea.querySelector('.upload-button');
        
        uploadButton.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    uploadArea.querySelector('.upload-text').innerHTML = 
                        `<strong>File Selected:</strong><br>${file.name}`;
                }
            };
            input.click();
        });

        // Drag and drop functionality
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.querySelector('.upload-text').innerHTML = 
                    `<strong>File Selected:</strong><br>${files[0].name}`;
            }
        });

        // Form submission
        document.getElementById('ideaForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Idea submitted successfully!');
        });

        // Check authentication before allowing uploads
document.addEventListener('DOMContentLoaded', function() {
  // Handle upload idea buttons on homepage
  const uploadButtons = document.querySelectorAll('.upload-idea-btn');
  
  uploadButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const savedProfile = localStorage.getItem("mindmarketProfile");
      if (!savedProfile) {
        // User not authenticated - show message and redirect to sign-up
        alert('Please create your profile first to upload ideas');
        setTimeout(() => {
          window.location.href = 'sign-up.html';
        }, 1000);
      } else {
        // User authenticated - go to upload page
        window.location.href = 'upload.html';
      }
    });
  });
});