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
    this.checkAuthStatus(); // Check auth status on every page load
    this.loadSavedData(); // Load data only if authenticated
    this.initializeConsultationScheduling();
  }

  bindEvents() {
    const userTypeSelect = document.getElementById("userType");
    const form = document.getElementById("userForm");
    const editButton = document.getElementById("editProfile");
    const logoutBtn = document.getElementById("logoutBtn"); // Get the logout button

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

    logoutBtn?.addEventListener("click", () => { // Attach logout event listener
      this.logout();
    });

    // File input handlers
    this.setupFileHandlers();
    // Setup consultation handlers
    this.setupConsultationHandlers();
  }

  setupFileHandlers() {
    const profileImageInput = document.getElementById("profileImage");
    profileImageInput?.addEventListener("change", (e) => {
      this.handleImagePreview(e, "profilePreview", false);
    });

    const portfolioInput = document.getElementById("portfolio");
    portfolioInput?.addEventListener("change", (e) => {
      this.handleImagePreview(e, "portfolioPreview", true);
    });

    const documentsInput = document.getElementById("ideaDocuments");
    documentsInput?.addEventListener("change", (e) => {
      this.handleDocumentPreview(e, "documentsPreview");
    });

    const videoInput = document.getElementById("ideaVideo");
    videoInput?.addEventListener("change", (e) => {
      this.handleVideoPreview(e, "videoPreview");
    });
  }

  setupConsultationHandlers() {
    // Custom consultation rate handler
    const consultationRateSelect = document.getElementById("consultationRate");
    consultationRateSelect?.addEventListener("change", function () {
      const customRateGroup = document.getElementById("customRateGroup");
      if (customRateGroup) {
        if (this.value === "custom") {
          customRateGroup.style.display = "block";
        } else {
          customRateGroup.style.display = "none";
        }
      }
    });

    // Investment interest "others" handler
    const investmentInterestsSelect = document.getElementById(
      "investmentInterests"
    );
    investmentInterestsSelect?.addEventListener("change", function () {
      const customInterestGroup = document.getElementById(
        "customInterestGroup"
      );
      if (customInterestGroup) {
        if (this.value === "others") {
          customInterestGroup.style.display = "block";
        } else {
          customInterestGroup.style.display = "none";
        }
      }
    });

    // Schedule consultation button (in dashboard.html)
    const scheduleBtn = document.getElementById("scheduleConsultation");
    scheduleBtn?.addEventListener("click", () => {
      this.openConsultationModal();
    });

    // Request consultation button (in the modal)
    const requestBtn = document.getElementById("requestConsultation");
    requestBtn?.addEventListener("click", () => {
      this.handleConsultationRequest();
    });

    // Modal close handlers (only consultation modal remains)
    const closeConsultationModal = document.getElementById(
      "closeConsultationModal"
    );

    closeConsultationModal?.addEventListener("click", () => {
      this.closeConsultationModal();
    });

    // Close modals when clicking outside (only consultation modal remains)
    window.addEventListener("click", (event) => {
      const consultationModal = document.getElementById("consultationModal");
      
      if (event.target === consultationModal) {
        this.closeConsultationModal();
      }
    });
  }

  initializeConsultationScheduling() {
    const consultationDateInput = document.getElementById("consultationDate");
    if (consultationDateInput) {
      const today = new Date().toISOString().split("T")[0];
      consultationDateInput.min = today;
    }
  }

  openConsultationModal() {
    const consultationModal = document.getElementById("consultationModal");
    if (consultationModal) {
      consultationModal.style.display = "block";
    }
  }

  closeConsultationModal() {
    const consultationModal = document.getElementById("consultationModal");
    if (consultationModal) {
      consultationModal.style.display = "none";
    }
  }

  handleConsultationRequest() {
    const date = document.getElementById("consultationDate")?.value;
    const time = document.getElementById("consultationTime")?.value;
    const duration = document.getElementById("consultationDuration")?.value;
    const topic = document.getElementById("consultationTopic")?.value;
    const customRateInput = document.getElementById("customConsultationRate");
    const consultationRateSelect = document.getElementById("consultationRate");

    if (!date || !time) {
      this.showMessage(
        "⚠️ Please select both date and time for the consultation.",
        "error"
      );
      return;
    }

    let consultationRate = consultationRateSelect?.value;
    if (consultationRate === "custom" && customRateInput?.value) {
      consultationRate = customRateInput.value;
    }

    const consultationData = {
      date,
      time,
      duration: parseInt(duration || "30"),
      topic: topic || "General discussion",
      rate: consultationRate,
      requestedAt: new Date().toISOString(),
      status: "pending",
    };

    const existingRequests = JSON.parse(
      localStorage.getItem("consultationRequests") || "[]"
    );
    existingRequests.push(consultationData);
    localStorage.setItem(
      "consultationRequests",
      JSON.stringify(existingRequests)
    );

    this.sendConsultationRequest(consultationData);

    this.showMessage(
      `🎉 Consultation requested for ${date} at ${time} (${duration} minutes)\nTopic: ${consultationData.topic}`,
      "success"
    );

    this.closeConsultationModal();

    // Clear form
    if (document.getElementById("consultationDate"))
      document.getElementById("consultationDate").value = "";
    if (document.getElementById("consultationTime"))
      document.getElementById("consultationTime").value = "";
    if (document.getElementById("consultationTopic"))
      document.getElementById("consultationTopic").value = "";
    if (consultationRateSelect) consultationRateSelect.value = "";
    if (customRateInput) customRateInput.value = "";
    const customRateGroup = document.getElementById("customRateGroup");
    if (customRateGroup) customRateGroup.style.display = "none";
  }

  async sendConsultationRequest(consultationData) {
    try {
      console.log("Sending consultation request:", consultationData);

      /*
      const response = await fetch(`${this.apiBaseUrl}/api/consultations/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(consultationData)
      });

      if (response.ok) {
        console.log('Consultation request sent successfully');
      } else {
        const errorData = await response.json();
        console.error('Failed to send consultation request:', errorData.message);
        this.showMessage(`Failed to send consultation request: ${errorData.message}`, 'error');
      }
      */
    } catch (error) {
      console.error("Error sending consultation request:", error);
      this.showMessage(
        "Error sending consultation request. Please try again.",
        "error"
      );
    }
  }

  showRelevantSection(userType) {
    const sections = document.querySelectorAll(".dynamic-section");
    sections.forEach((section) => {
      section.style.display = "none";
    });

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
          img.style.margin = "5px";
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
      fileItem.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        background: #f9fafb;
        border-radius: 6px;
        margin: 4px 0;
      `;
      fileItem.innerHTML = `
        <span>📄</span>
        <span>${file.name}</span>
        <span style="color: #6b7280;">(${this.formatFileSize(file.size)})</span>
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

    // Convert FormData to object, handling multiple values
    for (let [key, value] of formData.entries()) {
      if (this.userData[key]) {
        // Handle multiple files or checkboxes
        if (Array.isArray(this.userData[key])) {
          this.userData[key].push(value);
        } else {
          this.userData[key] = [this.userData[key], value];
        }
      } else {
        this.userData[key] = value;
      }
    }

    // Handle checkboxes specifically for consultation days and communication methods
    this.userData.consultationDays = formData.getAll("consultationDays");
    this.userData.communicationMethods = formData.getAll(
      "communicationMethods"
    );

    // Handle custom consultation rate
    if (
      this.userData.consultationRate === "custom" &&
      this.userData.customConsultationRate
    ) {
      this.userData.consultationRate = this.userData.customConsultationRate;
    } else if (
      this.userData.consultationRate === "custom" &&
      !this.userData.customConsultationRate
    ) {
      this.showMessage("⚠️ Please specify a custom consultation rate", "error");
      this.resetButton(submitBtn, originalBtnText);
      return;
    }
    delete this.userData.customConsultationRate; // Remove the custom field if not "custom"

    // Handle custom investment interest
    if (
      this.userData.investmentInterests === "others" &&
      this.userData.customInvestmentInterest
    ) {
      this.userData.investmentInterests =
        this.userData.customInvestmentInterest;
    } else if (
      this.userData.investmentInterests === "others" &&
      !this.userData.customInvestmentInterest
    ) {
      this.showMessage("⚠️ Please specify your investment interest", "error");
      this.resetButton(submitBtn, originalBtnText);
      return;
    }
    delete this.userData.customInvestmentInterest; // Remove the custom field if not "others"

    // Prepare data for backend API (only basic auth fields for now)
    const backendData = {
      name: `${this.userData.firstName || ""} ${this.userData.lastName || ""}`.trim(),
      email: this.userData.email,
      password: this.userData.password,
    };

    // Enhanced validation
    if (!this.userData.firstName || !this.userData.lastName) {
      this.showMessage("⚠️ Please enter both first and last name", "error");
      this.resetButton(submitBtn, originalBtnText);
      return;
    }
    if (!this.userData.userType) {
      // Ensure userType is selected
      this.showMessage("⚠️ Please select your role", "error");
      this.resetButton(submitBtn, originalBtnText);
      return;
    }

    if (!backendData.email || !backendData.password) {
      this.showMessage("⚠️ Please fill in all required fields", "error");
      this.resetButton(submitBtn, originalBtnText);
      return;
    }

    if (backendData.password.length < 6) {
      this.showMessage(
        "⚠️ Password must be at least 6 characters long",
        "error"
      );
      this.resetButton(submitBtn, originalBtnText);
      return;
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(backendData.email)) {
      this.showMessage("⚠️ Please enter a valid email address", "error");
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
          "🎉 Registration successful! Welcome to your dashboard.",
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
        "❌ Network error. Please check your connection and try again.",
        "error"
      );
      this.resetButton(submitBtn, originalBtnText);
    }
  }

  showMessage(message, type) {
    const existingMessage = document.querySelector(".message-alert");
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageDiv = document.createElement("div");
    messageDiv.className = `message-alert ${type}`;
    messageDiv.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span>${type === "success" ? "✅" : "⚠️"}</span>
        <span>${message.replace(/^[⚠️❌🎉✅]\s*/, "")}</span>
      </div>
    `;

    messageDiv.style.cssText = `
      padding: 16px 20px;
      margin: 20px 0;
      border-radius: 12px;
      font-weight: 500;
      text-align: left;
      position: relative;
      animation: slideIn 0.3s ease-out;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-left: 4px solid;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ${
        type === "success"
          ? `
            background-color: #ecfdf5; 
            color: #065f46; 
            border-color: #10b981;
            border: 1px solid #a7f3d0;
          `
          : `
            background-color: #fef2f2; 
            color: #991b1b; 
            border-color: #ef4444;
            border: 1px solid #fca5a5;
          `
      }
    `;

    // Determine where to insert the message: before userForm for registration, or at the top of the body for dashboard
    let targetElement = document.getElementById("userForm"); // For sign-up/edit profile forms
    if (!targetElement) { // If not on a form page, try to find a suitable place on the dashboard or body
      targetElement = document.querySelector(".dashboard-container") || document.body;
      if (targetElement.id === "dashboard") { // If dashboard container exists, insert at its beginning
          targetElement.insertBefore(messageDiv, targetElement.firstChild);
      } else { // Fallback to inserting at body beginning for general pages
          document.body.insertBefore(messageDiv, document.body.firstChild);
      }
    } else { // Insert before the form on registration/edit pages
      targetElement.parentNode.insertBefore(messageDiv, targetElement);
    }


    const removeTime = type === "success" ? 3000 : 7000;
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.style.opacity = "0";
        messageDiv.style.transform = "translateY(-10px)";
        setTimeout(() => messageDiv.remove(), 300);
      }
    }, removeTime);

    messageDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
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

    this.populateConsultationInfo(data);

    // Profile image
    const dashProfileImage = document.getElementById("dashProfileImage");
    if (
      data.profileImage &&
      data.profileImage instanceof File &&
      dashProfileImage
    ) {
      const reader = new FileReader();
      reader.onload = (e) => {
        dashProfileImage.src = e.target.result;
        dashProfileImage.style.display = "block";
      };
      reader.readAsDataURL(data.profileImage);
    } else if (dashProfileImage) {
      // Hide if no image
      dashProfileImage.style.display = "none";
    }

    this.populateDynamicContent(data);
  }

  populateConsultationInfo(data) {
    const timezoneElement = document.getElementById("dashTimezone");
    if (timezoneElement) {
      timezoneElement.textContent = data.timezone || "Not specified";
    }

    const daysElement = document.getElementById("dashConsultationDays");
    if (daysElement) {
      const days = Array.isArray(data.consultationDays)
        ? data.consultationDays.join(", ")
        : "Not specified";
      daysElement.textContent = days;
    }

    const hoursElement = document.getElementById("dashConsultationHours");
    if (hoursElement) {
      const startTime = data.consultationStartTime || "";
      const endTime = data.consultationEndTime || "";
      hoursElement.textContent =
        startTime && endTime ? `${startTime} - ${endTime}` : "Not specified";
    }

    const methodsElement = document.getElementById("dashCommunicationMethods");
    if (methodsElement) {
      const methods = Array.isArray(data.communicationMethods)
        ? data.communicationMethods.join(", ")
        : "Not specified";
      methodsElement.textContent = methods;
    }

    const rateElement = document.getElementById("dashConsultationRate");
    if (rateElement) {
      let rate = "Not specified";
      if (data.consultationRate === "free") {
        rate = "Free";
      } else if (data.consultationRate) {
        rate = `$${data.consultationRate}/hour`; // Now directly use the value
      }
      rateElement.textContent = rate;
    }

    const notesElement = document.getElementById("dashConsultationNotes");
    if (notesElement) {
      if (data.consultationNotes) {
        notesElement.innerHTML = `<p><strong>Notes:</strong> ${data.consultationNotes}</p>`;
      } else {
        notesElement.innerHTML = "";
      }
    }
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
        <p><strong>Investment Focus:</strong> ${data.investmentDescription || "Not specified"}</p>
        <p><strong>Experience:</strong> ${data.experience || "Not specified"}</p>
        <p><strong>Preferred Stage:</strong> ${data.investmentStage || "Not specified"}</p>
        <p><strong>Risk Tolerance:</strong> ${data.riskTolerance || "Not specified"}</p>
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
        <p><strong>Hourly Rate:</strong> $${data.hourlyRate || "Not specified"}/hour</p>
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
        <p><strong>Funding Needed:</strong> $${data.fundingNeeded || "Not specified"}</p>
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
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const profileData = localStorage.getItem("userProfileData");

    if (token && user && profileData) {
      this.userData = JSON.parse(profileData);
      this.showDashboard();
    }
  }

  // NEW: Check authentication status on every page load
  checkAuthStatus() {
    const token = localStorage.getItem('token');
    // If not logged in AND not on sign-in or sign-up page, redirect to sign-in
    if (!token && !window.location.pathname.includes('sign-in.html') && !window.location.pathname.includes('sign-up.html')) {
      this.showMessage("You need to be signed in to access this page.", "error");
      setTimeout(() => {
        window.location.href = "sign-in.html";
      }, 1500); // Give time for message to display
    } else if (token && (window.location.pathname.includes('sign-in.html') || window.location.pathname.includes('sign-up.html'))) {
        // If already logged in and on sign-in/sign-up page, redirect to dashboard
        this.showMessage("You are already logged in. Redirecting to dashboard.", "success");
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1500);
    }
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userProfileData");
    localStorage.removeItem("profileImage");
    localStorage.removeItem("consultationRequests");
    
    // Clear in-memory data
    this.userData = {};

    this.showMessage("You have been logged out successfully.", "success");
    setTimeout(() => {
      window.location.href = "sign-in.html";
    }, 1000); // Redirect after a short delay
  }
}

// Global helper functions (showMessage, resetButton, saveProfileImage, etc.)
// These functions are outside the class but are called by class methods.
// Ensure they are defined before the UserProfileManager is initialized.

function showMessage(message, type) {
  const existingMessage = document.querySelector(".message-alert");
  if (existingMessage) {
    existingMessage.remove();
  }

  const messageDiv = document.createElement("div");
  messageDiv.className = `message-alert ${type}`;
  messageDiv.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span>${type === "success" ? "✅" : "⚠️"}</span>
      <span>${message.replace(/^[⚠️❌🎉✅]\s*/, "")}</span>
    </div>
  `;

  messageDiv.style.cssText = `
    padding: 16px 20px;
    margin: 20px 0;
    border-radius: 12px;
    font-weight: 500;
    text-align: left;
    position: relative;
    animation: slideIn 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-left: 4px solid;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ${
      type === "success"
        ? `
          background-color: #ecfdf5; 
          color: #065f46; 
          border-color: #10b981;
          border: 1px solid #a7f3d0;
        `
        : `
          background-color: #fef2f2; 
          color: #991b1b; 
          border-color: #ef4444;
          border: 1px solid #fca5a5;
        `
    }
  `;

  // Determine where to insert the message: before userForm for registration, or at the top of the body for dashboard
  let targetElement = document.getElementById("userForm"); // For sign-up/edit profile forms
  if (!targetElement) { // If not on a form page, try to find a suitable place on the dashboard or body
    targetElement = document.querySelector(".dashboard-container") || document.body;
    if (targetElement.id === "dashboard") { // If dashboard container exists, insert at its beginning
        targetElement.insertBefore(messageDiv, targetElement.firstChild);
    } else { // Fallback to inserting at body beginning for general pages
        document.body.insertBefore(messageDiv, document.body.firstChild);
    }
  } else { // Insert before the form on registration/edit pages
    targetElement.parentNode.insertBefore(messageDiv, targetElement);
  }


  const removeTime = type === "success" ? 3000 : 7000;
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.style.opacity = "0";
      messageDiv.style.transform = "translateY(-10px)";
      setTimeout(() => messageDiv.remove(), 300);
    }
  }, removeTime);

  messageDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function resetButton(button, originalText) {
  button.textContent = originalText;
  button.disabled = false;
}

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

