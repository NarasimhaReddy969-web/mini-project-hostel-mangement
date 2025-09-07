// Check authentication
const currentUser = JSON.parse(localStorage.getItem("currentUser"))
if (!currentUser) {
  window.location.href = "index.html"
}

// Mock data
const rooms = [
  { number: "101", floor: 1, capacity: 2, occupied: 0, status: "available", students: [] },
  { number: "102", floor: 1, capacity: 2, occupied: 2, status: "occupied", students: ["STU001", "STU002"] },
  { number: "103", floor: 1, capacity: 2, occupied: 1, status: "available", students: ["STU003"] },
  { number: "201", floor: 2, capacity: 2, occupied: 0, status: "maintenance", students: [] },
  { number: "202", floor: 2, capacity: 2, occupied: 2, status: "occupied", students: ["STU004", "STU005"] },
  { number: "203", floor: 2, capacity: 2, occupied: 1, status: "available", students: ["STU006"] },
  { number: "301", floor: 3, capacity: 2, occupied: 0, status: "available", students: [] },
  { number: "302", floor: 3, capacity: 2, occupied: 2, status: "occupied", students: ["STU007", "STU008"] },
]

const students = [
  { id: "STU001", name: "John Doe", room: "102" },
  { id: "STU002", name: "Jane Smith", room: "102" },
  { id: "STU003", name: "Mike Johnson", room: "103" },
  { id: "STU004", name: "Sarah Wilson", room: "202" },
  { id: "STU005", name: "David Brown", room: "202" },
  { id: "STU006", name: "Lisa Davis", room: "203" },
  { id: "STU007", name: "Tom Anderson", room: "302" },
  { id: "STU008", name: "Emma Taylor", room: "302" },
  { id: "STU009", name: "Alex Miller", room: null },
  { id: "STU010", name: "Sophie Clark", room: null },
]

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  displayRooms()
  populateStudentDropdown()
  populateRoomDropdown()
})

// Display rooms
function displayRooms() {
  const roomsGrid = document.getElementById("roomsGrid")
  roomsGrid.innerHTML = ""

  const filteredRooms = filterRoomsData()

  filteredRooms.forEach((room) => {
    const roomCard = document.createElement("div")
    roomCard.className = `room-card ${room.status}`

    const studentNames = room.students
      .map((studentId) => {
        const student = students.find((s) => s.id === studentId)
        return student ? student.name : studentId
      })
      .join(", ")

    roomCard.innerHTML = `
            <div class="room-number">Room ${room.number}</div>
            <div class="room-details">
                <p>Floor: ${room.floor}</p>
                <p>Capacity: ${room.capacity}</p>
                <p>Occupied: ${room.occupied}</p>
                <p>Status: <span class="status-badge status-${room.status}">${room.status}</span></p>
                ${room.students.length > 0 ? `<p>Students: ${studentNames}</p>` : ""}
            </div>
            <div class="room-actions">
                ${
                  room.status === "available" && room.occupied < room.capacity
                    ? `<button class="btn-small btn-primary" onclick="allocateRoom('${room.number}')">Allocate</button>`
                    : ""
                }
                ${
                  room.occupied > 0
                    ? `<button class="btn-small btn-warning" onclick="viewRoomDetails('${room.number}')">View Details</button>`
                    : ""
                }
                ${
                  room.status === "maintenance"
                    ? `<button class="btn-small btn-primary" onclick="markAvailable('${room.number}')">Mark Available</button>`
                    : `<button class="btn-small btn-warning" onclick="markMaintenance('${room.number}')">Maintenance</button>`
                }
            </div>
        `

    roomsGrid.appendChild(roomCard)
  })
}

// Filter rooms based on selected filters
function filterRoomsData() {
  const floorFilter = document.getElementById("floorFilter").value
  const statusFilter = document.getElementById("statusFilter").value

  return rooms.filter((room) => {
    const floorMatch = !floorFilter || room.floor.toString() === floorFilter
    const statusMatch = !statusFilter || room.status === statusFilter
    return floorMatch && statusMatch
  })
}

// Filter rooms (called by filter dropdowns)
function filterRooms() {
  displayRooms()
}

// Populate student dropdown
function populateStudentDropdown() {
  const studentSelect = document.getElementById("studentId")
  const unallocatedStudents = students.filter((student) => !student.room)

  studentSelect.innerHTML = '<option value="">Select Student</option>'
  unallocatedStudents.forEach((student) => {
    const option = document.createElement("option")
    option.value = student.id
    option.textContent = `${student.id} - ${student.name}`
    studentSelect.appendChild(option)
  })
}

// Populate room dropdown
function populateRoomDropdown() {
  const roomSelect = document.getElementById("roomNumber")
  const availableRooms = rooms.filter((room) => room.status === "available" && room.occupied < room.capacity)

  roomSelect.innerHTML = '<option value="">Select Room</option>'
  availableRooms.forEach((room) => {
    const option = document.createElement("option")
    option.value = room.number
    option.textContent = `Room ${room.number} (${room.capacity - room.occupied} beds available)`
    roomSelect.appendChild(option)
  })
}

// Show allocate room modal
function showAllocateRoomModal() {
  document.getElementById("allocateRoomModal").style.display = "block"
  populateStudentDropdown()
  populateRoomDropdown()
  document.getElementById("allocationDate").value = new Date().toISOString().split("T")[0]
}

// Allocate room (from room card)
function allocateRoom(roomNumber) {
  document.getElementById("roomNumber").value = roomNumber
  showAllocateRoomModal()
}

// Handle room allocation form
document.getElementById("allocateRoomForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const roomNumber = document.getElementById("roomNumber").value
  const studentId = document.getElementById("studentId").value
  const allocationDate = document.getElementById("allocationDate").value

  // Update room data
  const room = rooms.find((r) => r.number === roomNumber)
  if (room) {
    room.students.push(studentId)
    room.occupied++
    if (room.occupied >= room.capacity) {
      room.status = "occupied"
    }
  }

  // Update student data
  const student = students.find((s) => s.id === studentId)
  if (student) {
    student.room = roomNumber
  }

  // Close modal and refresh display
  closeModal("allocateRoomModal")
  displayRooms()

  alert(`Room ${roomNumber} allocated to ${student.name} successfully!`)
})

// Mark room for maintenance
function markMaintenance(roomNumber) {
  const room = rooms.find((r) => r.number === roomNumber)
  if (room && room.occupied === 0) {
    room.status = "maintenance"
    displayRooms()
    alert(`Room ${roomNumber} marked for maintenance.`)
  } else {
    alert("Cannot mark occupied room for maintenance.")
  }
}

// Mark room as available
function markAvailable(roomNumber) {
  const room = rooms.find((r) => r.number === roomNumber)
  if (room) {
    room.status = "available"
    displayRooms()
    alert(`Room ${roomNumber} marked as available.`)
  }
}

// View room details
function viewRoomDetails(roomNumber) {
  const room = rooms.find((r) => r.number === roomNumber)
  if (room) {
    const studentDetails = room.students
      .map((studentId) => {
        const student = students.find((s) => s.id === studentId)
        return student ? `${student.id} - ${student.name}` : studentId
      })
      .join("\n")

    alert(
      `Room ${roomNumber} Details:\nFloor: ${room.floor}\nCapacity: ${room.capacity}\nOccupied: ${room.occupied}\nStatus: ${room.status}\n\nStudents:\n${studentDetails}`,
    )
  }
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
