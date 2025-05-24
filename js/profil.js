//skills
document.addEventListener('DOMContentLoaded', () => {
function createSubjectCard(subject) {
  const card = document.createElement('div');
  card.className = 'subject-card';
  card.textContent = subject;
  return card;
}
/* ---------- helper to add <option> tags ---------- */
function populateSkillSelect(teaching = []) {
  const select = document.getElementById('selectedSkill');

  // wipe any previous options except the hidden placeholder
  select.querySelectorAll('option:not([disabled])').forEach(o => o.remove());

  teaching.forEach(skill => {
    const opt  = document.createElement('option');
    opt.value  = skill;   // submit exactly this skillName later
    opt.textContent = skill;
    select.appendChild(opt);
  });
}

/* ---------- render arrays returned by the API -------- */
function renderSkillCards({ teaching = [], learning = [] }) {
  // clear any old cards
  const teachingContainer = document.getElementById('teachingSubjects');
  const learningContainer = document.getElementById('learningSubjects');
  teachingContainer.innerHTML = '';
  learningContainer.innerHTML = '';

  teaching.forEach(sub => teachingContainer.appendChild(createSubjectCard(sub)));
  learning.forEach(sub => learningContainer.appendChild(createSubjectCard(sub)));
  // populate the select box with skills to teach
  populateSkillSelect(teaching);
}



async function loadProfile() {
  try {
    const userId = localStorage.getItem('viewUserId');

    const resSkills = await fetch(`http://localhost:80/api/skill/skills/${userId}`);
    const skills    = await resSkills.json();   
    renderSkillCards(skills);

    
  } catch (err) {
    console.error('Profile load failed', err);
  }
}

     loadProfile();
     

});