window.addEventListener("load", function () {
  const savedImage = localStorage.getItem("profileImage");
  const profileImg = document.getElementById("dashProfileImage");

  if (savedImage && profileImg) {
    profileImg.src = savedImage;
    profileImg.style.display = "block";
  } else if (profileImg) {
    profileImg.style.display = "none";
  }
});

// Add CSS for animations and styling (consider moving to a dedicated CSS file)
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

.message-alert:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
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

/* Modal Styles - Only consultation modal related styles remain */
.modal {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: #fefefe;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
    animation: fadeIn 0.3s ease-out;
}

.modal-header {
    padding: 20px;
    background-color: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
    color: #333;
}

.close {
    color: #aaa;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
    transition: color 0.2s;
}

.close:hover {
    color: #000;
}

/* Removed: Chat Specific Styles */

.send-btn, .schedule-btn, .edit-btn, .submit-btn, .logout-btn { /* Added .logout-btn */
    padding: 10px 20px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s ease-in-out;
}

.send-btn:hover, .schedule-btn:hover, .edit-btn:hover, .submit-btn:hover, .logout-btn:hover { /* Added .logout-btn */
    background-color: #2563eb;
}

/* Consultation Form Styles */
.consultation-form {
    padding: 20px;
    background-color: #fff;
}

