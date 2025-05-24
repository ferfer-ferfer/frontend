
document.addEventListener("DOMContentLoaded", function () {
  // Get all dropdown containers
  const containers = document.querySelectorAll(".container");

  // Add click listeners to all containers
  containers.forEach((container) => {
    const icon = container.querySelector(".icon");
    const list = container.querySelector(".list");

    if (icon && list) {
      // Set initial state for GSAP animations
      gsap.set(list, {
        opacity: 0,
        y: -20,
        scale: 0.95,
        transformOrigin: "top right",
      });

      icon.addEventListener("click", function (e) {
        e.stopPropagation();

        // Close all other open dropdowns
        containers.forEach((otherContainer) => {
          if (
            otherContainer !== container &&
            otherContainer.classList.contains("active")
          ) {
            // Animate closing of other dropdowns
            const otherList = otherContainer.querySelector(".list");
            gsap.to(otherList, {
              opacity: 0,
              y: -20,
              scale: 0.95,
              duration: 0.25,
              ease: "power2.out",
              onComplete: () => {
                otherContainer.classList.remove("active");
              },
            });
          }
        });

        // Toggle current dropdown with animation
        if (!container.classList.contains("active")) {
          // Opening animation
          container.classList.add("active");
          gsap.to(list, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "back.out(1.2)",
          });
        } else {
          // Closing animation
          gsap.to(list, {
            opacity: 0,
            y: -20,
            scale: 0.95,
            duration: 0.25,
            ease: "power2.in",
            onComplete: () => {
              container.classList.remove("active");
            },
          });
        }
      });
    }
  });

  // Close dropdowns when clicking outside with animation
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".container")) {
      containers.forEach((container) => {
        if (container.classList.contains("active")) {
          const list = container.querySelector(".list");
          gsap.to(list, {
            opacity: 0,
            y: -20,
            scale: 0.95,
            duration: 0.25,
            ease: "power2.in",
            onComplete: () => {
              container.classList.remove("active");
            },
          });
        }
      });
    }
  });

  // Notification functionality
  const markAllReadBtn = document.querySelector(".mark-all-read");
  if (markAllReadBtn) {
    markAllReadBtn.addEventListener("click", function (e) {
      e.stopPropagation();

      // Remove unread class and notification dots with animation
      const unreadItems = document.querySelectorAll(".unread");
      unreadItems.forEach((item, index) => {
        const dot = item.querySelector(".notification-dot");
        if (dot) {
          // Animate the dot disappearing
          gsap.to(dot, {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            delay: index * 0.05,
            ease: "power2.in",
            onComplete: () => {
              dot.style.display = "none";
              item.classList.remove("unread");
            },
          });
        } else {
          item.classList.remove("unread");
        }
      });

      // Update badge with animation
      const badge = document.querySelector(".notification-icon .badge");
      if (badge) {
        gsap.to(badge, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            badge.style.display = "none";
          },
        });
      }
    });
  }

  // Search suggestions animation
  const searchInput = document.querySelector('input[type="search"]');
  const suggestionTags = document.querySelectorAll(".suggestion-tag");

  if (searchInput && suggestionTags.length) {
    suggestionTags.forEach((tag, index) => {
      tag.addEventListener("click", function () {
        // Add a small bounce animation when clicking a tag
        gsap.to(tag, {
          scale: 1.1,
          duration: 0.2,
          ease: "power1.out",
          onComplete: () => {
            gsap.to(tag, {
              scale: 1,
              duration: 0.2,
              ease: "power1.in",
            });
            searchInput.value = tag.textContent;
            searchInput.focus();
          },
        });
      });

      // Add hover animations
      tag.addEventListener("mouseenter", () => {
        gsap.to(tag, {
          y: -3,
          duration: 0.2,
          ease: "power1.out",
        });
      });

      tag.addEventListener("mouseleave", () => {
        gsap.to(tag, {
          y: 0,
          duration: 0.2,
          ease: "power1.in",
        });
      });
    });
  }

  // Settings modal animations
  const modal = document.getElementById("modal");
  const settingBtn = document.getElementById("settingbtn");
  const closeBtn = document.getElementById("closeSettingsBtn");

  if (settingBtn && modal) {
    const settingsSidebar = modal.querySelector(".settings-sidebar");

    // Set initial state
    gsap.set(settingsSidebar, {
      opacity: 0,
      y: 30,
    });

    // Open modal with animation
    settingBtn.addEventListener("click", function () {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";

      gsap.to(settingsSidebar, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    });

    // Close modal with animation
    function closeModal() {
      gsap.to(settingsSidebar, {
        opacity: 0,
        y: 30,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          modal.classList.remove("active");
          document.body.style.overflow = "auto";
        },
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }

    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
});

//dark mode button
document.addEventListener("DOMContentLoaded", function () {
  const toggleCheckbox = document.getElementById("checkbox");
  const root = document.documentElement;

  // Load saved theme from localStorage or default to light
  const savedTheme = localStorage.getItem("theme") || "light";

  // Set initial theme
  root.setAttribute("data-theme", savedTheme);

  // Ensure checkbox matches the current theme (checked for dark, unchecked for light)
  toggleCheckbox.checked = savedTheme === "dark";

  // Toggle theme when checkbox is clicked
  toggleCheckbox.addEventListener("change", function () {
    const newTheme = toggleCheckbox.checked ? "dark" : "light";
    root.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });
});

// some loading animations cause why not ?

// Define the timeline globally but don't add animations yet
let masterTl;

document.addEventListener("DOMContentLoaded", function () {
  // Initialize the timeline
  masterTl = gsap.timeline({
    defaults: {
      duration: 0.7,
      ease: "power3.out",
      opacity: 0,
      stagger: 0.1,
    },
    paused: true, // Initialize as paused
  });

  // Add animations to the timeline
  masterTl
    .from(".logo", {
      y: -50,
      opacity: 0,
      ease: "power2.inOut",
    })
    .from(
      ".nav-right .container",
      {
        y: -50,
        opacity: 0,
        stagger: 0.2,
        ease: "power2.inOut",
      },
      "-=0.3"
    )
    .from(
      ".secondhdr .container",
      {
        opacity: 0,
        x: -50,
        ease: "power2.inOut",
      },
      "-=0.5"
    )
    .from(
      ".secondhdr .wallet-container",
      {
        opacity: 0,
        x: 50,
        ease: "power2.inOut",
      },
      "-=0.3"
    )
    .from(
      ".search-container",
      {
        opacity: 0,
        y: 50,
        ease: "back.out(1.7)",
      },
      "-=0.5"
    )
    .from(
      ".search-suggestions .suggestion-tag",
      {
        opacity: 0,
        y: 50,
        scale: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)",
        
      },
      "-=0.4"
    );
});

