// main.js - Updated with proper card navigation

document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // 1. Make idea cards clickable
  // =========================
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    // Make the entire card clickable
    card.style.cursor = "pointer";
    
    card.addEventListener("click", (e) => {
      // Prevent navigation if clicking on action buttons
      if (e.target.closest('.action-btn')) {
        return;
      }

      // Get the idea ID from data-id attribute
      const ideaId = card.getAttribute('data-id');
      
      if (ideaId) {
        // Redirect to detail page with ID in query string
        window.location.href = `idea-detail.html?id=${ideaId}`;
      } else {
        console.error('Card missing data-id attribute');
      }
    });
  });

  // =========================
  // 2. Handle action buttons separately (prevent navigation)
  // =========================
  const actionButtons = document.querySelectorAll('.action-btn');
  
  actionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent card click event
      
      if (btn.classList.contains('heart-btn')) {
        // Toggle heart state
        btn.style.opacity = btn.style.opacity === '0.5' ? '1' : '0.5';
      } else if (btn.classList.contains('bookmark-btn')) {
        // Toggle bookmark state  
        btn.style.opacity = btn.style.opacity === '0.5' ? '1' : '0.5';
      } else if (btn.classList.contains('share-btn')) {
        // Copy link functionality
        const card = btn.closest('.card');
        const ideaId = card.getAttribute('data-id');
        if (ideaId) {
          const link = `${window.location.origin}/idea-detail.html?id=${ideaId}`;
          navigator.clipboard.writeText(link).then(() => {
            alert('Link copied to clipboard!');
          }).catch(() => {
            prompt('Copy this link:', link);
          });
        }
      } else if (btn.classList.contains('comment-btn')) {
        
        const card = btn.closest('.card');
        const ideaId = card.getAttribute('data-id');
        if (ideaId) {
          window.location.href = `idea-detail.html?id=${ideaId}#comments`;
        }
      }
    });
  });

  // =========================
  // 3. FAQ toggle functionality
  // =========================
  const faqButtons = document.querySelectorAll(".faq-question");

  faqButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const faqItem = btn.parentElement;
      const answer = faqItem.querySelector(".faq-answer");
      const plusIcon = btn.querySelector(".plus-icon");

      // Toggle open class
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
});