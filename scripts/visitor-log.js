// Check authentication
const currentUser = JSON.parse(localStorage.getItem("currentUser"))
if (!currentUser) {
  window.location.href = "index.html"
}

// Mock data
let visitors = [
  {
    id: 1,
    name: "Robert Johnson",
    phone: "9876543210",
    studentToMeet: "STU001",
    studentName: "John Doe",
    relation: "parent",
    purpose: "Monthly visit",
    checkIn: "2024-01-15T10:30:00",
    checkOut: "2024-01-15T14:30:00",
    status: "exited",
  },
  {
    id: 2,
    name: "Mary Smith",
    phone: "9876543211",
    studentToMeet: "STU002",
    studentName: "Jane Smith",
    relation: "parent",
    purpose: "Bring supplies",
    checkIn: "2024-01-15T11:00:00",
    checkOut: null,
    status: "inside",
  },
  {
    id: 3,
    name: "Tom Wilson",
    phone: "9876543212",
    studentToMeet: "STU003",
    studentName: "Mike Johnson",
    relation: "friend",
    purpose: "Social visit",
    checkIn: "2024-01-15T15:00:00",
    checkOut: "2024-01-15T17:00:00",
    status: "exited",
  },
  {
    id: 4,
    name: "Lisa Brown",
    phone: "9876543213",
    studentToMeet: "STU004",
    studentName: "Sarah Wilson",
    relation: "sibling",
    purpose: "Birthday celebration",
    checkIn: "2024-01-14T12:00:00",
    checkOut: "2024-01-14T18:00:00",
    status: "exited",
  },
  {
    id: 5,
    name: "David Davis",
    phone: "9876543214",
    studentToMeet: "STU005",
    studentName: "David Brown",
    relation: "parent",
    purpose: "Academic discussion",
    checkIn: "2024-01-15T09:00:00",
    checkOut: null,
    status: "inside",
  },
]

const students = [
  { id: "STU001", name: "John Doe" },
  { id: "STU002", name: "Jane Smith" },
  { id: "STU003", name: "Mike Johnson" },
  { id: "STU004", name: "Sarah Wilson" },
  { id: "STU005", name: "David Brown" },
  { id: "STU006", name: "Lisa Davis" },
  { id: "STU007", name: "Tom Anderson" },
  { id: "STU008", name: "Emma Taylor" },
  { id: "STU009", name: "Alex Miller" },
  { id: "STU010", name: "Sophie Clark" },
]

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  displayVisitors()
  updateStats()
  populateStudentDropdown()
})