window.addEventListener("load", () => {
  if (masterTl) {
    masterTl.play();
  }
});

//settings

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal");
  const settingBtn = document.getElementById("settingbtn");
  const closeBtn = document.getElementById("closeSettingsBtn");
  const cancelBtn = document.querySelector(".neutral-button");
  const themeDropdown = document.querySelector(".theme-setting");
  const difficultyDropdown = document.querySelector(".difficulty-setting");

  // Open modal
  settingBtn.addEventListener("click", function () {
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scrolling
  });

  // Close modal function
  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "auto"; // Enable scrolling
  }

  // Close modal with button
  closeBtn.addEventListener("click", closeModal);

  // Close modal with Cancel button
  cancelBtn.addEventListener("click", closeModal);

  // Close modal when clicking outside
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Prevent propagation for modal content
  const sidebar = document.querySelector(".settings-sidebar");
  sidebar.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  // Toggle theme options
  themeDropdown.addEventListener("click", function () {
    themeDropdown.classList.toggle("show-radio-options");

    // Close difficulty dropdown if open
    if (difficultyDropdown.classList.contains("show-radio-options")) {
      difficultyDropdown.classList.remove("show-radio-options");
    }
  });

  // Toggle difficulty options
  difficultyDropdown.addEventListener("click", function () {
    difficultyDropdown.classList.toggle("show-radio-options");

    // Close theme dropdown if open
    if (themeDropdown.classList.contains("show-radio-options")) {
      themeDropdown.classList.remove("show-radio-options");
    }
  });

  // Update theme selection
  const themeOptions = document.querySelectorAll('input[name="theme"]');
  themeOptions.forEach((option) => {
    option.addEventListener("change", function () {
      document.getElementById("themeDropdown").innerHTML =
        this.value.charAt(0).toUpperCase() +
        this.value.slice(1) +
        ' <i class="fa-solid fa-chevron-down"></i>';
    });
  });

  // Update difficulty selection
  const difficultyOptions = document.querySelectorAll(
    'input[name="difficulty"]'
  );
  difficultyOptions.forEach((option) => {
    option.addEventListener("change", function () {
      document.getElementById("difficultyDropdown").innerHTML =
        this.value.charAt(0).toUpperCase() +
        this.value.slice(1) +
        ' <i class="fa-solid fa-chevron-down"></i>';
    });
  });
});

