document.addEventListener("DOMContentLoaded", () => {
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]')
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Navbar scroll effect
  const navbar = document.querySelector(".landing-nav")
  let lastScrollY = window.scrollY

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY

    if (currentScrollY > 100) {
      navbar.style.background = "rgba(255, 255, 255, 0.98)"
      navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)"
    } else {
      navbar.style.background = "rgba(255, 255, 255, 0.95)"
      navbar.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)"
    }

    lastScrollY = currentScrollY
  })

  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe feature cards
  const featureCards = document.querySelectorAll(".feature-card")
  featureCards.forEach((card) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(30px)"
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(card)
  })

  // Mobile menu toggle
  const mobileToggle = document.querySelector(".mobile-menu-toggle")
  const navLinksContainer = document.querySelector(".nav-links")

  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      navLinksContainer.classList.toggle("active")
      mobileToggle.classList.toggle("active")
    })
  }

  // Parallax effect for hero background
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const heroImage = document.querySelector(".hero-image")
    if (heroImage) {
      heroImage.style.transform = `translateY(${scrolled * 0.5}px)`
    }
  })

  // Counter animation for stats
  const animateCounter = (element, target) => {
    let current = 0
    const increment = target / 100
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      element.textContent = Math.floor(current) + (target >= 1000 ? "K+" : target >= 100 ? "+" : "%")
    }, 20)
  }

  // Trigger counter animation when stats come into view
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const statNumber = entry.target.querySelector(".stat-number")
          const text = statNumber.textContent
          let target = Number.parseInt(text.replace(/[^\d]/g, ""))

          if (text.includes("K+")) target = target * 1000
          if (text.includes("%")) target = Number.parseFloat(text)

          animateCounter(statNumber, target)
          statsObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 },
  )

  const statItems = document.querySelectorAll(".stat-item")
  statItems.forEach((item) => statsObserver.observe(item))
})
