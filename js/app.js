// js/api.js
const API_BASE_URL = 'https://mind-market-api.onrender.com';

class ApiService {
  // User signup
  async signup(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return await response.json();
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  // User signin
  async signin(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      return await response.json();
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  }

  // Get all users
  async getAllUsers(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
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
      rate = `$${data.consultationRate}/hour`;
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

  // Get user by ID
  async getUserById(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }
}

const apiService = new ApiService();