// Search functionality

document.addEventListener("DOMContentLoaded", function () {
  const searchContainer = document.querySelector(".search-container");
  const searchInput = document.querySelector('input[type="search"]');
  const searchSuggestions = document.querySelector(".search-suggestions");
  const mainContent = document.querySelector("main");
  const rightelement = document.querySelectorAll(".right-ele");
  const leftelement = document.querySelectorAll(".left-ele");
  const head2 = document.querySelector(".secondhdr");
  const suggestions = document.querySelectorAll(".suggestion-tag");

  const searchResultsContainer = document.createElement("div");
  searchResultsContainer.className = "search-results";
  searchResultsContainer.style.display = "none";
  mainContent.appendChild(searchResultsContainer);

  const backButton = document.createElement("button");
  backButton.className = "back-button";
  backButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i> <span class="back-text">Back</span>';
  backButton.style.display = "none";
  document.body.appendChild(backButton);

  let originalSearchPosition = {};
  let originalSearchStyles = {};
  let searchAnimationPlayed = false;
  const animationDuration = 0.7;
  

  function performSearchAnimation(callback) {
    if (searchAnimationPlayed) {
      if (callback) callback();
      return;
    }

    const searchContainerRect = searchContainer.getBoundingClientRect();
    const isMobile = window.innerWidth <= 768;

    originalSearchPosition = {
      top: searchContainerRect.top,
      left: searchContainerRect.left,
      width: searchContainerRect.width
    };

    originalSearchStyles = {
      position: searchContainer.style.position,
      top: searchContainer.style.top,
      left: searchContainer.style.left,
      width: searchContainer.style.width,
      transform: searchContainer.style.transform
    };

    searchContainer.style.position = "fixed";
    searchContainer.style.top = originalSearchPosition.top + "px";
    searchContainer.style.left = originalSearchPosition.left + "px";
    searchContainer.style.width = originalSearchPosition.width + "px";
    searchContainer.style.zIndex = "1000";
    searchContainer.style.transform = "none";

    const tl = gsap.timeline({
      onComplete: function () {
        if (callback) callback();
        searchAnimationPlayed = true;
      }
    });

    tl.to(rightelement, {
      x: 100,
      opacity: 0,
      ease: "power2.inOut",
      duration: 0.5,
      stagger: 0.2
    })
    .to(leftelement, {
      x: -100,
      opacity: 0,
      ease: "power2.inOut",
      duration: 0.5,
      stagger: 0.2
    }, "<")
    .to(suggestions, {
      opacity: 0,
      scale: 0.8,
      stagger: 0.1,
      duration: 0.2,
      ease: "power2.inOut",
      onComplete: () => {
        suggestions.forEach(tag => {
          tag.style.opacity = "1";
          tag.style.transform = "scale(1)";
        });
        searchSuggestions.style.display = "none";
      }
    }, "<");

    if (isMobile) {
      tl.to(searchContainer, {
        top: "15px",
        left: "70px",
        width: "calc(100% - 85px)",
        duration: 0.5,
        ease: "power2.inOut"
      }, "-=0.5");
    } else {
      tl.to(searchContainer, {
        top: "15px",
        left: "50%",
        xPercent: -50,
        duration: 0.5,
        ease: "power2.inOut"
      }, "-=0.5");
    }
    tl.to(mainContent, {
      zIndex: 2000,
      y: 0,
      ease: "power2.inOut",
      duration: 0.3
    }, "-=0.6");
    backButton.style.display = "flex";
    tl.fromTo(backButton, 
      { opacity: 0, x: -20, scale: 0.8 },
      { opacity: 1, x: 0, scale: 1, duration: 0.2, ease: "power2.inOut" },
      0.3
    );
  }

function createProfileCard(user) {
  const card = document.createElement("div");
  card.style.background = "#fff";
  card.style.padding = "20px";
  card.style.marginBottom = "20px";
  card.style.borderRadius = "15px";
  card.style.boxShadow = "0 2px 12px rgba(0, 0, 0, 0.1)";
  card.style.display = "flex";
  card.style.justifyContent = "space-between";
  card.style.alignItems = "flex-start";
  card.style.flexWrap = "wrap";
  card.style.maxWidth = "1000px";
  card.style.width = "100%";
  card.style.gap = "20px";

  // Add transition for smooth animation
  card.style.transition = "transform 0.3s ease, box-shadow 0.3s ease, margin 0.3s ease";

  // On mouse enter: scale up and add colored margin effect
  card.addEventListener("mouseenter", () => {
    card.style.transform = "scale(1.03)";
    card.style.boxShadow = "0 0 0 0.7px #6a42f1"; // purple outline effect
  });

  // On mouse leave: revert styles
  card.addEventListener("mouseleave", () => {
    card.style.transform = "scale(1)";
    card.style.marginBottom = "20px"; // original margin
    card.style.boxShadow = "0 2px 12px rgba(0, 0, 0, 0.1)"; // original shadow
  });

  // ...rest of your code remains unchanged

  // Left section (image and info)
  const left = document.createElement("div");
  left.style.display = "flex";
  left.style.alignItems = "center";
  left.style.gap = "15px";
  left.style.flex = "1";

  const img = document.createElement("img");
  img.src = user.image || "icons/profile.png";
  img.alt = `${user.firstName} ${user.lastName}`;
  img.style.width = "60px";
  img.style.height = "60px";
  img.style.borderRadius = "50%";
  img.style.objectFit = "cover";
  img.style.border = "2px solid #ddd";

  const info = document.createElement("div");

  const name = document.createElement("h3");
  name.textContent = `${user.firstName} ${user.lastName}`;
  name.style.margin = "0";
  name.style.fontSize = "1.2rem";
const stars = document.createElement("div");

stars.innerHTML = Array(5)
  .fill()
  .map((_, i) => {
    if (i < Math.floor(user.rating)) {
      return '<i class="fa-solid fa-star" style="color: gold;"></i>';
    } else if (i === Math.floor(user.rating) && user.rating % 1 >= 0.5) {
      return '<i class="fa-solid fa-star-half-stroke" style="color: gold;"></i>';
    } else {
      return '<i class="fa-regular fa-star" style="color: lightgray;"></i>';
    }
  })
  .join("");

stars.style.fontSize = "16px";
stars.style.margin = "5px 0";

  const ratingValue = document.createElement("span");
  ratingValue.textContent = user.rating.toFixed(1);
  ratingValue.style.marginLeft = "8px";
  ratingValue.style.fontWeight = "500";
  stars.appendChild(ratingValue);

  const experience = document.createElement("p");
  experience.textContent = `${user.experience || "N/A"} years experience`;
  experience.style.margin = "4px 0 0";
  experience.style.fontSize = "0.9rem";
  experience.style.color = "#555";

  info.appendChild(name);
  info.appendChild(stars);
  info.appendChild(experience);

  left.appendChild(img);
  left.appendChild(info);
  card.appendChild(left);

  // Skills
  const skillsContainer = document.createElement("div");
  skillsContainer.style.display = "flex";
  skillsContainer.style.flexWrap = "wrap";
  skillsContainer.style.gap = "10px";
  skillsContainer.style.marginTop = "10px";
  skillsContainer.style.width = "100%";

  user.skills.forEach((skill) => {
    const skillTag = document.createElement("span");
    skillTag.textContent = skill;
    skillTag.style.background = "#edf2f7";
    skillTag.style.padding = "6px 12px";
    skillTag.style.borderRadius = "12px";
    skillTag.style.fontSize = "0.85rem";
    skillTag.style.color = "#333";
    skillTag.style.fontWeight = "500";
    skillsContainer.appendChild(skillTag);
  });

  card.appendChild(skillsContainer);

  // Buttons
 const buttonGroup = document.createElement("div");
buttonGroup.style.display = "flex";
buttonGroup.style.gap = "12px";
buttonGroup.style.marginTop = "5px";
buttonGroup.style.marginLeft = "auto";

const contactBtn = document.createElement("button");
contactBtn.id = "contactBtn";
contactBtn.textContent = "Contact";
contactBtn.style.background = "#6a42f1";
contactBtn.style.color = "#fff";
contactBtn.style.padding = "10px 20px";
contactBtn.style.borderRadius = "8px";
contactBtn.style.border = "none";
contactBtn.style.cursor = "pointer";
contactBtn.style.fontWeight = "1rem";
contactBtn.style.outline = "none";
contactBtn.style.transition = "background 0.3s ease";

// Focus styles
contactBtn.addEventListener("focus", () => {
  contactBtn.style.boxShadow = "0 0 0 3px rgba(106, 66, 241, 0.6)";
});
contactBtn.addEventListener("blur", () => {
  contactBtn.style.boxShadow = "none";
});

// Hover styles
contactBtn.addEventListener("mouseenter", () => {
  contactBtn.style.background = "#8b6dfb"; // lighter purple
});
contactBtn.addEventListener("mouseleave", () => {
  contactBtn.style.background = "#6a42f1";
});

const viewBtn = document.createElement("button")
viewBtn.textContent = "View Profile";
viewBtn.style.background = "#6a42f1";
viewBtn.style.color = "#fff";
viewBtn.style.padding = "10px 20px";
viewBtn.style.borderRadius = "8px";
viewBtn.style.border = "none";
viewBtn.style.cursor = "pointer";
viewBtn.style.fontWeight = "1rem";
viewBtn.style.outline = "none";
viewBtn.style.transition = "background 0.3s ease";

// Focus styles
viewBtn.addEventListener("focus", () => {
  viewBtn.style.boxShadow = "0 0 0 3px rgba(106, 66, 241, 0.6)";
});
viewBtn.addEventListener("blur", () => {
  viewBtn.style.boxShadow = "none";
});

// Hover styles
viewBtn.addEventListener("mouseenter", () => {
  viewBtn.style.background = "#8b6dfb"; // lighter purple
});
viewBtn.addEventListener("mouseleave", () => {
  viewBtn.style.background = "#6a42f1";
});

// 👉 Click handler to store ID and redirect
viewBtn.addEventListener("click", () => {
  localStorage.setItem("viewUserId", user.id);
  window.location.href = "profil.html";
});
let dropdown = null;

contactBtn.addEventListener("click", () => {
  // Toggle existing dropdown


if (dropdown && dropdown.classList.contains("contact-info-dropdown")) {
  dropdown.remove();
// 👈 Reset original spacing when dropdown is removed
  return;
}

  // Create dropdown
  dropdown = document.createElement("div");
  dropdown.className = "contact-info-dropdown";
  dropdown.style.position = "absolute";
  dropdown.style.background = "#fff";
  dropdown.style.border = "1px solid #ccc";
  dropdown.style.borderRadius = "6px";
  dropdown.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
  dropdown.style.padding = "10px";
  dropdown.style.marginTop = "4px";
  dropdown.style.minWidth = "120px";
  dropdown.style.display = "flex";
  dropdown.style.gap = "10px";
  dropdown.style.justifyContent = "center";
  dropdown.style.zIndex = "1000";
  dropdown.style.marginTop = "6px";
  
  

  // Ensure parent is relatively positioned
  contactBtn.parentElement.style.position = "relative";
  dropdown.style.top = contactBtn.offsetHeight + 4 + "px";
  dropdown.style.left = "0";

  // Helper function for icons
  function createIconLink(href, iconSrc, alt) {
    const a = document.createElement("a");
    a.href = href;
    a.target = "_blank";
    a.style.width = "28px";
    a.style.height = "28px";

    const img = document.createElement("img");
    img.src = iconSrc;
    img.alt = alt;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";

    a.appendChild(img);
    return a;
  }

  // Add icons only if available
  let hasInfo = false;

  if (user.email) {
    const emailIcon = "https://cdn-icons-png.flaticon.com/512/561/561127.png";
    dropdown.appendChild(createIconLink(
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(user.email)}`,
  emailIcon,
  "Gmail"
));
    hasInfo = true;
  }
  if (user.discord) {
    const discordIcon = "https://cdn-icons-png.flaticon.com/512/2111/2111370.png";
    dropdown.appendChild(createIconLink(user.discord, discordIcon, "Discord"));
    hasInfo = true;
  }
  if (user.telegram) {
    const telegramIcon = "https://cdn-icons-png.flaticon.com/512/2111/2111646.png";
    dropdown.appendChild(createIconLink(`https://t.me/${user.telegram}`, telegramIcon, "Telegram"));
    hasInfo = true;
  }

  if (!hasInfo) {
    dropdown.textContent = "No contact information available.";
  }

  // Show the dropdown
  contactBtn.insertAdjacentElement("afterend", dropdown);
  card.style.marginBottom = "45px"; // Remove margin when dropdown is open

 
});




buttonGroup.appendChild(contactBtn);
buttonGroup.appendChild(viewBtn);
card.appendChild(buttonGroup);

  return card;
}





  // Function to revert to home view
  function revertToHomeView() {
    const tl = gsap.timeline();
    // Hide back button first
    tl
    .to(backButton, {
      opacity: 0,
      x: -20,
      scale: 0.8,
      duration: 0.3,
      onComplete: () => {
        backButton.style.display = "none";
        backButton.style.x = 0;
        backButton.style.scale = 1;
      }
    })

    // Hide search results with animation
    .to(searchResultsContainer, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      onComplete: () => {
        searchResultsContainer.style.display = "none";
        searchResultsContainer.style.marginTop = "0"; // Reset margin
      }
    }, "-=0.3");

    // Animate search container back to original position
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      gsap.to(searchContainer, {
        top: originalSearchPosition.top + "px",
        left: originalSearchPosition.left + "px",
        width: originalSearchPosition.width + "px",
        duration: 0.5,
        ease: "power2.inOut",
        clearProps: "all", // Clear all properties after animation
        onComplete: completeReturn
      });
    } else {
      gsap.to(searchContainer, {
        top: originalSearchPosition.top + "px",
        left: originalSearchPosition.left + "px",
        width: originalSearchPosition.width + "px",
        xPercent: 0, // Remove any percentage-based transforms
        duration: 0.5,
        ease: "power2.inOut",
        clearProps: "all", // Clear all properties after animation
        onComplete: completeReturn
      });
    }

    function completeReturn() {
      // Restore original styles completely
      for (const prop in originalSearchStyles) {
        searchContainer.style[prop] = originalSearchStyles[prop];
      }
    
      // Create a GSAP timeline
      const tl = gsap.timeline();
    
      // Add animations to the timeline
      tl.to(rightelement, {
        x: 0,
        opacity: 1,
        ease: "power2.inOut",
        duration: 0.5,
        stagger: 0.2
      })
      .to(leftelement, {
        x: 0,
        opacity: 1,
        ease: "power2.inOut",
        duration: 0.5,
        stagger: 0.2
      }, "<") // Use "<" to start this animation at the same time as the previous one
      .to(mainContent, {
        zIndex: 1,
        ease: "power2.inOut",
        duration: 0.5,
      }, "<") // Start this animation at the same time as the previous one
      .to(suggestions, {
        display: "flex",
        opacity: 1,
        scale: 1,
        stagger: 0.1,
        duration: 0.4,
        ease: "power2.inOut"
      }, "-=0.5"); 
    }

    // Clear search input
    searchInput.value = "";
    
    // Reset the animation played flag when returning to home
    searchAnimationPlayed = false;
  }

  async function fetchProfilesFromAPI(query) {
    try {
      const response = await fetch(`http://localhost:80/api/search/search?skill=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const users = await response.json();
      return users;
    } catch (err) {
      console.error("API fetch error:", err);
      return null;
    }
  }

 async function renderSearchResults(query) {
  // Clear previous results
  searchResultsContainer.innerHTML = "";

  // Fetch profiles
  const matchedProfiles = await fetchProfilesFromAPI(query);

  // If fetch failed or returned null
  if (!matchedProfiles) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = "Failed to fetch profiles. Please try again.";
    searchResultsContainer.appendChild(errorDiv);
    searchResultsContainer.style.display = "block";
    return;
  }

  // Show message if no results
  if (matchedProfiles.length === 0) {
    const noResults = document.createElement("div");
    noResults.className = "no-results";
    noResults.innerHTML = `
      <i class="fa-solid fa-search"></i>
      <h3>No profiles found for "${query}"</h3>
    `;
    searchResultsContainer.appendChild(noResults);
    searchResultsContainer.style.display = "block";
    return;
  }

  // Otherwise, create and append profile cards
  matchedProfiles.forEach(user => {
    const profileCard = createProfileCard(user);
    searchResultsContainer.appendChild(profileCard);
  });

  searchResultsContainer.style.display = "block";
}


  async function displaySearchResults(query) {
    await new Promise((resolve) => {
      performSearchAnimation(async () => {
        await renderSearchResults(query);
        resolve();
      });
    });
  }

  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && searchInput.value.trim() !== "") {
      displaySearchResults(searchInput.value.trim());
    }
  });

  backButton.addEventListener("click", revertToHomeView);
   

  

  suggestions.forEach((tag) => {
    tag.addEventListener("click", function () {
      gsap.to(tag, {
        scale: 1.1,
        duration: 0.2,
        ease: "power1.out",
        onComplete: () => {
          gsap.to(tag, {
            scale: 1,
            duration: 0.2,
            ease: "power1.in",
            onComplete: () => {
              searchInput.value = tag.textContent;
              displaySearchResults(tag.textContent);
            }
          });
        }
      });
    });
  });
});



// Sp points
document.addEventListener("DOMContentLoaded", () => {
  fetchUserBalance();
});
async function fetchUserBalance() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    return;
  }

  try {
    const response = await fetch("http://localhost:80/api/sp/balance", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Fetch error:", response.status, errorText);
      return;
    }

    const data = await response.json(); 
    console.log("Balance response:", data);

    const creditsSpan = document.querySelector(".credits");
    if (creditsSpan && data.spPoints !== undefined) {
      creditsSpan.textContent = `${data.spPoints.toLocaleString()} Credits`;
    }

  } catch (error) {
    console.error("Error fetching balance:", error);
  }
}


//profile
document.addEventListener("DOMContentLoaded", () => {

  loadUserProfile();
});

async function loadUserProfile() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    return;
  }

  try {
    const response = await fetch("http://localhost:80/api/user/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to load profile");

    const user = await response.json();

    // Update DOM elements
    const avatarImg = document.querySelector(".user-avatar img");
    const profileImg = document.querySelector(".profile-icon img");
    const userName = document.getElementById("username");
    const userEmail = document.getElementById("useremail");


    profileImg.src = user.profile_picture || "icons/profile.png";
    avatarImg.src = user.profile_picture || "icons/profile.png";
    userName.textContent = user.Users_name || `${user.first_name} ${user.last_name}`;
    userEmail.textContent = user.email || "No email";
  } catch (error) {
    console.error("Error loading profile:", error);
  }
}

//singup
document.addEventListener("DOMContentLoaded", () => {
  const signOutBtn = document.getElementById("signout");
  if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("viewUserId");
      window.location.href = "index.html"; 
    });
  }
});


//profile
document.addEventListener("DOMContentLoaded", () => {

  // Profile redirect logic
  const profileLink = document.getElementById("profile-link");
  if (profileLink) {
    profileLink.addEventListener("click", () => {
      window.location.href = "profil-user.html"; 
    });
  }
});