.consultation-form .form-group {
    margin-bottom: 15px;
}

.consultation-form label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: #333;
}

.consultation-form input, 
.consultation-form select, 
.consultation-form textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    box-sizing: border-box;
}

/* Checkbox Group for Days/Methods */
.checkbox-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 8px;
    margin-top: 8px;
}

.checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    transition: background-color 0.2s, border-color 0.2s;
    color: #4a5568;
}

.checkbox-label:hover {
    background-color: #f3f4f6;
    border-color: #a7f3d0;
}

.checkbox-label input[type="checkbox"] {
    margin-right: 8px;
    accent-color: #3b82f6;
}

/* Animation for modals */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Form validation feedback styles */
.form-group input.error,
.form-group select.error,
.form-group textarea.error {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-group input.success,
.form-group select.success,
.form-group textarea.success {
    border-color: #10b981 !important;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* General form input focus */
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Styles for the main container */
.container {
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Section styling */
.section {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
}

.section h2, .section h3 {
    color: #333;
    margin-top: 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 10px;
}

/* Form row for side-by-side inputs */
.form-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 15px;
}
@media (min-width: 600px) {
    .form-row {
        grid-template-columns: 1fr 1fr;
    }
}

/* Image preview styles */
.image-preview, .file-preview, .video-preview {
    margin-top: 10px;
    border: 1px dashed #d1d5db;
    padding: 10px;
    border-radius: 8px;
    min-height: 50px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    align-items: center;
    color: #6b7280;
}

.image-preview img {
    max-width: 100px;
    max-height: 100px;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid #e5e7eb;
}

.image-preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
    margin-top: 10px;
}

/* Dashboard specific styles */
.dashboard-container {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    padding: 30px;
}

.dashboard-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
    gap: 20px;
}

