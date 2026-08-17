const greeting = document.getElementById('greeting');
const lead = document.getElementById('lead');
const logoutBtn = document.getElementById('logout-btn');

async function checkSession() {
  try {
    const res = await fetch('/bfar-portal/me.php', { credentials: 'include' });
    if (!res.ok) {
      window.location.href = '/bfar-portal/index.html';
      return;
    }
    const data = await res.json();
    greeting.textContent = `Welcome, ${data.user.fullname || data.user.email}`;
    lead.textContent = `Signed in as ${data.user.email}. Your session is a signed token in an httpOnly cookie — passwords are never stored in plain text.`;
  } catch (err) {
    lead.textContent = 'Could not reach the server.';
  }
}

logoutBtn.addEventListener('click', async () => {
  await fetch('/bfar-portal/logout.php', { method: 'POST', credentials: 'include' });
  window.location.href = '/bfar-portal/index.html';
});

checkSession();