// Display visitors
function displayVisitors() {
  const tableBody = document.getElementById("visitorsTableBody")
  const filteredVisitors = filterVisitorsData()

  tableBody.innerHTML = ""

  filteredVisitors.forEach((visitor) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${visitor.name}</td>
            <td>${visitor.phone}</td>
            <td>${visitor.studentName}</td>
            <td>${visitor.purpose}</td>
            <td>${formatDateTime(visitor.checkIn)}</td>
            <td>${visitor.checkOut ? formatDateTime(visitor.checkOut) : "-"}</td>
            <td><span class="status-badge status-${visitor.status}">${visitor.status}</span></td>
            <td>
                <button class="action-btn btn-view" onclick="viewVisitorDetails(${visitor.id})">View</button>
                ${
                  visitor.status === "inside"
                    ? `<button class="action-btn btn-checkout" onclick="checkOutVisitor(${visitor.id})">Check Out</button>`
                    : ""
                }
                ${
                  currentUser.role === "admin" || currentUser.role === "security"
                    ? `<button class="action-btn btn-delete" onclick="deleteVisitor(${visitor.id})">Delete</button>`
                    : ""
                }
            </td>
        `
    tableBody.appendChild(row)
  })
}

// Filter visitors based on search, date, and status
function filterVisitorsData() {
  const searchTerm = document.getElementById("searchVisitor").value.toLowerCase()
  const dateFilter = document.getElementById("dateFilter").value
  const statusFilter = document.getElementById("statusFilter").value

  return visitors.filter((visitor) => {
    const searchMatch =
      !searchTerm || visitor.name.toLowerCase().includes(searchTerm) || visitor.phone.includes(searchTerm)

    const dateMatch = !dateFilter || visitor.checkIn.startsWith(dateFilter)

    const statusMatch = !statusFilter || visitor.status === statusFilter

    return searchMatch && dateMatch && statusMatch
  })
}

// Filter visitors (called by search/filter inputs)
function filterVisitors() {
  displayVisitors()
}

// Update statistics
function updateStats() {
  const today = new Date().toISOString().split("T")[0]
  const todayVisitors = visitors.filter((v) => v.checkIn.startsWith(today)).length
  const currentVisitors = visitors.filter((v) => v.status === "inside").length

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const weekVisitors = visitors.filter((v) => new Date(v.checkIn) >= weekAgo).length

  document.getElementById("todayVisitors").textContent = todayVisitors
  document.getElementById("currentVisitors").textContent = currentVisitors
  document.getElementById("weekVisitors").textContent = weekVisitors
}

// Populate student dropdown
function populateStudentDropdown() {
  const studentSelect = document.getElementById("studentToMeet")
  studentSelect.innerHTML = '<option value="">Select Student</option>'

  students.forEach((student) => {
    const option = document.createElement("option")
    option.value = student.id
    option.textContent = `${student.id} - ${student.name}`
    studentSelect.appendChild(option)
  })
}

// Show visitor registration modal
function showVisitorModal() {
  document.getElementById("visitorModal").style.display = "block"
}

// Handle visitor registration form
document.getElementById("visitorForm").addEventListener("submit", function (e) {
  e.preventDefault()

  const name = document.getElementById("visitorName").value
  const phone = document.getElementById("visitorPhone").value
  const studentToMeet = document.getElementById("studentToMeet").value
  const relation = document.getElementById("relation").value
  const purpose = document.getElementById("purpose").value

  const student = students.find((s) => s.id === studentToMeet)

  const newVisitor = {
    id: visitors.length + 1,
    name: name,
    phone: phone,
    studentToMeet: studentToMeet,
    studentName: student.name,
    relation: relation,
    purpose: purpose,
    checkIn: new Date().toISOString(),
    checkOut: null,
    status: "inside",
  }

  visitors.push(newVisitor)

  // Reset form and close modal
  this.reset()
  closeModal("visitorModal")

  // Refresh display
  displayVisitors()
  updateStats()

  alert(`Visitor ${name} registered successfully!`)
})

// Check out visitor
function checkOutVisitor(visitorId) {
  const visitor = visitors.find((v) => v.id === visitorId)
  if (visitor) {
    visitor.checkOut = new Date().toISOString()
    visitor.status = "exited"

    displayVisitors()
    updateStats()

    alert(`${visitor.name} checked out successfully!`)
  }
}

// View visitor details
function viewVisitorDetails(visitorId) {
  const visitor = visitors.find((v) => v.id === visitorId)
  if (visitor) {
    let details = `Visitor Details:\n\n`
    details += `Name: ${visitor.name}\n`
    details += `Phone: ${visitor.phone}\n`
    details += `Student to Meet: ${visitor.studentName} (${visitor.studentToMeet})\n`
    details += `Relation: ${visitor.relation}\n`
    details += `Purpose: ${visitor.purpose}\n`
    details += `Check-in: ${formatDateTime(visitor.checkIn)}\n`
    details += `Check-out: ${visitor.checkOut ? formatDateTime(visitor.checkOut) : "Still inside"}\n`
    details += `Status: ${visitor.status}\n`

    if (visitor.checkOut) {
      const duration = Math.round((new Date(visitor.checkOut) - new Date(visitor.checkIn)) / (1000 * 60))
      details += `Duration: ${duration} minutes\n`
    }

    alert(details)
  }
}

// Delete visitor
function deleteVisitor(visitorId) {
  if (confirm("Are you sure you want to delete this visitor record?")) {
    visitors = visitors.filter((v) => v.id !== visitorId)
    displayVisitors()
    updateStats()
    alert("Visitor record deleted successfully!")
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
