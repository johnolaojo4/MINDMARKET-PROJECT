let currentUserType = "";
let profileData = {};

// Debounce function for auto-save
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Create debounced auto-save
const debouncedAutoSave = debounce(() => {
  if (currentUserType) {
    autoSaveDraft();
  }
}, 2000);

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function initializeApp() {
  // Check if user has existing profile data
  const savedProfile = localStorage.getItem("mindmarketProfile");
  if (savedProfile) {
    try {
      profileData = JSON.parse(savedProfile);
      if (profileData.userType) {
        displayDashboard();
      }
    } catch (error) {
      console.error("Error loading saved profile:", error);
      localStorage.removeItem("mindmarketProfile");
    }
  }

  // Initialize file upload handlers
  initializeFileUploads();

  // Initialize form validation
  initializeFormValidation();

  // Initialize keyboard shortcuts
  initializeKeyboardShortcuts();
}

function selectUserType(type, event) { // <-- Added 'event' parameter
  currentUserType = type;


  // Hide all forms
  document.querySelectorAll(".form-container").forEach((form) => {
    form.classList.remove("active");
  });

  // Hide user type selection with fade out
  const userTypeSelection = document.getElementById("userTypeSelection");
  userTypeSelection.style.opacity = "0";

  setTimeout(() => {
    userTypeSelection.style.display = "none";

    // Show selected form with animation - FIXED MAPPING
    let formId;
    switch (type) {
      case "investor":
        formId = "investorForm";
        break;
      case "idea-pitcher":
        formId = "ideaPitcherForm"; // Capital P
        break;
      case "skilled-worker":
        formId = "skilledWorkerForm"; // Capital W
        break;
      case "hirer":
        formId = "hirerForm";
        break;
    }

    const targetForm = document.getElementById(formId);
    if (targetForm) {
      targetForm.classList.add("active");
      targetForm.scrollIntoView({ behavior: "smooth", block: "start" });

      // Load any draft data
      loadDraftData(type);
    }
  }, 300);

  // Update button styles
  document.querySelectorAll(".user-type-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  // Show notification
  showNotification(
    "success",
    "Profile type selected! Please fill out your information.",
    "fas fa-check-circle"
  );
}

function handleProfilePicUpload(event) {
  const file = event.target.files[0];
  if (file) {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification(
        "error",
        "File size must be less than 5MB",
        "fas fa-exclamation-triangle"
      );
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showNotification(
        "error",
        "Please select a valid image file",
        "fas fa-exclamation-triangle"
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const profilePicDisplay = document.getElementById("profilePicDisplay");
      profilePicDisplay.innerHTML = `<img src="${e.target.result}" alt="Profile Picture" class="profile-pic">`;

      // Store image data
      profileData.profilePicture = e.target.result;
      
      // Save to localStorage immediately
      if (profileData.userType) {
        localStorage.setItem("mindmarketProfile", JSON.stringify(profileData));
      }

      showNotification(
        "success",
        "Profile picture uploaded successfully!",
        "fas fa-check-circle"
      );
    };

    reader.onerror = function () {
      showNotification(
        "error",
        "Error uploading image. Please try again.",
        "fas fa-exclamation-triangle"
      );
    };

    reader.readAsDataURL(file);
  }
}

function createProfile(userType) {
  // Show loading state
  const createBtn = document.querySelector(
    ".form-container.active .create-profile-btn"
  );

  const originalContent = createBtn.innerHTML;
  createBtn.innerHTML = '<div class="loading"></div> Creating Profile...';
  createBtn.disabled = true;

  // Validate form
  if (!validateForm(userType)) {
    createBtn.innerHTML = originalContent;
    createBtn.disabled = false;
    return;
  }

  // Collect form data based on user type
  let formData = {};

  try {
    switch (userType) {
      case "investor":
        formData = collectInvestorData();
        break;
      case "idea-pitcher":
        formData = collectIdeaPitcherData();
        break;
      case "skilled-worker":
        formData = collectSkilledWorkerData();
        break;
      case "hirer":
        formData = collectHirerData();
        break;
    }

    profileData = {
      userType,
      ...formData,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    // Save to localStorage
    localStorage.setItem("mindmarketProfile", JSON.stringify(profileData));

    // Clear draft data
    clearDraftData(userType);

    // Simulate API call delay
    setTimeout(() => {
      createBtn.innerHTML =
        '<i class="fas fa-check success-check"></i> Profile Created!';

      setTimeout(() => {
        displayDashboard();
        showNotification(
          "success",
          "Profile created successfully!",
          "fas fa-check-circle"
        );
      }, 1000);
    }, 1500);
  } catch (error) {
    console.error("Error creating profile:", error);
    createBtn.innerHTML = originalContent;
    createBtn.disabled = false;
    showNotification(
      "error",
      "Error creating profile. Please try again.",
      "fas fa-exclamation-triangle"
    );
  }
}

function collectInvestorData() {
  return {
    profilePicture: profileData.profilePicture || null,
    name: document.getElementById("investorName").value,
    email: document.getElementById("investorEmail").value,
    phone: document.getElementById("investorPhone").value,
    budget: document.getElementById("investorBudget").value,
    investmentAreas: Array.from(
      document.getElementById("investmentAreas").selectedOptions
    ).map((o) => o.value),
    consultationPreference: document.getElementById("consultationPreference")
      .value,
    location: document.getElementById("investorLocation").value,
    bio: document.getElementById("investorBio").value,
  };
}

function collectIdeaPitcherData() {
  return {
    profilePicture: profileData.profilePicture || null,
    name: document.getElementById("pitcherName").value,
    email: document.getElementById("pitcherEmail").value,
    phone: document.getElementById("pitcherPhone").value,
    ideaTitle: document.getElementById("ideaTitle").value,
    ideaCategory: document.getElementById("ideaCategory").value,
    fundingNeeded: document.getElementById("fundingNeeded").value,
    ideaDescription: document.getElementById("ideaDescription").value,
    targetMarket: document.getElementById("targetMarket").value,
    documents: getFileNames("ideaDocuments"),
    video: getFileNames("ideaVideo"),
  };
}

function collectSkilledWorkerData() {
  return {
    profilePicture: profileData.profilePicture || null,
    name: document.getElementById("workerName").value,
    email: document.getElementById("workerEmail").value,
    phone: document.getElementById("workerPhone").value,
    skills: document.getElementById("workerSkills").value,
    experience: document.getElementById("workerExperience").value,
    rate: document.getElementById("workerRate").value,
    location: document.getElementById("workerLocation").value,
    availability: document.getElementById("workerAvailability").value,
    bio: document.getElementById("workerBio").value,
    certifications: document.getElementById("workerCertifications").value,
    website: document.getElementById("workerWebsite").value,
    portfolio: getFileNames("portfolioImages"),
  };
}

function collectHirerData() {
  return {
    profilePicture: profileData.profilePicture || null,
    name: document.getElementById("hirerName").value,
    email: document.getElementById("hirerEmail").value,
    phone: document.getElementById("hirerPhone").value,
    skillsNeeded: Array.from(
      document.getElementById("skillsNeeded").selectedOptions
    ).map((o) => o.value),
    budget: document.getElementById("hirerBudget").value,
    location: document.getElementById("hirerLocation").value,
    projectDuration: document.getElementById("projectDuration").value,
    consultationTime: document.getElementById("consultationTime").value,
    projectDescription: document.getElementById("projectDescription").value,
    urgency: document.getElementById("urgency").value,
  };
}

function getFileNames(inputId) {
  const fileInput = document.getElementById(inputId);
  if (fileInput && fileInput.files.length > 0) {
    return Array.from(fileInput.files).map((file) => file.name);
  }
  return [];
}

function validateForm(userType) {
  let isValid = true;
  const requiredFields = getRequiredFields(userType);

  // Clear previous errors
  document
    .querySelectorAll(".error")
    .forEach((el) => el.classList.remove("error"));
  document.querySelectorAll(".error-message").forEach((el) => el.remove());

  requiredFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field && (!field.value || field.value.trim() === "")) {
      showFieldError(field, "This field is required");
      isValid = false;
    } else if (field && field.type === "email" && !isValidEmail(field.value)) {
      showFieldError(field, "Please enter a valid email address");
      isValid = false;
    } else if (field && field.type === "tel" && !isValidPhone(field.value)) {
      showFieldError(field, "Please enter a valid phone number");
      isValid = false;
    } else if (
      field &&
      field.type === "url" &&
      field.value &&
      !isValidURL(field.value)
    ) {
      showFieldError(field, "Please enter a valid URL");
      isValid = false;
    }
  });

  if (!isValid) {
    showNotification(
      "error",
      "Please correct the errors in the form",
      "fas fa-exclamation-triangle"
    );
    // Scroll to first error
    const firstError = document.querySelector(".error");
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return isValid;
}

