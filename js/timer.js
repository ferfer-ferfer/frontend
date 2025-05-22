document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const timerText = document.querySelector('.timer-text');
    const pointsText = document.querySelector('.points-text');
    const user1Button = document.getElementById('user1-button');
    const user2Button = document.getElementById('user2-button');
    const user1ReadyIndicator = document.getElementById('user1-ready');
    const user2ReadyIndicator = document.getElementById('user2-ready');
    const startButton = document.getElementById('start-button');
    const pauseButton = document.getElementById('pause-button');
    const resumeButton = document.getElementById('resume-button');
    const endButton = document.getElementById('end-button');

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
            id: 'user1',
            name: 'Bensalah Abderrahmane',
            role: 'teacher',
            element: user1Button,
            indicator: user1ReadyIndicator,
            isReady: false
        },
        user2: {
            id: 'user2',
            name: 'Abderrahmane Bn',
            role: 'learner',
            element: user2Button,
            indicator: user2ReadyIndicator,
            isReady: false
        }
    };
    
    // Current user simulation (in a real app this would be determined by auth)
    const currentUser = users.user1; // For demo purposes, assume we're user1
    const otherUser = users.user2;   // The other user

    // Format time to display as mm:ss
    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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
            showToast('Timer started!', 'success');
            
            // Update UI
            startButton.style.display = 'none';
            pauseButton.style.display = 'inline-flex';
            endButton.style.display = 'inline-flex';
            user1Button.style.display = 'none';
            user2Button.style.display = 'none';
            
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
            
            // Show different toast messages based on who initiated the pause
            if (initiatingUser) {
                showToast(`${initiatingUser.name} paused the timer. Both users need to resume.`, 'info');
                
                // Notify other user
                notifyOtherUser(`${initiatingUser.name} has paused the session`, 'warning');
            } else {
                showToast('Timer paused! Both users need to resume.', 'info');
            }
            
            // Update UI
            pauseButton.style.display = 'none';
            resumeButton.style.display = 'inline-flex';
            user1Button.style.display = 'inline-flex';
            user2Button.style.display = 'inline-flex';
            user1Button.textContent = 'Ready to Resume';
            user2Button.textContent = 'Ready to Resume';
            user1Button.dataset.action = 'resume';
            user2Button.dataset.action = 'resume';
            user1ReadyIndicator.textContent = 'Not Ready';
            user2ReadyIndicator.textContent = 'Not Ready';
            user1ReadyIndicator.classList.remove('is-ready');
            user2ReadyIndicator.classList.remove('is-ready');
            
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
            showToast('Timer resumed!', 'success');
            
            // Update UI
            resumeButton.style.display = 'none';
            pauseButton.style.display = 'inline-flex';
            user1Button.style.display = 'none';
            user2Button.style.display = 'none';
            
            // Start the interval
            intervalId = setInterval(() => {
                seconds++;
                updateTimerDisplay();
            }, 1000);
        }
    }

    // End the timer
    function endTimer(initiatingUser) {
        if (isRunning) {
            isRunning = false;
            isPaused = false;
            users.user1.isReady = false;
            users.user2.isReady = false;
            const points = Math.floor(seconds / 2);
            
            if (initiatingUser) {
                showToast(`${initiatingUser.name} ended the session! Both users earned ${points} points.`, 'success');
                
                // Notify other user
                notifyOtherUser(`${initiatingUser.name} has ended the session. You earned ${points} points.`, 'info');
            } else {
                showToast(`Session ended! Both users earned ${points} points.`, 'success');
            }
            
            // Reset UI to initial state
            startButton.style.display = 'inline-flex';
            pauseButton.style.display = 'none';
            resumeButton.style.display = 'none';
            endButton.style.display = 'none';
            user1Button.style.display = 'inline-flex';
            user2Button.style.display = 'inline-flex';
            user1Button.textContent = 'Ready to Start';
            user2Button.textContent = 'Ready to Start';
            user1Button.dataset.action = 'start';
            user2Button.dataset.action = 'start';
            user1ReadyIndicator.textContent = 'Not Ready';
            user2ReadyIndicator.textContent = 'Not Ready';
            user1ReadyIndicator.classList.remove('is-ready');
            user2ReadyIndicator.classList.remove('is-ready');
            
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
        users[userId].indicator.textContent = 'Ready!';
        users[userId].indicator.classList.add('is-ready');
        users[userId].element.disabled = true;
        
        // Show different toasts based on the current state
        if (!isRunning) {
            showToast(`${users[userId].name} is ready to start!`, 'info');
            
            // If this is the current user, notify the other user
            if (users[userId] === currentUser) {
                notifyOtherUser(`${currentUser.name} is ready to start the session`, 'info');
            }
        } else if (isPaused) {
            showToast(`${users[userId].name} is ready to resume!`, 'info');
            
            // If this is the current user, notify the other user
            if (users[userId] === currentUser) {
                notifyOtherUser(`${currentUser.name} is ready to resume the session`, 'info');
            }
        }
        
        // Check if both users are ready
        if (users.user1.isReady && users.user2.isReady) {
            if (!isRunning) {
                startTimer();
            } else if (isPaused) {
                resumeTimer();
            }
        }
    }

    // Toast notification system
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        const container = document.getElementById('toast-container');
        container.appendChild(toast);
        
        // Auto-remove toast after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'toast-slide-out 0.3s ease-out forwards';
            setTimeout(() => {
                container.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // Simulate notifications to other user
    // In a real app, this would send a message through your backend
    function notifyOtherUser(message, type = 'info') {
        console.log(`[NOTIFICATION TO OTHER USER]: ${message}`);
        
        // Create a special notification toast to simulate the notification
        // that would be received by the other user
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<strong>📨 Notification sent:</strong><br>${message}`;
        
        const container = document.getElementById('toast-container');
        container.appendChild(toast);
        
        // Auto-remove toast after 4 seconds
        setTimeout(() => {
            toast.style.animation = 'toast-slide-out 0.3s ease-out forwards';
            setTimeout(() => {
                container.removeChild(toast);
            }, 300);
        }, 4000);
        
        // In a real system, this is where you would call an API to send
        // the notification to the other user via WebSockets, push notifications, etc.
    }

    // Event Listeners for user ready buttons
    user1Button.addEventListener('click', function() {
        const action = this.dataset.action;
        if (action === 'start' || action === 'resume') {
            setUserReady(users.user1);
        }
    });

    user2Button.addEventListener('click', function() {
        const action = this.dataset.action;
        if (action === 'start' || action === 'resume') {
            setUserReady(users.user2);
        }
    });

    // Start button event listener
    startButton.addEventListener('click', function() {
        if (users.user1.isReady && users.user2.isReady && !isRunning) {
            startTimer();
        } else {
            showToast('Both users must be ready to start the timer!', 'warning');
        }
    });

    // Pause button event listener
    pauseButton.addEventListener('click', function() {
        pauseTimer(currentUser);
    });
    
    // Resume button event listener
    resumeButton.addEventListener('click', function() {
        if (users.user1.isReady && users.user2.isReady && isPaused) {
            resumeTimer();
        } else {
            showToast('Both users must be ready to resume the timer!', 'warning');
        }
    });
    
    // End button event listener
    endButton.addEventListener('click', function() {
        endTimer(currentUser);
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
    startUserReadyObserver.observe(user1ReadyIndicator, { attributes: true, childList: true });
    startUserReadyObserver.observe(user2ReadyIndicator, { attributes: true, childList: true });
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
    window.addEventListener("storage", function(event) {
        if (event.key === "theme") {
            applyTheme();
        }
    });
});