let currentStep = 1
const totalSteps = 3

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm")
  const passwordInput = document.getElementById("password")
  const confirmPasswordInput = document.getElementById("confirmPassword")

  // Password strength checker
  if (passwordInput) {
    passwordInput.addEventListener("input", checkPasswordStrength)
  }

  // Confirm password validation
  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener("input", validatePasswordMatch)
  }

  // Form submission
  if (form) {
    form.addEventListener("submit", handleFormSubmit)
  }

  // Auto-fill email display in step 3
  const emailInput = document.getElementById("email")
  if (emailInput) {
    emailInput.addEventListener("blur", function () {
      const emailDisplay = document.getElementById("emailDisplay")
      if (emailDisplay) {
        emailDisplay.textContent = this.value
      }
    })
  }
})

function nextStep() {
  if (validateCurrentStep()) {
    if (currentStep < totalSteps) {
      // Hide current step
      document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove("active")
      document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove("active")

      currentStep++

      // Show next step with animation
      setTimeout(() => {
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add("active")
        document.querySelector(`.step[data-step="${currentStep}"]`).classList.add("active")
      }, 150)

      // Special handling for step 3 (verification)
      if (currentStep === 3) {
        simulateEmailSend()
      }
    }
  }
}

function prevStep() {
  if (currentStep > 1) {
    // Hide current step
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove("active")
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove("active")

    currentStep--

    // Show previous step with animation
    setTimeout(() => {
      document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add("active")
      document.querySelector(`.step[data-step="${currentStep}"]`).classList.add("active")
    }, 150)
  }
}

function validateCurrentStep() {
  const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`)
  const requiredFields = currentStepElement.querySelectorAll("[required]")
  let isValid = true

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      field.style.borderColor = "var(--destructive)"
      isValid = false

      // Reset border color after animation
      setTimeout(() => {
        field.style.borderColor = ""
      }, 3000)
    } else {
      field.style.borderColor = "var(--primary)"
    }
  })

  // Additional validation for step 1
  if (currentStep === 1) {
    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirmPassword").value

    if (password !== confirmPassword) {
      document.getElementById("confirmPassword").style.borderColor = "var(--destructive)"
      showNotification("Passwords do not match!", "error")
      isValid = false
    }

    if (password.length < 8) {
      document.getElementById("password").style.borderColor = "var(--destructive)"
      showNotification("Password must be at least 8 characters long!", "error")
      isValid = false
    }
  }

  return isValid
}

function checkPasswordStrength() {
  const password = this.value
  const strengthBar = document.querySelector(".strength-bar::after") || document.querySelector(".strength-bar")
  const strengthText = document.querySelector(".strength-text")

  let strength = 0
  let strengthLabel = "Weak"
  let color = "var(--destructive)"

  // Check password criteria
  if (password.length >= 8) strength += 25
  if (/[a-z]/.test(password)) strength += 25
  if (/[A-Z]/.test(password)) strength += 25
  if (/[0-9]/.test(password)) strength += 25

  if (strength >= 75) {
    strengthLabel = "Strong"
    color = "var(--primary)"
  } else if (strength >= 50) {
    strengthLabel = "Medium"
    color = "var(--secondary)"
  }

  // Update strength indicator
  if (strengthBar) {
    strengthBar.style.setProperty("--strength-width", strength + "%")
    strengthBar.style.setProperty("--strength-color", color)
  }

  if (strengthText) {
    strengthText.textContent = `Password strength: ${strengthLabel}`
    strengthText.style.color = color
  }
}

function validatePasswordMatch() {
  const password = document.getElementById("password").value
  const confirmPassword = this.value

  if (password !== confirmPassword) {
    this.style.borderColor = "var(--destructive)"
  } else {
    this.style.borderColor = "var(--primary)"
  }
}

function simulateEmailSend() {
  // Simulate sending verification email
  showNotification("Verification code sent to your email!", "success")

  // Auto-fill verification code for demo (remove in production)
  setTimeout(() => {
    document.getElementById("verificationCode").value = "123456"
  }, 2000)
}

function resendCode() {
  showNotification("Verification code resent!", "success")
  // Auto-fill verification code for demo
  setTimeout(() => {
    document.getElementById("verificationCode").value = "123456"
  }, 1000)
}

function handleFormSubmit(e) {
  e.preventDefault()

  if (validateCurrentStep()) {
    // Simulate account creation
    showNotification("Account created successfully!", "success")

    // Redirect to login page after delay
    setTimeout(() => {
      window.location.href = "index.html"
    }, 2000)
  }
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message

  // Style the notification
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: var(--radius);
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
    `

  // Set background color based on type
  switch (type) {
    case "success":
      notification.style.background = "var(--primary)"
      break
    case "error":
      notification.style.background = "var(--destructive)"
      break
    default:
      notification.style.background = "var(--secondary)"
  }

  // Add to page
  document.body.appendChild(notification)

  // Remove after delay
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease-out"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Add CSS for notification animations
const style = document.createElement("style")
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .strength-bar::after {
        width: var(--strength-width, 0%);
        background: var(--strength-color, var(--destructive));
    }
`
document.head.appendChild(style)
