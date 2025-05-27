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

document.addEventListener('DOMContentLoaded', () => {
 

  // Greeting elements
const teachingGreeting = document.getElementById('Pteaching');
const learningGreeting = document.getElementById('Plearning');
const profileImg = document.getElementById('profileImgT');
const profileImgl = document.getElementById('profileImgL');


  // Clear previous courses before adding new ones
  function clearCourses() {
    ['teaching-section', 'mycourses-section'].forEach(sectionId => {
      const completed = document.querySelector(`#${sectionId} .bar.completed`);
      const inProgress = document.querySelector(`#${sectionId} .bar.in-progress`);
      if (completed) completed.innerHTML = '';
      if (inProgress) inProgress.innerHTML = '';
    });
  }

  async function fetchClasses() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No auth token found, user not authenticated");
        return;
      }


      const response = await fetch("http://localhost/api/class/classes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      console.log("Response received:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch classes, status: ${response.status}`);
      }

      const { user_photo, user_name,  classes } = await response.json();
      console.log("Classes fetched:", classes);
       
      // Update localStorage and greetings

      if (teachingGreeting) {
        teachingGreeting.textContent = `Welcome back, ${user_name}. Continue your teaching journey.`;
      }
      if (learningGreeting) {
        learningGreeting.textContent = `Welcome back, ${user_name}. Continue your learning journey.`;
      }

      // Update user photo or set default fallback
      if (profileImg) {
        profileImg.src = user_photo || 'image/profil.jpg';
        profileImg.alt = `${user_name}'s profile picture`;
        profileImgl.src = user_photo || 'image/profil.jpg';
        profileImgl.alt = `${user_name}'s profile picture`;
      }

      // Clear existing courses first
      clearCourses();

      
      // Loop through the classes and render them
classes.forEach(course => {
  // calculate progress first
  const progress = course.duration > 0
    ? Math.round((course.time_gone / course.duration) * 100)
    : 0;

  const isComplete = course.time_gone === course.duration;
  const sectionId = course.type === 'teacher' ? 'teaching-section' : 'mycourses-section';
  const profName = course.type === 'teacher' ? course.receiver_name : course.sender_name;

  const moduleHTML = `
    <div class="module">
      <div class="course">
        <h2>${course.skill_name || "No Skill Name"}</h2>
        <div class="professor-name">${profName || "Unknown"}</div>
        <div class="progress-header">
          <p>Progress</p>
          <span class="pourcentage">${progress}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress" style="width: ${progress}%"></div>
        </div>
        <div class="footer-row">
          <div class="time-left">
            <i class="fas ${isComplete ? 'fa-check-circle' : 'fa-stopwatch'}"></i>
            <span>${isComplete ? 'Completed' : `${course.time_gone}h gone`}</span>
          </div>
          <button 
            class="${isComplete ? 'certificate-btn' : 'continue-btn'}" 
            data-id="${course.class_id || ''}">
            ${isComplete ? 'Certificate' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  `;



        const containerSelector = isComplete ? '.bar.completed' : '.bar.in-progress';
        const container = document.querySelector(`#${sectionId} ${containerSelector}`);
        if (container) {
          container.insertAdjacentHTML('beforeend', moduleHTML);
          console.log(`Added course to #${sectionId} ${containerSelector}`);
        } else {
          console.warn(`Container not found: #${sectionId} ${containerSelector}`);
        }
      });

    } catch (error) {
      console.error("Error loading classes:", error);
    }
  }
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('continue-btn')) {
    const classId = e.target.getAttribute('data-id');
    if (classId) {
      localStorage.setItem('currentClassId', classId);
      window.location.href = 'timer.html';
    } else {
      console.warn('No class ID found on continue button.');
    }
  }

  if (e.target.classList.contains('certificate-btn')) {
    alert('Certificate button clicked!');
  }
});


  fetchClasses();
});

document.querySelectorAll('.search-box input').forEach(input => {
  input.addEventListener('keyup', function () {
    const query = this.value.toLowerCase().trim();
    const parentSection = this.closest('.main-area');

    parentSection.querySelectorAll('.module').forEach(module => {
      const skillName = module.querySelector('h2')?.textContent.toLowerCase() || '';
      if (skillName.includes(query)) {
        module.style.display = 'block';
      } else {
        module.style.display = 'none';
      }
    });
  });
});

