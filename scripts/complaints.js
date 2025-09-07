// Check authentication
const currentUser = JSON.parse(localStorage.getItem("currentUser"))
if (!currentUser) {
  window.location.href = "index.html"
}

// Mock data
let complaints = [
  {
    id: 1,
    studentId: "STU001",
    studentName: "John Doe",
    category: "room",
    priority: "high",
    title: "AC not working",
    description: "The air conditioner in room 102 has stopped working. It's very hot and uncomfortable.",
    status: "in-progress",
    dateCreated: "2024-01-10T09:00:00",
    dateResolved: null,
    assignedTo: "Maintenance Team",
  },
  {
    id: 2,
    studentId: "STU002",
    studentName: "Jane Smith",
    category: "mess",
    priority: "medium",
    title: "Food quality issue",
    description: "The food served yesterday was not fresh and many students complained about stomach issues.",
    status: "resolved",
    dateCreated: "2024-01-12T14:30:00",
    dateResolved: "2024-01-13T10:00:00",
    assignedTo: "Mess Manager",
  },
  {
    id: 3,
    studentId: "STU003",
    studentName: "Mike Johnson",
    category: "maintenance",
    priority: "low",
    title: "Broken window",
    description: "The window in the common room is cracked and needs replacement.",
    status: "pending",
    dateCreated: "2024-01-14T16:45:00",
    dateResolved: null,
    assignedTo: null,
  },
  {
    id: 4,
    studentId: "STU004",
    studentName: "Sarah Wilson",
    category: "security",
    priority: "high",
    title: "Suspicious activity",
    description: "Noticed unknown persons loitering around the hostel premises late at night.",
    status: "resolved",
    dateCreated: "2024-01-11T22:15:00",
    dateResolved: "2024-01-12T08:00:00",
    assignedTo: "Security Team",
  },
  {
    id: 5,
    studentId: "STU005",
    studentName: "David Brown",
    category: "room",
    priority: "medium",
    title: "Water leakage",
    description: "There is water leakage from the ceiling in room 202. It's getting worse during rain.",
    status: "in-progress",
    dateCreated: "2024-01-13T11:20:00",
    dateResolved: null,
    assignedTo: "Plumbing Team",
  },
]

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  displayComplaints()
  updateStats()
})

// Display complaints
function displayComplaints() {
  const complaintsGrid = document.getElementById("complaintsGrid")
  const filteredComplaints = filterComplaintsData()

  complaintsGrid.innerHTML = ""

  filteredComplaints.forEach((complaint) => {
    const complaintCard = document.createElement("div")
    complaintCard.className = `complaint-card ${complaint.priority}-priority`
    complaintCard.onclick = () => showComplaintDetails(complaint.id)

    complaintCard.innerHTML = `
            <div class="complaint-header">
                <div class="complaint-title">${complaint.title}</div>
            </div>
            <div class="complaint-meta">
                <span class="status-badge status-${complaint.status}">${complaint.status}</span>
                <span class="status-badge">${complaint.category}</span>
                <span class="status-badge">${complaint.priority} priority</span>
            </div>
            <div class="complaint-description">${complaint.description}</div>
            <div class="complaint-footer">
                <small>By: ${complaint.studentName} | ${formatDateTime(complaint.dateCreated)}</small>
                ${complaint.assignedTo ? `<br><small>Assigned to: ${complaint.assignedTo}</small>` : ""}
            </div>
        `

    complaintsGrid.appendChild(complaintCard)
  })
}

// Filter complaints based on category, status, and priority
function filterComplaintsData() {
  const categoryFilter = document.getElementById("categoryFilter").value
  const statusFilter = document.getElementById("statusFilter").value
  const priorityFilter = document.getElementById("priorityFilter").value

  return complaints.filter((complaint) => {
    const categoryMatch = !categoryFilter || complaint.category === categoryFilter
    const statusMatch = !statusFilter || complaint.status === statusFilter
    const priorityMatch = !priorityFilter || complaint.priority === priorityFilter
    return categoryMatch && statusMatch && priorityMatch
  })
}

// Filter complaints (called by filter dropdowns)
function filterComplaints() {
  displayComplaints()
}

// Update statistics
function updateStats() {
  const totalComplaints = complaints.length
  const pendingComplaints = complaints.filter((c) => c.status === "pending" || c.status === "in-progress").length
  const resolvedComplaints = complaints.filter((c) => c.status === "resolved").length

  document.getElementById("totalComplaints").textContent = totalComplaints
  document.getElementById("pendingComplaints").textContent = pendingComplaints
  document.getElementById("resolvedComplaints").textContent = resolvedComplaints
}

// Show complaint registration modal
function showComplaintModal() {
  document.getElementById("complaintModal").style.display = "block"
}