function getRequiredFields(userType) {
  const commonFields = ["Name", "Email", "Phone"];
  const fieldMaps = {
    investor: commonFields
      .map((f) => "investor" + f)
      .concat(["investorBudget", "investorLocation"]),
    "idea-pitcher": commonFields
      .map((f) => "pitcher" + f)
      .concat(["ideaTitle", "ideaCategory", "fundingNeeded"]),
    "skilled-worker": commonFields
      .map((f) => "worker" + f)
      .concat(["workerSkills", "workerExperience", "workerRate"]),
    hirer: commonFields
      .map((f) => "hirer" + f)
      .concat(["hirerBudget", "projectDescription"]),
  };
  return fieldMaps[userType] || [];
}

function showFieldError(field, message) {
  field.classList.add("error");
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
  field.parentNode.appendChild(errorDiv);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  // Remove all spaces, dashes, and parentheses
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

  // Allow phone numbers with or without + sign
  // Must be 7-15 digits (international standard)
  const phoneRegex = /^[\+]?[\d]{7,15}$/;

  return phoneRegex.test(cleanPhone);
}

function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function displayDashboard() {
  // Hide forms and user selection
  document.querySelectorAll(".form-container").forEach((form) => {
    form.style.display = "none";
  });
  document.getElementById("userTypeSelection").style.display = "none";

  // Update welcome message
  document.getElementById("welcomeMessage").textContent =
    `Welcome back, ${profileData.name}!`;

  // Update profile picture
  updateProfilePicture();

  // Show dashboard content
  document.getElementById("dashboardContent").classList.add("active");

  // Populate profile information
  displayProfileInfo();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateProfilePicture() {
  const profilePicDisplay = document.getElementById("profilePicDisplay");
  const profileIcon = document.getElementById("profileIcon");
  const profileInitials = document.getElementById("profileInitials");

  if (profileData.profilePicture) {
    profilePicDisplay.innerHTML = `<img src="${profileData.profilePicture}" alt="Profile Picture" class="profile-pic">`;
  } else if (profileData.name) {
    const initials = profileData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    profileIcon.style.display = "none";
    profileInitials.textContent = initials;
    profileInitials.classList.remove("hidden");
  }
}

function displayProfileInfo() {
  const profileInfo = document.getElementById("profileInfo");
  const profileTitle = document.getElementById("profileTitle");

  const userTypeNames = {
    investor: "Investor",
    "idea-pitcher": "Idea Pitcher",
    "skilled-worker": "Skilled Worker",
    hirer: "Hirer",
  };

  const userTypeIcons = {
    investor: "fas fa-chart-line",
    "idea-pitcher": "fas fa-lightbulb",
    "skilled-worker": "fas fa-tools",
    hirer: "fas fa-handshake",
  };

  profileTitle.innerHTML = `<i class="${userTypeIcons[profileData.userType]}"></i> ${userTypeNames[profileData.userType]} Profile`;

  let infoHTML = "";
  const iconMap = getIconMap();

  Object.entries(profileData).forEach(([key, value]) => {
    if (shouldDisplayField(key, value)) {
      const label = formatLabel(key);
      const displayValue = formatValue(key, value);
      const icon = iconMap[key] || "fas fa-info-circle";

      infoHTML += `
                <div class="info-item">
                    <div class="info-label">
                        <i class="${icon}"></i>
                        ${label}
                    </div>
                    <div class="info-value">${displayValue}</div>
                </div>
            `;
    }
  });

  // Add explore button based on user type
  const exploreSection = getExploreButton(profileData.userType);
  infoHTML += exploreSection;

  profileInfo.innerHTML = infoHTML;
}

function getExploreButton(userType) {
  const exploreButtons = {
    investor: {
      text: "Explore Ideas",
      icon: "fas fa-lightbulb",
      link: "explore-idea.html", // Updated to match your file
    },
    "idea-pitcher": {
      text: "Explore Investors",
      icon: "fas fa-chart-line",
      link: "explore-investors.html", // You need to create this file
    },
    "skilled-worker": {
      text: "Explore Clients",
      icon: "fas fa-handshake",
      link: "explore-clients.html", // You need to create this file
    },
    hirer: {
      text: "Explore Skills",
      icon: "fas fa-tools",
      link: "explore-skill.html", // Updated to match your file
    },
  };

  const button = exploreButtons[userType];
  if (!button) return "";

  return `
    <div class="info-item explore-section">
      <a href="${button.link}" class="explore-btn">
        <i class="${button.icon}"></i>
        ${button.text}
      </a>
    </div>
  `;
}

function shouldDisplayField(key, value) {
  const excludedFields = [
    "userType",
    "profilePicture",
    "createdAt",
    "lastUpdated",
  ];
  return !excludedFields.includes(key) && value && value !== "";
}

function formatLabel(key) {
  const labelMap = {
    investmentAreas: "Investment Areas",
    consultationPreference: "Consultation Preference",
    ideaTitle: "Idea Title",
    ideaCategory: "Idea Category",
    fundingNeeded: "Funding Needed",
    ideaDescription: "Idea Description",
    targetMarket: "Target Market",
    skillsNeeded: "Skills Needed",
    projectDuration: "Project Duration",
    consultationTime: "Consultation Time",
    projectDescription: "Project Description",
  };

  return (
    labelMap[key] ||
    key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")
  );
}

function formatValue(key, value) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (key === "budget" || key === "fundingNeeded" || key === "rate") {
    return `USD ${parseInt(value).toLocaleString()}`;
  }

  if (key === "consultationTime") {
    return new Date(value).toLocaleString();
  }

  if (key === "website" && value) {
    return `<a href="${value}" target="_blank" style="color: rgba(255,255,255,0.9); text-decoration: underline;">${value}</a>`;
  }

  return value;
}

