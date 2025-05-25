document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const timerText = document.querySelector(".timer-text");
  const pointsText = document.querySelector(".points-text");
  const user1Button = document.getElementById("user1-button");
  const user2Button = document.getElementById("user2-button");
  const user1ReadyIndicator = document.getElementById("user1-ready");
  const user2ReadyIndicator = document.getElementById("user2-ready");
  const startButton = document.getElementById("start-button");
  const pauseButton = document.getElementById("pause-button");
  const resumeButton = document.getElementById("resume-button");
  const endButton = document.getElementById("end-button");

  // Modal elements
  const windowModal = document.querySelector(".window");
  const closeButton = document.querySelector(".x");
  const cancelButton = document.querySelector(".btn:nth-child(1)");
  const confirmEndButton = document.querySelector(".btn:nth-child(2)");
  const reasonCards = document.querySelectorAll(".card");
  const sessionDurationText = document.querySelector(
    ".window p:nth-of-type(2)"
  );
  const othericon = document.querySelector(".fa-ellipsis");

  // Create overlay element if it doesn't exist
  let overlay = document.querySelector(".overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "overlay";
    document.body.appendChild(overlay);
  }

  // Timer state
  let seconds = 0;
  let isRunning = false;
  let isPaused = false;
  let intervalId = null;
  let user1Ready = false;
  let user2Ready = false;

  // User data - in a real app, this would come from authentication
  const users = {
    user1: {
      id: "user1",
      name: "Bensalah Abderrahmane",
      role: "teacher",
      element: user1Button,
      indicator: user1ReadyIndicator,
      isReady: false,
    },
    user2: {
      id: "user2",
      name: "Abderrahmane Bn",
      role: "learner",
      element: user2Button,
      indicator: user2ReadyIndicator,
      isReady: false,
    },
  };

  // Current user simulation (in a real app this would be determined by auth)
  const currentUser = users.user1; // For demo purposes, assume we're user1
  const otherUser = users.user2; // The other user

  // Format time to display as mm:ss
  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  // Format session duration for display in the modal
  function formatSessionDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}hr ${minutes}min ${seconds}sec`;
    } else if (minutes > 0) {
      return `${minutes}min ${seconds}sec`;
    } else {
      return `${seconds}sec`;
    }
  }

  // Update the timer display
  function updateTimerDisplay() {
    timerText.textContent = formatTime(seconds);
    const points = Math.floor(seconds / 2);
    pointsText.textContent = `${points} points earned`;
  }

  // Start the timer
  function startTimer() {
    if (!isRunning) {
      isRunning = true;
      isPaused = false;

      // Update UI
      startButton.style.display = "none";
      pauseButton.style.display = "inline-flex";
      endButton.style.display = "inline-flex";
      user1Button.style.display = "none";
      user2Button.style.display = "none";

      // Start the interval
      intervalId = setInterval(() => {
        seconds++;
        updateTimerDisplay();
      }, 1000);
    }
  }

  // Pause the timer
  function pauseTimer(initiatingUser) {
    if (isRunning && !isPaused) {
      isPaused = true;
      users.user1.isReady = false;
      users.user2.isReady = false;

      // Update UI
      pauseButton.style.display = "none";
      resumeButton.style.display = "inline-flex";
      user1Button.style.display = "inline-flex";
      user2Button.style.display = "inline-flex";
      user1Button.textContent = "Ready to Resume";
      user2Button.textContent = "Ready to Resume";
      user1Button.dataset.action = "resume";
      user2Button.dataset.action = "resume";
      user1ReadyIndicator.textContent = "Not Ready";
      user2ReadyIndicator.textContent = "Not Ready";
      user1ReadyIndicator.classList.remove("is-ready");
      user2ReadyIndicator.classList.remove("is-ready");

      // Enable both buttons for the resume state
      user1Button.disabled = false;
      user2Button.disabled = false;

      // Clear the interval
      clearInterval(intervalId);
    }
  }

  // Resume the timer
  function resumeTimer() {
    if (isRunning && isPaused && users.user1.isReady && users.user2.isReady) {
      isPaused = false;

      // Update UI
      resumeButton.style.display = "none";
      pauseButton.style.display = "inline-flex";
      user1Button.style.display = "none";
      user2Button.style.display = "none";

      // Start the interval
      intervalId = setInterval(() => {
        seconds++;
        updateTimerDisplay();
      }, 1000);
    }
  }

  // End the timer - THIS FUNCTION SHOULD ONLY BE CALLED AFTER CONFIRMATION
  function endTimer(initiatingUser) {
    if (isRunning) {
      isRunning = false;
      isPaused = false;
      users.user1.isReady = false;
      users.user2.isReady = false;
      const points = Math.floor(seconds / 2);

      // Reset UI to initial state
      startButton.style.display = "inline-flex";
      pauseButton.style.display = "none";
      resumeButton.style.display = "none";
      endButton.style.display = "none";
      user1Button.style.display = "inline-flex";
      user2Button.style.display = "inline-flex";
      user1Button.textContent = "Ready to Start";
      user2Button.textContent = "Ready to Start";
      user1Button.dataset.action = "start";
      user2Button.dataset.action = "start";
      user1ReadyIndicator.textContent = "Not Ready";
      user2ReadyIndicator.textContent = "Not Ready";
      user1ReadyIndicator.classList.remove("is-ready");
      user2ReadyIndicator.classList.remove("is-ready");

      // Enable both buttons for the next session
      user1Button.disabled = false;
      user2Button.disabled = false;

      // Reset timer
      seconds = 0;
      updateTimerDisplay();

      // Clear the interval
      clearInterval(intervalId);
    }
  }

  // Handle user ready states
  function setUserReady(user) {
    const userId = user.id;

    // Update ready state
    users[userId].isReady = true;
    users[userId].indicator.textContent = "Ready!";
    users[userId].indicator.classList.add("is-ready");
    users[userId].element.disabled = true;

    // Check if both users are ready
    if (users.user1.isReady && users.user2.isReady) {
      if (!isRunning) {
        startTimer();
      } else if (isPaused) {
        resumeTimer();
      }
    }
  }

  // MODAL FUNCTIONS

  // Show modal function
  function showModal() {
    // Update session duration text
    sessionDurationText.textContent = `Session duration: ${formatSessionDuration(
      seconds
    )}`;

    windowModal.style.display = "flex";
    overlay.style.display = "block";

    // Add entrance animation for modal if GSAP is available
    if (typeof gsap !== "undefined") {
      gsap.fromTo(
        windowModal,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    } else {
      windowModal.style.opacity = 1;
    }

    // Reset selected reason
    selectedReason = null;
    resetCardSelection();
  }

  // Hide modal function
  function hideModal() {
    if (typeof gsap !== "undefined") {
      gsap.to(windowModal, {
        y: -30,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          windowModal.style.display = "none";
          overlay.style.display = "none";
        },
      });
    } else {
      windowModal.style.opacity = 0;
      windowModal.style.display = "none";
      overlay.style.display = "none";
    }
  }

  // Reset card selection
  function resetCardSelection() {
    reasonCards.forEach((card) => {
      if (typeof gsap !== "undefined") {
        gsap.to(card, {
          backgroundColor: "var(--border)",
          color: "var(--text-secondary)",
          duration: 0.3,
          y: 0,
        });
      } else {
        card.style.backgroundColor = "var(--border)";
        card.style.color = "var(--text-secondary)";
        card.style.transform = "translateY(0)";
      }
    });
  }

  // Initialize GSAP hover animations for cards if GSAP is available
  function initCardAnimations() {
    if (typeof gsap === "undefined") return;

    reasonCards.forEach((card) => {
      // Create hover animations
      card.addEventListener("mouseenter", () => {
        if (card.dataset.value !== selectedReason) {
          gsap.to(card, {
            y: -5,
            duration: 0.2,
            ease: "power1.out",
            boxShadow: "0 8px 15px var(--shadow)",
          });
        }
      });

      card.addEventListener("mouseleave", () => {
        if (card.dataset.value !== selectedReason) {
          gsap.to(card, {
            y: 0,
            duration: 0.2,
            ease: "power1.in",
            boxShadow: "2px 5px 10px var(--shadow)",
          });
        }
      });
    });
  }

  // Event Listeners for user ready buttons
  user1Button.addEventListener("click", function () {
    const action = this.dataset.action;
    if (action === "start" || action === "resume") {
      setUserReady(users.user1);
    }
  });

  user2Button.addEventListener("click", function () {
    const action = this.dataset.action;
    if (action === "start" || action === "resume") {
      setUserReady(users.user2);
    }
  });

  // Start button event listener
  startButton.addEventListener("click", function () {
    if (users.user1.isReady && users.user2.isReady && !isRunning) {
      startTimer();
    }
  });

  // Pause button event listener
  pauseButton.addEventListener("click", function () {
    pauseTimer(currentUser);
  });

  // Resume button event listener
  resumeButton.addEventListener("click", function () {
    if (users.user1.isReady && users.user2.isReady && isPaused) {
      resumeTimer();
    }
  });

  // End button event listener - MODIFIED TO ONLY SHOW MODAL
  endButton.addEventListener("click", function () {
    // Instead of ending right away, show the modal for confirmation
    showModal();
  });

  // Close modal when X is clicked
  closeButton.addEventListener("click", hideModal);

  // Close modal when cancel button is clicked
  cancelButton.addEventListener("click", hideModal);

  // Handle end session confirmation - THIS IS WHAT ACTUALLY ENDS THE SESSION
  confirmEndButton.addEventListener("click", function () {
    endTimer(currentUser);
    hideModal();
  });

  // Close modal if clicked outside
  overlay.addEventListener("click", hideModal);

  // Selected reason
  let selectedReason = null;

  // Reason card selection with enhanced animations
  reasonCards.forEach((card) => {
    card.addEventListener("click", function () {
      // Reset all cards first
      resetCardSelection();

      // Store selected reason
      selectedReason = this.dataset.value;

      if (typeof gsap !== "undefined") {
        // Highlight selected card with animation
        gsap.to(this, {
          backgroundColor: "var(--primary)",
          color: "white",
          y: -3,
          scale: 1.03,
          duration: 0.3,
          ease: "back.out(1.2)",
          boxShadow: "0 8px 20px var(--shadow)",
        });
        othericon.style.color = "var(--text-primary)";
        if (this.id === "card4" && othericon) {
          othericon.style.color = "white";
        }

        // Add a small pulse animation to indicate selection
        gsap.fromTo(
          this,
          { boxShadow: "0 0 0 4px rgba(124, 58, 237, 0.5)" },
          {
            boxShadow: "0 8px 20px var(--shadow)",
            duration: 0.6,
            ease: "power1.out",
          }
        );
      } else {
        // Fallback for when GSAP is not available
        this.style.backgroundColor = "var(--primary-dark)";
        this.style.color = "white";
        this.style.transform = "translateY(-3px) scale(1.03)";
        this.style.boxShadow = "0 8px 20px var(--shadow)";
      }
    });
  });

  // Initialize
  updateTimerDisplay();
  startButton.disabled = true;

  // Helper function to update start button state
  function updateStartButtonState() {
    startButton.disabled = !(users.user1.isReady && users.user2.isReady);
  }

  // Update start button when user ready state changes
  const startUserReadyObserver = new MutationObserver(updateStartButtonState);
  startUserReadyObserver.observe(user1ReadyIndicator, {
    attributes: true,
    childList: true,
  });
  startUserReadyObserver.observe(user2ReadyIndicator, {
    attributes: true,
    childList: true,
  });

  // Initialize card animations if GSAP is available
  if (typeof gsap !== "undefined") {
    initCardAnimations();
  }
});

//get class info w display it fel page
async function loadClassSession() {
  try {
    const classId = localStorage.getItem("currentClassId");
    const token = localStorage.getItem("token");

    if (!classId) {
      console.error("No class ID found in localStorage");
      alert(
        'Missing class ID. Set localStorage.setItem("currentClassId", "YOUR_CLASS_ID")'
      );
      return;
    }

    if (!token) {
      console.error("No token found in localStorage");
      alert("You must log in first to get the token");
      return;
    }

    const response = await fetch(`http://localhost:80/api/class/${classId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to load class session: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Class session loaded:", data);

    const { currentUser, otherUser, userRole, classInfo } = data;

