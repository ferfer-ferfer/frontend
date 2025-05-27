// if no token dont acces 
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Not logged in, redirect to login page
        window.location.href = '/index.html';
    }
});

// Enhanced dark mode functionality - works with external toggle
document.addEventListener("DOMContentLoaded", function () {
  const root = document.documentElement;

  // Apply the theme from localStorage
  function applyTheme() {
    // Load saved theme from localStorage or default to light
    const savedTheme = localStorage.getItem("theme") || "light";

    // Set theme on root element
    root.setAttribute("data-theme", savedTheme);

    // Update checkbox if it exists on this page
    const toggleCheckbox = document.getElementById("checkbox");
    if (toggleCheckbox) {
      toggleCheckbox.checked = savedTheme === "dark";
    }
  }

  // Apply theme immediately on page load
  applyTheme();

  // Listen for checkbox changes if it exists on this page
  const toggleCheckbox = document.getElementById("checkbox");
  if (toggleCheckbox) {
    toggleCheckbox.addEventListener("change", function () {
      const newTheme = toggleCheckbox.checked ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      applyTheme();
    });
  }

  // Listen for storage changes (when theme is changed on another page)
  window.addEventListener("storage", function (event) {
    if (event.key === "theme") {
      applyTheme();
    }
  });
});


document.getElementById('profile-update-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData();

  // Append form values
  formData.append('Users_name', document.getElementById('userName').value);
  formData.append('first_name', document.getElementById('firstName').value);
  formData.append('last_name', document.getElementById('lastName').value);
  formData.append('telegram', document.getElementById('telegram').value);
  formData.append('discord', document.getElementById('discord').value);
  formData.append('birthday', document.getElementById('birth').value);
  formData.append('bio', "hey this is my bio");

  // Append the photo file (make sure your file input has id="profilePicture")
  const fileInput = document.getElementById('profile_picture');
  if (fileInput && fileInput.files.length > 0) {
    formData.append('profile_picture', fileInput.files[0]);
  }

  try {
    const res = await fetch('http://localhost:80/api/user/info', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      window.location.href = '/learning.html';
    }

  } catch (err) {
    console.error('Profile update error:', err);
    alert('Something went wrong during profile update.');
  }
});