function getIconMap() {
  return {
    name: "fas fa-user",
    email: "fas fa-envelope",
    phone: "fas fa-phone",
    budget: "fas fa-dollar-sign",
    location: "fas fa-map-marker-alt",
    bio: "fas fa-info-circle",
    skills: "fas fa-cogs",
    experience: "fas fa-calendar-alt",
    rate: "fas fa-dollar-sign",
    availability: "fas fa-clock",
    certifications: "fas fa-certificate",
    website: "fas fa-globe",
    investmentAreas: "fas fa-tags",
    consultationPreference: "fas fa-comments",
    ideaTitle: "fas fa-star",
    ideaCategory: "fas fa-folder",
    fundingNeeded: "fas fa-dollar-sign",
    ideaDescription: "fas fa-align-left",
    targetMarket: "fas fa-bullseye",
    skillsNeeded: "fas fa-search",
    projectDuration: "fas fa-hourglass-half",
    consultationTime: "fas fa-calendar-check",
    projectDescription: "fas fa-clipboard-list",
    urgency: "fas fa-exclamation-triangle",
  };
}

function initializeFileUploads() {
  // Handle file upload labels
  document.querySelectorAll('input[type="file"]').forEach((input) => {
    input.addEventListener("change", function () {
      const label = this.parentNode.querySelector(".file-upload-label");
      if (this.files.length > 0) {
        const fileNames = Array.from(this.files)
          .map((f) => f.name)
          .join(", ");
        label.innerHTML = `<i class="fas fa-check-circle"></i> ${this.files.length} file(s) selected`;
        label.title = fileNames;
      }
    });
  });
}

