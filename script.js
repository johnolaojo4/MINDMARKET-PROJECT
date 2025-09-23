class UserProfileManager {
  constructor() {
    this.userData = {};
    this.apiBaseUrl = "https://mind-market-api.onrender.com";
    this.init();
  }

  /**
   * Initializes the UserProfileManager by binding events and loading saved data.
   */
  init() {
    this.bindEvents();
    this.loadSavedData();
  }

  bindEvents() {
    const userTypeSelect = document.getElementById("userType");
    const form = document.getElementById("userForm");
    const editButton = document.getElementById("editProfile");

    userTypeSelect?.addEventListener("change", (e) => {
      this.showRelevantSection(e.target.value);
    });

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    editButton?.addEventListener("click", () => {
      this.showForm();
    });

    // File input handlers
    this.setupFileHandlers();
  }

  setupFileHandlers() {
    // Profile image handler
    const profileImageInput = document.getElementById("profileImage");
    profileImageInput?.addEventListener("change", (e) => {
      this.handleImagePreview(e, "profilePreview", false);
    });

    // Portfolio images handler
    const portfolioInput = document.getElementById("portfolio");
    portfolioInput?.addEventListener("change", (e) => {
      this.handleImagePreview(e, "portfolioPreview", true);
    });

    // Documents handler
    const documentsInput = document.getElementById("ideaDocuments");
    documentsInput?.addEventListener("change", (e) => {
      this.handleDocumentPreview(e, "documentsPreview");
    });

    // Video handler
    const videoInput = document.getElementById("ideaVideo");
    videoInput?.addEventListener("change", (e) => {
      this.handleVideoPreview(e, "videoPreview");
    });
  }

  showRelevantSection(userType) {
    // Hide all dynamic sections
    const sections = document.querySelectorAll(".dynamic-section");
    sections.forEach((section) => {
      section.style.display = "none";
    });

    // Show relevant section
    const sectionMap = {
      investor: "investorSection",
      hirer: "hirerSection",
      "skilled-worker": "skilledWorkerSection",
      "idea-pitcher": "ideaPitcherSection",
    };

    const sectionId = sectionMap[userType];
    if (sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.style.display = "block";
      }
    }
  }

  handleImagePreview(event, previewId, multiple = false) {
    const files = event.target.files;
    const preview = document.getElementById(previewId);

    if (!preview) return;

    if (!multiple) {
      preview.innerHTML = "";
    }

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.style.width = "100px";
          img.style.height = "100px";
          img.style.objectFit = "cover";
          img.style.borderRadius = "8px";
          img.style.border = "2px solid #ddd";
          preview.appendChild(img);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  handleDocumentPreview(event, previewId) {
    const files = event.target.files;
    const preview = document.getElementById(previewId);

    if (!preview) return;

    preview.innerHTML = "";

    Array.from(files).forEach((file) => {
      const fileItem = document.createElement("div");
      fileItem.className = "file-item";
      fileItem.innerHTML = `
                <span>📄</span>
                <span>${file.name}</span>
                <span>(${this.formatFileSize(file.size)})</span>
            `;
      preview.appendChild(fileItem);
    });
  }

  handleVideoPreview(event, previewId) {
    const file = event.target.files[0];
    const preview = document.getElementById(previewId);

    if (!preview) return;

    preview.innerHTML = "";

    if (file && file.type.startsWith("video/")) {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);
      video.controls = true;
      video.style.width = "100%";
      video.style.maxWidth = "300px";
      video.style.borderRadius = "8px";
      preview.appendChild(video);
    }
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  async handleFormSubmit() {
    const form = document.getElementById("userForm");
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;

    // Show loading state
    submitBtn.textContent = "Creating Profile...";
    submitBtn.disabled = true;

    const formData = new FormData(form);
    this.userData = {};

    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
      if (this.userData[key]) {
        // Handle multiple files
        if (Array.isArray(this.userData[key])) {
          this.userData[key].push(value);
        } else {
          this.userData[key] = [this.userData[key], value];
        }
      } else {
        this.userData[key] = value;
      }
    }

    // Prepare data for backend API
    const backendData = {
      name: `${this.userData.firstName || ""} ${this.userData.lastName || ""}`.trim(),
      email: this.userData.email,
      password: this.userData.password,
    };

    // Validate required fields
    if (!backendData.name || !backendData.email || !backendData.password) {
      this.showMessage("Please fill in all required fields", "error");
      this.resetButton(submitBtn, originalBtnText);
      return;
    }

    if (backendData.password.length < 6) {
      this.showMessage("Password must be at least 6 characters long", "error");
      this.resetButton(submitBtn, originalBtnText);
      return;
    }

    try {
      // Register user with backend
      const response = await fetch(`${this.apiBaseUrl}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(backendData),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Store auth data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Save additional profile data locally
        this.saveData();

        this.showMessage(
          "Registration successful! Welcome to your dashboard.",
          "success"
        );

        // Show dashboard after a short delay
        setTimeout(() => {
          this.showDashboard();
        }, 1500);
      } else {
        this.showMessage(
          data.message || "Registration failed. Please try again.",
          "error"
        );
        this.resetButton(submitBtn, originalBtnText);
      }
    } catch (error) {
      console.error("Registration error:", error);
      this.showMessage(
        "Network error. Please check your connection and try again.",
        "error"
      );
      this.resetButton(submitBtn, originalBtnText);
    }
  }

  showMessage(message, type) {
    // Remove any existing message
    const existingMessage = document.querySelector(".message-alert");
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create new message element
    const messageDiv = document.createElement("div");
    messageDiv.className = `message-alert ${type}`;
    messageDiv.textContent = message;

    // Style the message
    messageDiv.style.cssText = `
        padding: 12px 16px;
        margin: 16px 0;
        border-radius: 8px;
        font-weight: 500;
        text-align: center;
        position: relative;
        animation: slideIn 0.3s ease-out;
        ${
          type === "success"
            ? "background-color: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;"
            : "background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;"
        }
    `;

    // Insert message after the form
    const form = document.getElementById("userForm");
    if (form) {
      form.parentNode.insertBefore(messageDiv, form.nextSibling);
    }

    // Auto-remove error messages after 5 seconds
    if (type === "error") {
      setTimeout(() => {
        if (messageDiv.parentNode) {
          messageDiv.remove();
        }
      }, 5000);
    }
  }

  resetButton(button, originalText) {
    button.textContent = originalText;
    button.disabled = false;
  }

  showDashboard() {
    const registrationForm = document.getElementById("registrationForm");
    const dashboard = document.getElementById("dashboard");

    if (registrationForm) registrationForm.style.display = "none";
    if (dashboard) dashboard.style.display = "block";

    this.populateDashboard();
  }

  showForm() {
    const registrationForm = document.getElementById("registrationForm");
    const dashboard = document.getElementById("dashboard");

    if (registrationForm) registrationForm.style.display = "block";
    if (dashboard) dashboard.style.display = "none";
  }

  populateDashboard() {
    const data = this.userData;
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Basic info - use backend user data where available
    const nameElement = document.getElementById("dashName");
    if (nameElement) {
      nameElement.textContent =
        user.name || `${data.firstName || ""} ${data.lastName || ""}`;
    }

    const userTypeElement = document.getElementById("dashUserType");
    if (userTypeElement) {
      userTypeElement.textContent = this.formatUserType(data.userType);
    }

    const locationElement = document.getElementById("dashLocation");
    if (locationElement) {
      locationElement.textContent = data.location || "";
    }

    const emailElement = document.getElementById("dashEmail");
    if (emailElement) {
      emailElement.textContent = user.email || data.email || "";
    }

    const phoneElement = document.getElementById("dashPhone");
    if (phoneElement) {
      phoneElement.textContent = data.phone || "";
    }

    const bioElement = document.getElementById("dashBio");
    if (bioElement) {
      bioElement.textContent = data.bio || "";
    }

    // Profile image
    if (data.profileImage && data.profileImage instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const profileImg = document.getElementById("dashProfileImage");
        if (profileImg) {
          profileImg.src = e.target.result;
          profileImg.style.display = "block";
        }
      };
      reader.readAsDataURL(data.profileImage);
    }

    // Dynamic content based on user type
    this.populateDynamicContent(data);
  }

  populateDynamicContent(data) {
    const container = document.getElementById("dashboardDynamicContent");
    if (!container) return;

    container.innerHTML = "";

    switch (data.userType) {
      case "investor":
        this.createInvestorDashboard(container, data);
        break;
      case "hirer":
        this.createHirerDashboard(container, data);
        break;
      case "skilled-worker":
        this.createSkilledWorkerDashboard(container, data);
        break;
      case "idea-pitcher":
        this.createIdeaPitcherDashboard(container, data);
        break;
    }
  }

  createInvestorDashboard(container, data) {
    container.innerHTML = `
            <div class="info-card">
                <h2>Investment Profile</h2>
                <p><strong>Investment Range:</strong> ${data.investmentRange || "Not specified"}</p>
                <p><strong>Investment Interests:</strong> ${
                  data.investmentInterests || "Not specified"
                }</p>
                <p><strong>Experience:</strong> ${data.experience || "Not specified"}</p>
            </div>
        `;
  }

  createHirerDashboard(container, data) {
    container.innerHTML = `
            <div class="info-card">
                <h2>Company Information</h2>
                <p><strong>Company:</strong> ${data.companyName || "Not specified"}</p>
                <p><strong>Industry:</strong> ${data.industry || "Not specified"}</p>
                <p><strong>Skills Needed:</strong> ${data.skillsNeeded || "Not specified"}</p>
                <p><strong>Budget Range:</strong> ${data.budget || "Not specified"}</p>
            </div>
        `;
  }

  createSkilledWorkerDashboard(container, data) {
    let portfolioHtml = "";
    if (data.portfolio) {
      const portfolioFiles = Array.isArray(data.portfolio)
        ? data.portfolio
        : [data.portfolio];
      portfolioHtml = '<div class="portfolio-grid">';
      portfolioFiles.forEach((file) => {
        if (file instanceof File && file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            portfolioHtml += `<div class="portfolio-item"><img src="${e.target.result}" alt="Portfolio"></div>`;
          };
          reader.readAsDataURL(file);
        }
      });
      portfolioHtml += "</div>";
    }

    container.innerHTML = `
            <div class="info-card">
                <h2>Professional Profile</h2>
                <p><strong>Skills:</strong> ${data.skills || "Not specified"}</p>
                <p><strong>Experience:</strong> ${data.yearsExperience || "Not specified"}</p>
                <p><strong>Hourly Rate:</strong> USD ${data.hourlyRate || "Not specified"}/hour</p>
                <p><strong>Work Description:</strong> ${data.workDescription || "Not specified"}</p>
                ${portfolioHtml}
            </div>
        `;
  }

  createIdeaPitcherDashboard(container, data) {
    let documentsHtml = "";
    let videoHtml = "";

    if (data.ideaDocuments) {
      const docs = Array.isArray(data.ideaDocuments)
        ? data.ideaDocuments
        : [data.ideaDocuments];
      documentsHtml = '<div class="documents-list">';
      docs.forEach((doc) => {
        if (doc instanceof File) {
          documentsHtml += `
                        <div class="document-item">
                            <span>📄</span>
                            <span>${doc.name}</span>
                        </div>
                    `;
        }
      });
      documentsHtml += "</div>";
    }

    if (data.ideaVideo && data.ideaVideo instanceof File) {
      videoHtml = `
                <div class="pitch-video">
                    <h3>Pitch Video</h3>
                    <video controls>
                        <source src="${URL.createObjectURL(data.ideaVideo)}" type="${
                          data.ideaVideo.type
                        }">
                        Your browser does not support the video tag.
                    </video>
                </div>
            `;
    }

    container.innerHTML = `
            <div class="info-card">
                <h2>Idea Details</h2>
                <p><strong>Title:</strong> ${data.ideaTitle || "Not specified"}</p>
                <p><strong>Description:</strong> ${data.ideaDescription || "Not specified"}</p>
                <p><strong>Target Market:</strong> ${data.targetMarket || "Not specified"}</p>
                <p><strong>Funding Needed:</strong> USD ${data.fundingNeeded || "Not specified"}</p>
                ${documentsHtml}
                ${videoHtml}
            </div>
        `;
  }

  formatUserType(type) {
    const typeMap = {
      investor: "Investor",
      hirer: "Hirer of Skills",
      "skilled-worker": "Skilled Worker",
      "idea-pitcher": "Idea Pitcher",
    };
    return typeMap[type] || type;
  }

  saveData() {
    // Convert File objects to base64 for storage
    const dataToSave = { ...this.userData };
    localStorage.setItem(
      "userProfileData",
      JSON.stringify(dataToSave, (key, value) => {
        if (value instanceof File) {
          return { name: value.name, size: value.size, type: value.type };
        }
        return value;
      })
    );
  }

  loadSavedData() {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const profileData = localStorage.getItem("userProfileData");

    if (token && user && profileData) {
      this.userData = JSON.parse(profileData);
      this.showDashboard();
    }
  }

  // Logout function
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userProfileData");
    localStorage.removeItem("profileImage");

    // Redirect to sign-in page
    window.location.href = "sign-in.html";
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  new UserProfileManager();
});

// Profile image handling functions
function saveProfileImage(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    localStorage.setItem("profileImage", e.target.result);
    const profileImg = document.getElementById("dashProfileImage");
    if (profileImg) {
      profileImg.src = e.target.result;
      profileImg.style.display = "block";
    }
  };
  reader.readAsDataURL(file);
}

// On page load, restore the image
window.addEventListener("load", function () {
  const savedImage = localStorage.getItem("profileImage");
  const profileImg = document.getElementById("dashProfileImage");

  if (savedImage && profileImg) {
    profileImg.src = savedImage;
    profileImg.style.display = "block";
  } else if (profileImg) {
    profileImg.style.display = "none";
    // Or set a default placeholder
    // profileImg.src = 'path/to/default-avatar.png';
  }
});

// Add logout button functionality
document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      const userManager = new UserProfileManager();
      userManager.logout();
    });
  }
});

// Add CSS for animations
const style = document.createElement("style");
style.textContent = `
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.message-alert {
    transition: all 0.3s ease;
}

button[type="submit"]:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.info-card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 20px;
    margin: 16px 0;
}

.portfolio-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
    margin-top: 10px;
}

.portfolio-item img {
    width: 100%;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
}
`;
document.head.appendChild(style);