.profile-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.profile-img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #3b82f6;
    margin-bottom: 15px;
}

.profile-info h1 {
    margin: 0 0 5px 0;
    color: #333;
    font-size: 2em;
}

.profile-info p {
    margin: 0;
    color: #6b7280;
}

.user-type {
    font-weight: 600;
    color: #2563eb;
}

.header-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
}

.dashboard-content .info-card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
}

.dashboard-content .info-card h2 {
    color: #333;
    margin-top: 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 10px;
}

.dashboard-content .info-card p {
    margin: 8px 0;
    color: #4a5568;
}

.dashboard-content .info-card strong {
    color: #333;
}

.documents-list, .pitch-video {
    margin-top: 15px;
    padding: 15px;
    background: #f0f4f8;
    border-radius: 8px;
    border: 1px solid #e0e7ee;
}

.document-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    color: #4a5568;
}
.document-item span:first-child {
    font-size: 1.2em;
}
.document-item span:last-child {
    font-size: 0.9em;
    color: #6b7280;
}

.pitch-video video {
    width: 100%;
    max-width: 400px;
    height: auto;
    border-radius: 8px;
    margin-top: 10px;
}

/* Header styles */
.header {
    background-color: #fff;
    padding: 15px 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    margin-bottom: 20px;
}

.header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.logo {
    height: 40px;
}

/* Link styles */
.login-link, .signup-link {
    text-align: center;
    margin-top: 20px;
    color: #6b7280;
}

.login-link a, .signup-link a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 600;
}

.login-link a:hover, .signup-link a:hover {
    text-decoration: underline;
}
`;
document.head.appendChild(style);

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  new UserProfileManager();
});