function initializeFormValidation() {
  // Real-time validation
  document.querySelectorAll("input, select, textarea").forEach((input) => {
    input.addEventListener("blur", function () {
      if (this.classList.contains("error")) {
        validateSingleField(this);
      }
    });

    input.addEventListener("input", function () {
      if (this.classList.contains("error")) {
        validateSingleField(this);
      }
      // Auto-save draft
      debouncedAutoSave();
    });
  });
}

function validateSingleField(field) {
  const errorMessage = field.parentNode.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.remove();
  }
  field.classList.remove("error");

  if (
    field.hasAttribute("required") &&
    (!field.value || field.value.trim() === "")
  ) {
    showFieldError(field, "This field is required");
    return false;
  }

  if (field.type === "email" && field.value && !isValidEmail(field.value)) {
    showFieldError(field, "Please enter a valid email address");
    return false;
  }

  if (field.type === "tel" && field.value && !isValidPhone(field.value)) {
    showFieldError(field, "Please enter a valid phone number");
    return false;
  }

  if (field.type === "url" && field.value && !isValidURL(field.value)) {
    showFieldError(field, "Please enter a valid URL");
    return false;
  }

  return true;
}

function showNotification(type, message, icon) {
  // Remove existing notifications
  document.querySelectorAll(".notification").forEach((n) => n.remove());

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;

  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  // Hide notification after 4 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 4000);
}