// Handle complaint registration form
document.getElementById("complaintForm").addEventListener("submit", function (e) {
  e.preventDefault()

  const category = document.getElementById("complaintCategory").value
  const priority = document.getElementById("priority").value
  const title = document.getElementById("complaintTitle").value
  const description = document.getElementById("complaintDescription").value

  const newComplaint = {
    id: complaints.length + 1,
    studentId: currentUser.username,
    studentName: currentUser.name,
    category: category,
    priority: priority,
    title: title,
    description: description,
    status: "pending",
    dateCreated: new Date().toISOString(),
    dateResolved: null,
    assignedTo: null,
  }

  complaints.push(newComplaint)

  // Reset form and close modal
  this.reset()
  closeModal("complaintModal")

  // Refresh display
  displayComplaints()
  updateStats()

  alert("Complaint registered successfully! You will be notified once it's assigned.")
})

// Show complaint details modal
function showComplaintDetails(complaintId) {
  const complaint = complaints.find((c) => c.id === complaintId)
  if (complaint) {
    const modal = document.getElementById("complaintDetailsModal")
    const content = document.getElementById("complaintDetailsContent")

    content.innerHTML = `
            <h2>Complaint Details</h2>
            <div class="complaint-detail-item">
                <strong>Title:</strong> ${complaint.title}
            </div>
            <div class="complaint-detail-item">
                <strong>Category:</strong> ${complaint.category}
            </div>
            <div class="complaint-detail-item">
                <strong>Priority:</strong> <span class="status-badge">${complaint.priority}</span>
            </div>
            <div class="complaint-detail-item">
                <strong>Status:</strong> <span class="status-badge status-${complaint.status}">${complaint.status}</span>
            </div>
            <div class="complaint-detail-item">
                <strong>Student:</strong> ${complaint.studentName} (${complaint.studentId})
            </div>
            <div class="complaint-detail-item">
                <strong>Date Created:</strong> ${formatDateTime(complaint.dateCreated)}
            </div>
            ${
              complaint.assignedTo
                ? `
                <div class="complaint-detail-item">
                    <strong>Assigned To:</strong> ${complaint.assignedTo}
                </div>
            `
                : ""
            }
            ${
              complaint.dateResolved
                ? `
                <div class="complaint-detail-item">
                    <strong>Date Resolved:</strong> ${formatDateTime(complaint.dateResolved)}
                </div>
            `
                : ""
            }
            <div class="complaint-detail-item">
                <strong>Description:</strong>
                <p style="margin-top: 0.5rem; padding: 1rem; background: #f8f9fa; border-radius: 5px;">${complaint.description}</p>
            </div>
            ${
              currentUser.role === "admin" || currentUser.role === "warden"
                ? `
                <div class="complaint-actions" style="margin-top: 2rem; display: flex; gap: 1rem;">
                    ${
                      complaint.status === "pending"
                        ? `
                        <button class="primary-btn" onclick="assignComplaint(${complaint.id})">Assign</button>
                    `
                        : ""
                    }
                    ${
                      complaint.status === "in-progress"
                        ? `
                        <button class="primary-btn" onclick="resolveComplaint(${complaint.id})">Mark Resolved</button>
                    `
                        : ""
                    }
                    <button class="btn-danger" onclick="deleteComplaint(${complaint.id})">Delete</button>
                </div>
            `
                : ""
            }
        `

    modal.style.display = "block"
  }
}

// Assign complaint (admin/warden only)
function assignComplaint(complaintId) {
  const complaint = complaints.find((c) => c.id === complaintId)
  if (complaint) {
    const assignTo = prompt("Assign to (team/person):")
    if (assignTo) {
      complaint.assignedTo = assignTo
      complaint.status = "in-progress"

      closeModal("complaintDetailsModal")
      displayComplaints()
      updateStats()

      alert(`Complaint assigned to ${assignTo} successfully!`)
    }
  }
}

// Resolve complaint (admin/warden only)
function resolveComplaint(complaintId) {
  const complaint = complaints.find((c) => c.id === complaintId)
  if (complaint) {
    complaint.status = "resolved"
    complaint.dateResolved = new Date().toISOString()

    closeModal("complaintDetailsModal")
    displayComplaints()
    updateStats()

    alert("Complaint marked as resolved!")
  }
}

// Delete complaint (admin/warden only)
function deleteComplaint(complaintId) {
  if (confirm("Are you sure you want to delete this complaint?")) {
    complaints = complaints.filter((c) => c.id !== complaintId)

    closeModal("complaintDetailsModal")
    displayComplaints()
    updateStats()

    alert("Complaint deleted successfully!")
  }
}

// Utility function
function formatDateTime(dateTimeString) {
  return new Date(dateTimeString).toLocaleString()
}

// Close modal
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none"
}

// Navigation functions
function navigateTo(page) {
  window.location.href = page
}

function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
}