//comments

    

  // 1. Get viewUserId from localStorage and set it as data attribute
  const viewUserId = localStorage.getItem('viewUserId');
  const commentBoxWrapper = document.getElementById('commentBoxWrapper');
  if (viewUserId && commentBoxWrapper) {
    commentBoxWrapper.dataset.receiverId = viewUserId;
  }

  const commentBox = document.getElementById('commentBox');
  const starSpans = document.querySelectorAll('.star-rating span');
  const sendButton = document.getElementById('sendComment');
  const cancelButton = document.getElementById('cancelComment');
  const commentsList = document.getElementById('commentsList');
  const commentCountSpan = document.getElementById('commentCount');

  let selectedRating = 0;

  // Star rating click logic
  starSpans.forEach((star, index) => {
    star.addEventListener('click', () => {
      selectedRating = index + 1;
      updateStarDisplay();
    });
  });

  function updateStarDisplay() {
    starSpans.forEach((star, index) => {
      star.textContent = index < selectedRating ? '★' : '☆';
    });
  }

  // Cancel button clears comment and resets stars
  cancelButton.addEventListener('click', () => {
    commentBox.value = '';
    selectedRating = 0;
    updateStarDisplay();
  });

  // Send comment
  sendButton.addEventListener('click', async () => {
    const comment = commentBox.value.trim();
    const receiver_id = commentBoxWrapper.dataset.receiverId;
    const token = localStorage.getItem('token');

    if (!comment || selectedRating === 0) {
      alert('Please enter a comment and select a rating.');
      return;
    }

    try {
      const res = await fetch('http://localhost:80/api/comment/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ receiver_id, comment, rating: selectedRating })
      });

      const data = await res.json();
      if (res.ok) {
        location.reload();
        commentBox.value = '';
        selectedRating = 0;
        updateStarDisplay();
      } else {
        alert(data.error || 'Failed to send comment.');
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Delete comment
  async function deleteComment(commentId) {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:80/api/comment/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();
      if (res.ok) {
       location.reload();
        
      } else {
        alert(data.error || 'Failed to delete comment.');
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Load comments for receiver
  async function loadComments() {
    const receiver_id = localStorage.getItem('viewUserId');
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:80/api/comment/comments/${receiver_id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const comments = await res.json();
      const currentUserId = parseJwt(token).ID_Users;

      commentsList.innerHTML = '';
      commentCountSpan.textContent = comments.length;
      function timeAgo(date) {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const unit in intervals) {
    const value = Math.floor(seconds / intervals[unit]);
    if (value >= 1) {
      return `${value} ${unit}${value > 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
}


comments.forEach(comment => {
  const sender = comment.sender || {};
  const senderName = sender.Users_name
    ? `${sender.first_name} ${sender.last_name}`
    : 'Anonymous';

  const avatarUrl = sender.profile_picture || 'image/profil.jpg';
  const createdAt = comment.createdAt ? new Date(comment.createdAt) : new Date();
  const div = document.createElement('div');
  div.classList.add('comment');
  div.dataset.id = comment.id;
  div.innerHTML = `
    <img class="avatar" src="${avatarUrl}" alt="Avatar">
    <div class="comment-content">
      <span class="username">${senderName}</span> • 
      <span class="time">${timeAgo(createdAt)}</span>
      <p>${comment.comment}</p>
      <div>Rating: ${'★'.repeat(Math.round(comment.rating))}${'☆'.repeat(5 - Math.round(comment.rating))}</div>
      ${comment.sender_id === currentUserId ? `<button onclick="deleteComment(${comment.id})">🗑 Delete</button>` : ''}
    </div>
  `;
  
console.log('sender:', sender);
console.log('avatarUrl:', sender);

  commentsList.appendChild(div);
});


    } catch (err) {
      console.error(err);
    }
  
  }


  // JWT decode helper to get current user ID
  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch (e) {
      return {};
    }
  }

  // Init on page load
  window.addEventListener('DOMContentLoaded', loadComments);


   // Animation
   window.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.zoom-in');
    elements.forEach(el => {
        el.classList.add('show');
    });
    async function loadCommentCount(receiverId) {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`http://localhost:80/api/comment/comments/count/${receiverId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      console.log('Comment count:', data.count);
      // Optionally update the UI
      document.getElementById('commentCount').textContent = data.count;
    } else {
      console.error('Failed to fetch comment count:', data.error);
    }
  } catch (err) {
    console.error('Error fetching comment count:', err);
  }
}

});


//pop up
function openModal() {
  document.getElementById('myModal').style.display = 'flex';
  setTimeout(() => {
    document.querySelector('.modal-content').classList.add('show');
  }, 10);
}

function closeModal() {
  document.getElementById('myModal').style.display = 'none';
  document.querySelector('.modal-content').classList.remove('show');
}

// Optionally: fermer en cliquant à l'extérieur
window.onclick = function(e) {
  if (e.target.id === "myModal") {
    closeModal();
  }
}

  
 





  //informations 
   
  
function setText(id, txt) {
  const el = document.getElementById(id);
  if (el) el.textContent = txt;
}
function fillStars(rating) {
  const stars = document.querySelectorAll('.rating-stars i');
  stars.forEach((star, index) => {
    const starValue = index + 1;
    if (rating >= starValue) {
      star.classList.add('filled');  // full star
      star.classList.remove('fa-star-half-alt');
      star.classList.remove('fa-star'); 
      star.classList.add('fa-star'); 
    } else if (rating >= starValue - 0.5) {
      star.classList.add('filled', 'fa-star-half-alt');  // half star
      star.classList.remove('fa-star');
    } else {
      star.classList.remove('filled', 'fa-star-half-alt');
      star.classList.add('fa-star');  // empty star
    }
  });
}

async function loadProfile() {
  /* ---- read id from localStorage ---- */
  const userid = localStorage.getItem('viewUserId');


  try {
    const resp = await fetch(`http://localhost:80/api/user/profile/${userid}`);
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const u = await resp.json();

    /* ---- fill the DOM ---- */
    document.getElementById('userImg').src = u.avatarUrl || 'image/profil.jpg';

    setText('userRealName', `Name: ${u.firstName} ${u.lastName}`);
    setText('userName',     `User name: ${u.username}`);
    setText('userAge',      `Age: ${u.age}`);
    setText('userAbout',    u.about ?? '—');
    

    /* rating */
    document.querySelector('.rating-number').textContent =
        (u.rating ?? 0).toFixed(1);
        fillStars(u.rating );

    /* contacts */
    document.querySelector('.icon-discord').href  =
        u.discord  ? `https://discord.com/users/${u.discord}` : '#';
    document.querySelector('.icon-telegram').href =
        u.telegram ? `https://t.me/${u.telegram}`             : '#';

   const gmailAnchor = document.querySelector('.icon-gmail');
   if (u.email) {
    gmailAnchor.href =
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(u.email)}`;
   } else {
   gmailAnchor.href = '#';
  }
  } catch (err) {
    console.error(err);
    setText('userAbout', 'Error loading profile.');
  }
}

document.addEventListener('DOMContentLoaded', loadProfile);




// requesrt 
document.getElementById('exchangeForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // values from the modal
  const skillName = document.getElementById('selectedSkill').value;
  const message   = document.getElementById('message').value.trim();
  const duration  = parseInt(document.getElementById('timeInput').value, 10);

  // IDs & token stored in localStorage
  const reciver_id = localStorage.getItem('viewUserId');   // profile you’re viewing
  const token      = localStorage.getItem('token');    // JWT from login

  if (!reciver_id || !token) {
    alert('Missing receiver ID or auth token');
    return;
  }

  try {
    const res = await fetch('http://localhost:80/api/request/send-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reciver_id, skill: skillName, message, duration })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');

    alert('Request sent successfully!');
    closeModal();           // optional: hide modal
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});