// Auto-save draft data
function autoSaveDraft() {
  const activeForm = document.querySelector(".form-container.active");
  if (activeForm && currentUserType) {
    const draftData = {};
    activeForm.querySelectorAll("input, select, textarea").forEach((input) => {
      if (input.type !== "file" && input.value) {
        draftData[input.id] = input.value;
      }
    });

    if (Object.keys(draftData).length > 0) {
      localStorage.setItem(
        `mindmarket-draft-${currentUserType}`,
        JSON.stringify(draftData)
      );
    }
  }
}

// Load draft data when form is shown
function loadDraftData(userType) {
  const draftData = localStorage.getItem(`mindmarket-draft-${userType}`);
  if (draftData) {
    try {
      const data = JSON.parse(draftData);
      Object.entries(data).forEach(([id, value]) => {
        const input = document.getElementById(id);
        if (input && input.type !== "file") {
          input.value = value;
        }
      });
      showNotification("info", "Draft data loaded", "fas fa-info-circle");
    } catch (error) {
      console.error("Error loading draft data:", error);
    }
  }
}

// Clear draft data
function clearDraftData(userType) {
  localStorage.removeItem(`mindmarket-draft-${userType}`);
}

// Clear all draft data
function clearAllDraftData() {
  const userTypes = ["investor", "idea-pitcher", "skilled-worker", "hirer"];
  userTypes.forEach((type) => {
    localStorage.removeItem(`mindmarket-draft-${type}`);
  });
}

