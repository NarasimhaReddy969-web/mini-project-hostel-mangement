// Check authentication
const currentUser = JSON.parse(localStorage.getItem("currentUser"))
if (!currentUser) {
  window.location.href = "index.html"
}

// Set user welcome message
document.getElementById("userWelcome").textContent = `Welcome, ${currentUser.name}`

// Add role-based styling
document.body.classList.add(currentUser.role)

// Navigation function
function navigateTo(page) {
  window.location.href = page
}

// Logout function
function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
}

// Hide admin-only features for non-admin users
if (currentUser.role !== "admin") {
  const adminElements = document.querySelectorAll(".admin-only")
  adminElements.forEach((element) => {
    element.style.display = "none"
  })
}
