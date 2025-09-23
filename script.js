class UserProfileManager {
  constructor() {
    this.userData = {};
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

    userTypeSelect.addEventListener("change", (e) => {
      this.showRelevantSection(e.target.value);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    editButton.addEventListener("click", () => {
      this.showForm();
    });

    // File input handlers
    this.setupFileHandlers();
  }

  setupFileHandlers() {
    // Profile image handler
    const profileImageInput = document.getElementById("profileImage");
    profileImageInput.addEventListener("change", (e) => {
      this.handleImagePreview(e, "profilePreview", false);
    });

    // Portfolio images handler
    const portfolioInput = document.getElementById("portfolio");
    portfolioInput.addEventListener("change", (e) => {
      this.handleImagePreview(e, "portfolioPreview", true);
    });

    // Documents handler
    const documentsInput = document.getElementById("ideaDocuments");
    documentsInput.addEventListener("change", (e) => {
      this.handleDocumentPreview(e, "documentsPreview");
    });

    // Video handler
    const videoInput = document.getElementById("ideaVideo");
    videoInput.addEventListener("change", (e) => {
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
      document.getElementById(sectionId).style.display = "block";
    }
  }

  handleImagePreview(event, previewId, multiple = false) {
    const files = event.target.files;
    const preview = document.getElementById(previewId);

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

  handleFormSubmit() {
    const formData = new FormData(document.getElementById("userForm"));
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

    // Save to localStorage
    this.saveData();

    // Show dashboard
    this.showDashboard();
  }

  showDashboard() {
    document.getElementById("registrationForm").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    this.populateDashboard();
  }

  showForm() {
    document.getElementById("registrationForm").style.display = "block";
    document.getElementById("dashboard").style.display = "none";
  }

  populateDashboard() {
    const data = this.userData;

    // Basic info
    document.getElementById("dashName").textContent =
      `${data.firstName || ""} ${data.lastName || ""}`;
    document.getElementById("dashUserType").textContent = this.formatUserType(
      data.userType
    );
    document.getElementById("dashLocation").textContent = data.location || "";
    document.getElementById("dashEmail").textContent = data.email || "";
    document.getElementById("dashPhone").textContent = data.phone || "";
    document.getElementById("dashBio").textContent = data.bio || "";

    // Profile image
    if (data.profileImage && data.profileImage instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById("dashProfileImage").src = e.target.result;
      };
      reader.readAsDataURL(data.profileImage);
    }

    // Dynamic content based on user type
    this.populateDynamicContent(data);
  }

  populateDynamicContent(data) {
    const container = document.getElementById("dashboardDynamicContent");
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
    const savedData = localStorage.getItem("userProfileData");
    if (savedData) {
      this.userData = JSON.parse(savedData);
      this.showDashboard();
    }
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  new UserProfileManager();
});

// to ensure saving the image data to localStorage
function saveProfileImage(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    localStorage.setItem("profileImage", e.target.result);
    document.getElementById("dashProfileImage").src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// On page load, restore the image
window.addEventListener("load", function () {
  const savedImage = localStorage.getItem("profileImage");
  if (savedImage) {
    document.getElementById("dashProfileImage").src = savedImage;
  }
});

// Set a default image or hide the img element
const profileImg = document.getElementById("dashProfileImage");
if (!profileImg.src || profileImg.src === "") {
  profileImg.style.display = "none";
  // Or set a default placeholder
  // profileImg.src = 'path/to/default-avatar.png';
}