// Initialize keyboard shortcuts
function initializeKeyboardShortcuts() {
  document.addEventListener("keydown", function (e) {
    // Ctrl/Cmd + S to save profile (if form is visible)
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      const activeForm = document.querySelector(".form-container.active");
      if (activeForm) {
        const createBtn = activeForm.querySelector(".create-profile-btn");
        if (createBtn && !createBtn.disabled) {
          createBtn.click();
        }
      }
    }

    // Escape key to go home
    if (e.key === "Escape") {
      goHome();
    }
  });
}

function goHome() {
  // Reset to initial state
  currentUserType = "";

  // Show user type selection
  const userTypeSelection = document.getElementById("userTypeSelection");
  userTypeSelection.style.display = "block";
  userTypeSelection.style.opacity = "1";

  // Hide all forms and dashboard
  document.querySelectorAll(".form-container").forEach((form) => {
    form.classList.remove("active");
    form.style.display = "none";
  });
  document.getElementById("dashboardContent").classList.remove("active");

  // Reset welcome message and profile picture
  document.getElementById("welcomeMessage").textContent =
    "Welcome! Please complete your profile";

  const profilePicDisplay = document.getElementById("profilePicDisplay");
  profilePicDisplay.innerHTML = `
    <i class="fas fa-camera" id="profileIcon"></i>
    <span id="profileInitials" class="hidden">+</span>
  `;

  // Reset forms
  document.querySelectorAll("input, select, textarea").forEach((input) => {
    if (input.type !== "file") {
      input.value = "";
    } else {
      input.value = null;
    }
    input.classList.remove("error");
  });

  // Clear error messages
  document.querySelectorAll(".error-message").forEach((el) => el.remove());

  // Reset file upload labels
  document.querySelectorAll(".file-upload-label").forEach((label) => {
    const input = label.parentNode.querySelector('input[type="file"]');
    if (input.id === "ideaDocuments") {
      label.innerHTML =
        '<i class="fas fa-cloud-upload-alt"></i> Click to upload documents (PDF, DOC, TXT)';
    } else if (input.id === "ideaVideo") {
      label.innerHTML =
        '<i class="fas fa-video"></i> Click to upload pitch video';
    } else if (input.id === "portfolioImages") {
      label.innerHTML =
        '<i class="fas fa-camera"></i> Click to upload portfolio images';
    }
  });

  // Reset user type buttons
  document.querySelectorAll(".user-type-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });

  showNotification("success", "Returned to home page", "fas fa-home");
}

function logout() {
  showLogoutConfirmation();
}

function showLogoutConfirmation() {
  const confirmModal = document.createElement("div");
  confirmModal.className = "logout-modal";
  confirmModal.innerHTML = `
    <div class="logout-modal-content">
      <div class="logout-modal-header">
        <i class="fas fa-sign-out-alt"></i>
        <h3>Confirm Logout</h3>
      </div>
      <div class="logout-modal-body">
        <p>Are you sure you want to logout? This will clear your profile data.</p>
      </div>
      <div class="logout-modal-actions">
        <button class="logout-cancel-btn" onclick="closeLogoutModal()">
          <i class="fas fa-times"></i>
          Cancel
        </button>
        <button class="logout-confirm-btn" onclick="confirmLogout()">
          <i class="fas fa-sign-out-alt"></i>
          Logout
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(confirmModal);

  // Show modal with animation
  setTimeout(() => {
    confirmModal.classList.add("show");
  }, 10);
}

function closeLogoutModal() {
  const modal = document.querySelector(".logout-modal");
  if (modal) {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

function confirmLogout() {
  // Clear stored data
  localStorage.removeItem("mindmarketProfile");
  clearAllDraftData();
  profileData = {};

  // Close modal
  closeLogoutModal();

  // Reset application state
  goHome();

  showNotification("success", "Logged out successfully", "fas fa-sign-out-alt");

  // Redirect to sign-in page
  setTimeout(() => {
    window.location.href = "sign-in.html";
  }, 2000);
}
