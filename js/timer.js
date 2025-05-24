document.addEventListener("DOMContentLoaded", function () {
  // Find existing elements
  const confirmEndButton = document.querySelector(".window .btn:nth-child(2)"); // The "End Session" button in modal
  const feedbackContainer = document.querySelector(".feedback-container");
  const sessionDurationText = document.querySelector(
    ".session-details .session-item:first-child span:last-child"
  );
  const pointsEarnedText = document.querySelector(
    ".session-details .session-item:last-child span:last-child"
  );

  // Add these lines to your existing code to handle showing the feedback form

  // Create overlay for feedback container if it doesn't exist
  let feedbackOverlay = document.querySelector(".feedback-overlay");
  if (!feedbackOverlay) {
    feedbackOverlay = document.createElement("div");
    feedbackOverlay.className = "overlay feedback-overlay";
    document.body.appendChild(feedbackOverlay);
  }

  // Hide feedback container initially
  if (feedbackContainer) {
    feedbackContainer.style.display = "none";
  }

  // Function to show feedback container
  function showFeedbackContainer() {
    if (feedbackContainer) {
      // Update session details
      // Get the current timer value and points
      const timerText = document.querySelector(".timer-text").textContent;
      const pointsText = document
        .querySelector(".points-text")
        .textContent.split(" ")[0];

      // Update the feedback container with current values
      sessionDurationText.textContent = timerText;
      pointsEarnedText.textContent = pointsText;

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

  // Function to hide feedback container
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

  // Modify the confirmEndButton click event to show feedback after ending the session
  if (confirmEndButton) {
    // Store the original click event handler
    const originalClickHandler = confirmEndButton.onclick;

    // Replace with new handler that shows feedback
    confirmEndButton.onclick = function (event) {
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

      // End the timer in background
      const currentUser = users ? users.user1 : null;
      endTimer(currentUser);
    };
  }

  // Add click event to the "Submit Feedback" and "Close Session" buttons
  const submitButton = document.getElementById("submit");
  const closeButton = document.getElementById("close");

  if (submitButton) {
    submitButton.addEventListener("click", function () {
      // Here you would handle submitting the feedback to your backend
      showToast("Feedback submitted successfully!", "success");
      hideFeedbackContainer();
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", function () {
      hideFeedbackContainer();
    });
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

document.getElementById("backButton").addEventListener("click", function () {
  history.back();
});

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
  function addFiles(files) {
    Array.from(files).forEach((file) => {
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: Date.now(),
        file: file, // Store the actual file object
      };
      uploadedFiles.push(fileData);
    });

    // Show success toast
    showToast(`${files.length} file(s) uploaded successfully!`, "success");
    updateFileList();
  }

  // Remove file
  window.removeFile = function (index) {
    const fileName = uploadedFiles[index].name;
    uploadedFiles.splice(index, 1);
    updateFileList();
    showToast(`${fileName} removed`, "info");
  };

  // Download file
  window.downloadFile = function (index) {
    const fileData = uploadedFiles[index];
    const url = URL.createObjectURL(fileData.file);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileData.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloading ${fileData.name}`, "info");
  };

  // Toast notification function (if not already defined)
  function showToast(message, type = "info") {
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

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
  }

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

document.addEventListener('DOMContentLoaded', () => {
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
          ease: "back.out(1.2)"
        })
        
        // Animate card header
        .from(".card-header", {
          opacity: 0,
          y: -20,
          stagger: 0.1,
          ease: "power2.out",
        }, "-=0.6")
        
        // Animate timer display
        .from(".timer-display", {
          opacity: 0,
          y: -30,
          scale: 0.9,
          duration: 0.7,
          ease: "back.out(1.3)",
        }, "-=0.5")
        
        // Animate user profiles from opposite sides
        .from(".user-profile:nth-child(1)", {
          opacity: 0,
          x: -80,
          duration: 0.8,
          ease: "power3.out",
        }, "-=0.4")
        .from(".user-profile:nth-child(2)", {
          opacity: 0,
          x: 80,
          duration: 0.8,
          ease: "power3.out",
        }, "-=0.8")
        
        // Animate timer controls
        .from(".timer-controls", {
          opacity: 0,
          y: 30,
          stagger: 0.1,
          duration: 0.5,
          ease: "back.out(1.5)",
        }, "-=0.5");
    });






    