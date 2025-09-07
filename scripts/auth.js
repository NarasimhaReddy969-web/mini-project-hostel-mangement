// Mock user data
const users = {
  admin: { password: "admin123", role: "admin", name: "Admin User" },
  student: { password: "student123", role: "student", name: "John Doe" },
  warden: { password: "warden123", role: "warden", name: "Warden Smith" },
  security: { password: "security123", role: "security", name: "Security Guard" },
}

// Check if user is already logged in
if (localStorage.getItem("currentUser")) {
  window.location.href = "dashboard.html"
}

// Login form handler
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const userType = document.getElementById("userType").value
  const username = document.getElementById("username").value
  const password = document.getElementById("password").value

  if (users[username] && users[username].password === password && users[username].role === userType) {
    // Store user session
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        username: username,
        role: userType,
        name: users[username].name,
      }),
    )

    // Redirect to dashboard
    window.location.href = "dashboard.html"
  } else {
    alert("Invalid credentials. Please check username, password, and user type.")
  }
})

// Logout function
function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
}

// Navigation function
function navigateTo(page) {
  window.location.href = page
}