if (userRole === "teacher") {
  // Teacher on left
  document.querySelector(".user-left .user-name").textContent = currentUser.username;
  document.querySelector(".user-left .profile-image img").src = currentUser.profilePicture;
  document.querySelector(".user-left .role").textContent = "Teacher";

  document.querySelector(".user-right .user-name").textContent = otherUser.username;
  document.querySelector(".user-right .profile-image img").src = otherUser.profilePicture;
  document.querySelector(".user-right .role").textContent = "Learner";
} else {
  // Student on right
  document.querySelector(".user-right .user-name").textContent = currentUser.username;
  document.querySelector(".user-right .profile-image img").src = currentUser.profilePicture;
  document.querySelector(".user-right .role").textContent = "Learner";

  document.querySelector(".user-left .user-name").textContent = otherUser.username;
  document.querySelector(".user-left .profile-image img").src = otherUser.profilePicture;
  document.querySelector(".user-left .role").textContent = "Teacher";
}
    function formatTime(seconds) {
      const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
      const secs = String(seconds % 60).padStart(2, "0");
      return `${mins}:${secs}`;
    }
    document.querySelector(".timer-text").textContent = formatTime(
      data.classInfo.elapsedTime
    );
    document.querySelector(
      ".points-text"
    ).textContent = `${data.classInfo.pointsEarned} points earned`;
  } catch (error) {
    console.error("[loadClassSession Error]", error);
    alert("Failed to load class session. See console for details.");
  }
}
loadClassSession();
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

