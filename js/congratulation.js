// if no token dont acces 
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Not logged in, redirect to login page
        window.location.href = '/index.html';
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const continueBtn = document.querySelector(".continue-btn");

    if (!continueBtn) {
        console.error("Button not found");
        return;  // Stop if the button is not found
    }
    
    continueBtn.addEventListener("click", async function () {


        try {
            const res = await fetch('http://localhost:80/api/sp/complete-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({})
            });

            const data = await res.json();
            alert(data.message);

            if (res.ok) {
                window.location.href = "/home.html";
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Something went wrong. Try again.');
        }
    });
});