// behc nerja3 lel previous page
document.getElementById("backButton").addEventListener("click", function () {
  history.back();
});
//te3 files
document.addEventListener("DOMContentLoaded", function () {
  const filesButton = document.getElementById("files-button");
  const filesModal = document.getElementById("filesModal");
  const closeFilesModal = document.getElementById("closeFilesModal");
  const fileInput = document.getElementById("fileInput");
  const uploadButton = document.getElementById("upload-button");
  const fileList = document.getElementById("fileList");

  // Store uploaded files
  let uploadedFiles = [];

  // Create modal overlay
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";
  document.body.appendChild(modalOverlay);

  // Show files modal
  function showFilesModal() {
    filesModal.style.display = "flex";
    modalOverlay.classList.add("active");
    setTimeout(() => {
      filesModal.classList.add("active");
    }, 10);
    updateFileList();
  }

  // Hide files modal
  function hideFilesModal() {
    filesModal.classList.remove("active");
    modalOverlay.classList.remove("active");
    setTimeout(() => {
      filesModal.style.display = "none";
    }, 300);
  }

  // Get file icon based on file type
  function getFileIcon(fileName) {
    const extension = fileName.split(".").pop().toLowerCase();
    const iconMap = {
      pdf: { icon: "📄", class: "pdf" },
      doc: { icon: "📝", class: "doc" },
      docx: { icon: "📝", class: "doc" },
      txt: { icon: "📄", class: "text" },
      jpg: { icon: "🖼️", class: "image" },
      jpeg: { icon: "🖼️", class: "image" },
      png: { icon: "🖼️", class: "image" },
      gif: { icon: "🖼️", class: "image" },
      mp4: { icon: "🎥", class: "video" },
      mp3: { icon: "🎵", class: "audio" },
      wav: { icon: "🎵", class: "audio" },
      zip: { icon: "📦", class: "archive" },
      rar: { icon: "📦", class: "archive" },
    };

    return iconMap[extension] || { icon: "📄", class: "default" };
  }

  // Format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Update file list display
  function updateFileList() {
    if (uploadedFiles.length === 0) {
      fileList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📁</div>
                    <div class="empty-title">No files uploaded</div>
                    <div class="empty-description">Upload files using the "Upload Files" button to see them here.</div>
                </div>
            `;
      return;
    }

    fileList.innerHTML = uploadedFiles
      .map((file, index) => {
        const fileIcon = getFileIcon(file.name);
        const uploadDate = new Date(file.uploadDate).toLocaleDateString();

        return `
                <li class="file-item" data-index="${index}">
                    <div class="file-info">
                        <div class="file-icon ${fileIcon.class}">
                            ${fileIcon.icon}
                        </div>
                        <div class="file-details">
                            <div class="file-name" title="${file.name}">${
          file.name
        }</div>
                            <div class="file-meta">
                                <span>${formatFileSize(file.size)}</span>
                                <span>Uploaded ${uploadDate}</span>
                            </div>
                        </div>
                    </div>
                    <div class="file-actions">
                        <button class="file-action-btn download" title="Download" onclick="downloadFile(${index})">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7,10 12,15 17,10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                        </button>
                        <button class="file-action-btn delete" title="Remove" onclick="removeFile(${index})">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3,6 5,6 21,6"/>
                                <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                            </svg>
                        </button>
                    </div>
                </li>
            `;
      })
      .join("");
  }

  // Add file to uploaded files list
  async function addFiles(files) {
    const classId = localStorage.getItem("currentClassId");
    const uploadUrl = `http://localhost:80/api/class/upload/${classId}`;

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file); // must match backend field name

      try {
        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const result = await response.json();
        showToast(`${file.name} uploaded successfully!`, "success");
      } catch (err) {
        console.error(err);
        showToast(`Failed to upload ${file.name}`, "error");
      }
    }

    fetchFilesFromBackend(); // reload files from server
  }

  async function fetchFilesFromBackend() {
    const classId = localStorage.getItem("currentClassId");
    const url = `http://localhost:80/api/class/files/${classId}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch files");

      const filesFromServer = await response.json();
      console.log("Files received:", filesFromServer);
      uploadedFiles = filesFromServer.map((file) => ({
        id: file.id,
        name: file.filename,
        size: file.sizeKB,
        uploadDate: file.uploaded_at,
        filepath: file.filepath
      }));

      updateFileList();
    } catch (err) {
      console.error(err);
      showToast("Failed to load files from server", "error");
    }
  }

  window.addEventListener("load", () => {
    fetchFilesFromBackend();
  });

  // download file
window.downloadFile = function(index) {
  const fileData = uploadedFiles[index];
  const fileUrl = `http://localhost:80/uploads/${fileData.name}`;
  window.open(fileUrl, '_blank');
  showToast(`Downloading ${fileData.name}`, "info");
};


  // Remove file - FIXED VERSION
  window.removeFile = async function (index) {
    const file = uploadedFiles[index];
    const fileId = file.id;

    try {
      const response = await fetch(`http://localhost:80/api/class/file/${fileId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete");

      // Remove from local array and update UI
      uploadedFiles.splice(index, 1);
      updateFileList();
      showToast(`${file.name} removed`, "info");
    } catch (err) {
      console.error(err);
      showToast(`Failed to delete ${file.name}`, "error");
    }
  };

  // Event listeners
  filesButton.addEventListener("click", showFilesModal);
  closeFilesModal.addEventListener("click", hideFilesModal);
  modalOverlay.addEventListener("click", hideFilesModal);

  // Upload button functionality
  uploadButton.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = ""; // Reset input
    }
  });

  // Prevent modal from closing when clicking inside it
  filesModal.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Keyboard support
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && filesModal.classList.contains("active")) {
      hideFilesModal();
    }
  });
});
//load animations
document.addEventListener("DOMContentLoaded", () => {
  const tl = gsap.timeline({
    defaults: {
      duration: 0.6,
      ease: "power3.out",
    },
  });

  // Animate main card first
  tl.from(".big-card", {
    opacity: 0,
    scale: 0.95,
    duration: 0.2,
    ease: "back.out(1.2)",
  })

    // Animate card header
    .from(
      ".card-header",
      {
        opacity: 0,
        y: -20,
        stagger: 0.1,
        ease: "power2.out",
      },
      "-=0.6"
    )

    // Animate timer display
    .from(
      ".timer-display",
      {
        opacity: 0,
        y: -30,
        scale: 0.9,
        duration: 0.7,
        ease: "back.out(1.3)",
      },
      "-=0.5"
    )

    // Animate user profiles from opposite sides
    .from(
      ".user-profile:nth-child(1)",
      {
        opacity: 0,
        x: -80,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.4"
    )
    .from(
      ".user-profile:nth-child(2)",
      {
        opacity: 0,
        x: 80,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.8"
    )

    // Animate timer controls
    .from(
      ".timer-controls",
      {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.5,
        ease: "back.out(1.5)",
      },
      "-=0.5"
    );
});

// Enhanced feedback submission with API integration
document.addEventListener("DOMContentLoaded", function () {
  const confirmEndButton = document.querySelector(".window .btn:nth-child(2)");
  const feedbackContainer = document.querySelector(".feedback-container");
  const sessionDurationText = document.querySelector(
    ".session-details .session-item:first-child span:last-child"
  );
  const pointsEarnedText = document.querySelector(
    ".session-details .session-item:last-child span:last-child"
  );

  const feedbackOverlay = document.querySelector(".feedback-overlay");

  // Hide feedback container m3a lowel
  if (feedbackContainer) {
    feedbackContainer.style.display = "none";
  }

  function getClassId() {
    const pathParts = window.location.pathname.split("/");
    const classIndex = pathParts.indexOf("class");
    if (classIndex !== -1 && pathParts[classIndex + 1]) {
      return pathParts[classIndex + 1];
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("classId")) {
      return urlParams.get("classId");
    }

    const classIdAttr =
      document.body.getAttribute("data-class-id") ||
      document.querySelector("[data-class-id]")?.getAttribute("data-class-id");
    if (classIdAttr) {
      return classIdAttr;
    }

    if (typeof window.classId !== "undefined") {
      return window.classId;
    }

    console.error(
      "Class ID not found. Please ensure the class ID is available."
    );
    return null;
  }

  function getAuthToken() {
    const tokenFromStorage =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("jwt");

    if (tokenFromStorage) {
      return tokenFromStorage;
    }
  }

  // Function to show feedback container
  function showFeedbackContainer() {
    if (feedbackContainer) {
      // Update session details
      const timerText =
        document.querySelector(".timer-text")?.textContent || "00:00";
      const pointsText =
        document.querySelector(".points-text")?.textContent?.split(" ")[0] ||
        "0";

      if (sessionDurationText) sessionDurationText.textContent = timerText;
      if (pointsEarnedText) pointsEarnedText.textContent = pointsText;

      // Show the feedback container and overlay
      feedbackContainer.style.display = "block";
      feedbackOverlay.style.display = "block";

      // Add animation if GSAP is available
      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          feedbackContainer,
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
        );
      }
    }
  }

  function hideFeedbackContainer() {
    if (feedbackContainer) {
      if (typeof gsap !== "undefined") {
        gsap.to(feedbackContainer, {
          y: -30,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            feedbackContainer.style.display = "none";
            feedbackOverlay.style.display = "none";
          },
        });
      } else {
        feedbackContainer.style.display = "none";
        feedbackOverlay.style.display = "none";
      }
    }
  }

  const API_CONFIG = {
    baseUrl: window.location.origin,
    getHeaders: function () {
      const token = getAuthToken();
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      return headers;
    },
  };

  function getFeedbackData() {
    const selectedStars = document.querySelectorAll(".star.selected");
    const finalRating = selectedStars.length;

    const commentTextarea = document.querySelector(
      ".feedback-container textarea"
    );
    const comment = commentTextarea ? commentTextarea.value.trim() : "";

    const selectedReasonCard = document.querySelector(
      '.card[data-selected="true"]'
    );
    const endReason = selectedReasonCard
      ? selectedReasonCard.dataset.value
      : null;

    return {
      rating: finalRating,
      comment: comment,
      endReason: endReason,
    };
  }

  // Function to submit feedback to API
  async function submitFeedbackToAPI(feedbackData) {
    const classId = getClassId();

    if (!classId) {
      throw new Error("Class ID not found");
    }

    try {
      // Show loading state
      const submitButton = document.getElementById("submit");
      if (submitButton) {
        const originalText = submitButton.textContent;
        submitButton.textContent = "Submitting...";
        submitButton.disabled = true;
      }

      // Prepare data for backend (only rating and comment)
      const backendData = {
        rating: feedbackData.rating,
        comment: feedbackData.comment,
      };

      const response = await fetch(
        `http://localhost:80/api/class/feedback/${classId}`,
        {
          method: "POST",
          headers: API_CONFIG.getHeaders(),
          body: JSON.stringify(backendData),
        }
      );

      // Reset button state
      if (submitButton) {
        submitButton.textContent = "Submit Feedback";
        submitButton.disabled = false;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      // Show success message
      showToast("Feedback submitted successfully!", "success");

      // Hide feedback container
      hideFeedbackContainer();

      // Clear form
      clearFeedbackForm();

      return result;
    } catch (error) {
      console.error("Error submitting feedback:", error);

      // Reset button state
      const submitButton = document.getElementById("submit");
      if (submitButton) {
        submitButton.textContent = "Submit Feedback";
        submitButton.disabled = false;
      }

      // Show error message
      showToast(
        error.message || "Failed to submit feedback. Please try again.",
        "error"
      );

      throw error;
    }
  }

  // Function to clear feedback form
  function clearFeedbackForm() {
    // Clear star rating
    const stars = document.querySelectorAll(".star");
    stars.forEach((star) => {
      star.classList.remove("selected");
      const icon = star.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
      }
    });

    // Clear radio buttons
    const radioButtons = document.querySelectorAll('input[name="rating"]');
    radioButtons.forEach((radio) => (radio.checked = false));

    // Clear comment
    const commentTextarea =
      document.querySelector(".feedback-container textarea") ||
      document.querySelector("#feedback-comment") ||
      document.querySelector('textarea[name="comment"]');
    if (commentTextarea) commentTextarea.value = "";

    // Clear selected reason card
    const selectedCard = document.querySelector('.card[data-selected="true"]');
    if (selectedCard) {
      selectedCard.removeAttribute("data-selected");
      selectedCard.style.backgroundColor = "";
      selectedCard.style.color = "";
    }
  }

  // Function to validate feedback data
  function validateFeedbackData(data) {
    const errors = [];

    if (!data.rating || data.rating < 1 || data.rating > 5) {
      errors.push("Please provide a rating between 1 and 5 stars");
    }

    if (!data.comment || data.comment.length < 3) {
      errors.push("Please provide a comment with at least 3 characters");
    }

    if (data.comment && data.comment.length > 500) {
      errors.push("Comment must be less than 500 characters");
    }

    return errors;
  }

  // Modify the confirmEndButton click event to show feedback after ending the session
  if (confirmEndButton) {
    confirmEndButton.addEventListener("click", function (event) {
      event.preventDefault();

      // Store the selected reason before hiding modal
      const selectedCard = document.querySelector(
        '.card[style*="background-color"]'
      );
      if (selectedCard) {
        selectedCard.setAttribute("data-selected", "true");
      }

      // Hide the end session modal first
      const windowModal = document.querySelector(".window");
      const overlay = document.querySelector(".overlay:not(.feedback-overlay)");

      if (windowModal) {
        windowModal.style.display = "none";
      }
      if (overlay) {
        overlay.style.display = "none";
      }

      // Then show feedback
      showFeedbackContainer();

      // End the timer in background - call the endTimer function from timer.js
      if (typeof endTimer === "function") {
        const currentUser = typeof users !== "undefined" ? users.user1 : null;
        endTimer(currentUser);
      }
    });
  }

  // Enhanced submit button event listener
  const submitButton = document.getElementById("submit");
  if (submitButton) {
    submitButton.addEventListener("click", async function (event) {
      event.preventDefault();

      try {
        // Get feedback data
        const feedbackData = getFeedbackData();

        // Validate data
        const validationErrors = validateFeedbackData(feedbackData);
        if (validationErrors.length > 0) {
          showToast(validationErrors[0], "error");
          return;
        }

        // Submit to API
        await submitFeedbackToAPI(feedbackData);
      } catch (error) {
        console.error("Feedback submission failed:", error);
        // Error handling is already done in submitFeedbackToAPI
      }
    });
  }

  // Close button functionality
  const closeButton = document.getElementById("close");
  if (closeButton) {
    closeButton.addEventListener("click", function (event) {
      event.preventDefault();
      hideFeedbackContainer();
    });
  }

  // Star rating functionality (if not already implemented)
  function initializeStarRating() {
    const stars = document.querySelectorAll(".star");

    stars.forEach((star, index) => {
      star.addEventListener("click", function () {
        // Clear all stars
        stars.forEach((s) => {
          s.classList.remove("selected");
          const icon = s.querySelector("i");
          if (icon) {
            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");
          }
        });

        // Fill stars up to clicked one
        for (let i = 0; i <= index; i++) {
          stars[i].classList.add("selected");
          const icon = stars[i].querySelector("i");
          if (icon) {
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
          }
        }
      });
    });
  }

  // Initialize star rating
  initializeStarRating();

  // Optional: Save draft functionality
  function saveFeedbackDraft() {
    const feedbackData = getFeedbackData();
    const classId = getClassId();

    if (classId) {
      localStorage.setItem(
        `feedbackDraft_${classId}`,
        JSON.stringify({
          rating: feedbackData.rating,
          comment: feedbackData.comment,
          timestamp: Date.now(),
        })
      );
    }
  }

  // Optional: Load draft functionality
  function loadFeedbackDraft() {
    const classId = getClassId();
    if (!classId) return;

    const draft = localStorage.getItem(`feedbackDraft_${classId}`);
    if (draft) {
      try {
        const data = JSON.parse(draft);
        // Check if draft is less than 24 hours old
        if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
          // Restore rating - stars
          if (data.rating && data.rating > 0) {
            const stars = document.querySelectorAll(".star");
            for (let i = 0; i < Math.min(data.rating, stars.length); i++) {
              stars[i].classList.add("selected");
              const icon = stars[i].querySelector("i");
              if (icon) {
                icon.classList.remove("fa-regular");
                icon.classList.add("fa-solid");
              }
            }
          }

          // Restore rating - radio buttons
          const ratingInput = document.querySelector(
            `input[type="radio"][value="${data.rating}"]`
          );
          if (ratingInput) ratingInput.checked = true;

          // Restore comment
          const commentTextarea =
            document.querySelector(".feedback-container textarea") ||
            document.querySelector("#feedback-comment") ||
            document.querySelector('textarea[name="comment"]');
          if (commentTextarea && data.comment) {
            commentTextarea.value = data.comment;
          }
        } else {
          // Remove old draft
          localStorage.removeItem(`feedbackDraft_${classId}`);
        }
      } catch (error) {
        console.error("Error loading feedback draft:", error);
        localStorage.removeItem(`feedbackDraft_${classId}`);
      }
    }
  }

  // Auto-save draft while typing (optional)
  const commentTextarea =
    document.querySelector(".feedback-container textarea") ||
    document.querySelector("#feedback-comment") ||
    document.querySelector('textarea[name="comment"]');

  if (commentTextarea) {
    let saveTimeout;
    commentTextarea.addEventListener("input", function () {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(saveFeedbackDraft, 1000); // Save after 1 second of no typing
    });
  }

  // Load draft when feedback container is shown
  const originalShowFeedback = showFeedbackContainer;
  showFeedbackContainer = function () {
    originalShowFeedback();
    setTimeout(loadFeedbackDraft, 100); // Small delay to ensure form is rendered
  };

  // Toast notification function (if not already defined)
  if (typeof showToast !== "function") {
    window.showToast = function (message, type = "info") {
      // Create toast container if it doesn't exist
      let toastContainer = document.getElementById("toast-container");
      if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";
        toastContainer.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          pointer-events: none;
        `;
        document.body.appendChild(toastContainer);
      }

      const toast = document.createElement("div");
      toast.className = `toast ${type}`;
      toast.textContent = message;
      toast.style.cssText = `
        background: ${
          type === "success"
            ? "#4CAF50"
            : type === "error"
            ? "#f44336"
            : "#2196F3"
        };
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        margin-bottom: 10px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        animation: toast-slide-in 0.3s ease-out;
        pointer-events: auto;
      `;

      // Add CSS animation if not already defined
      if (!document.querySelector("#toast-styles")) {
        const style = document.createElement("style");
        style.id = "toast-styles";
        style.textContent = `
          @keyframes toast-slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes toast-slide-out {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      toastContainer.appendChild(toast);

      // Remove toast after 3 seconds
      setTimeout(() => {
        toast.style.animation = "toast-slide-out 0.3s ease-in forwards";
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      }, 3000);
    };
  }

  // Clean up old drafts on page load (optional)
  function cleanupOldDrafts() {
    const keys = Object.keys(localStorage);
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    keys.forEach((key) => {
      if (key.startsWith("feedbackDraft_")) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          if (data.timestamp < oneDayAgo) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          // Remove corrupted draft
          localStorage.removeItem(key);
        }
      }
    });
  }

  // Run cleanup
  cleanupOldDrafts();
});
