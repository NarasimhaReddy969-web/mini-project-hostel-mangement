// Check authentication
const currentUser = JSON.parse(localStorage.getItem("currentUser"))
if (!currentUser) {
  window.location.href = "index.html"
}

// Mock data
let payments = [
  {
    id: 1,
    studentId: "STU001",
    studentName: "John Doe",
    feeType: "hostel_rent",
    amount: 5000,
    dueDate: "2024-01-15",
    status: "paid",
    paymentDate: "2024-01-10",
    paymentMethod: "online",
  },
  {
    id: 2,
    studentId: "STU002",
    studentName: "Jane Smith",
    feeType: "mess_fee",
    amount: 3000,
    dueDate: "2024-01-15",
    status: "pending",
    paymentDate: null,
    paymentMethod: null,
  },
  {
    id: 3,
    studentId: "STU003",
    studentName: "Mike Johnson",
    feeType: "hostel_rent",
    amount: 5000,
    dueDate: "2024-01-15",
    status: "overdue",
    paymentDate: null,
    paymentMethod: null,
  },
  {
    id: 4,
    studentId: "STU004",
    studentName: "Sarah Wilson",
    feeType: "security_deposit",
    amount: 2000,
    dueDate: "2024-01-20",
    status: "paid",
    paymentDate: "2024-01-18",
    paymentMethod: "cash",
  },
  {
    id: 5,
    studentId: "STU005",
    studentName: "David Brown",
    feeType: "mess_fee",
    amount: 3000,
    dueDate: "2024-01-15",
    status: "pending",
    paymentDate: null,
    paymentMethod: null,
  },
  {
    id: 6,
    studentId: "STU006",
    studentName: "Lisa Davis",
    feeType: "maintenance",
    amount: 500,
    dueDate: "2024-01-25",
    status: "paid",
    paymentDate: "2024-01-22",
    paymentMethod: "online",
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
  displayPayments()
  updateSummary()
  populateStudentDropdown()
})

// Display payments
function displayPayments() {
  const tableBody = document.getElementById("paymentsTableBody")
  const filteredPayments = filterPaymentsData()

  tableBody.innerHTML = ""

  filteredPayments.forEach((payment) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${payment.studentId}</td>
            <td>${payment.studentName}</td>
            <td>${formatFeeType(payment.feeType)}</td>
            <td>₹${payment.amount}</td>
            <td>${formatDate(payment.dueDate)}</td>
            <td><span class="status-badge status-${payment.status}">${payment.status}</span></td>
            <td>
                <button class="action-btn btn-view" onclick="viewPaymentDetails(${payment.id})">View</button>
                ${
                  payment.status === "pending" || payment.status === "overdue"
                    ? `<button class="action-btn btn-edit" onclick="recordPayment(${payment.id})">Pay</button>`
                    : ""
                }
                ${
                  currentUser.role === "admin"
                    ? `<button class="action-btn btn-delete" onclick="deletePayment(${payment.id})">Delete</button>`
                    : ""
                }
            </td>
        `
    tableBody.appendChild(row)
  })
}

// Filter payments based on search and status
function filterPaymentsData() {
  const searchTerm = document.getElementById("searchStudent").value.toLowerCase()
  const statusFilter = document.getElementById("statusFilter").value

  return payments.filter((payment) => {
    const searchMatch =
      !searchTerm ||
      payment.studentName.toLowerCase().includes(searchTerm) ||
      payment.studentId.toLowerCase().includes(searchTerm)
    const statusMatch = !statusFilter || payment.status === statusFilter
    return searchMatch && statusMatch
  })
}

// Filter payments (called by search/filter inputs)
function filterPayments() {
  displayPayments()
}

// Update summary cards
function updateSummary() {
  const totalCollected = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)

  const pendingDues = payments
    .filter((p) => p.status === "pending" || p.status === "overdue")
    .reduce((sum, p) => sum + p.amount, 0)

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const thisMonth = payments
    .filter((p) => {
      if (!p.paymentDate) return false
      const paymentDate = new Date(p.paymentDate)
      return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear
    })
    .reduce((sum, p) => sum + p.amount, 0)

  document.getElementById("totalCollected").textContent = totalCollected.toLocaleString()
  document.getElementById("pendingDues").textContent = pendingDues.toLocaleString()
  document.getElementById("thisMonth").textContent = thisMonth.toLocaleString()
}

// Populate student dropdown
function populateStudentDropdown() {
  const studentSelect = document.getElementById("paymentStudentId")
  studentSelect.innerHTML = '<option value="">Select Student</option>'

  students.forEach((student) => {
    const option = document.createElement("option")
    option.value = student.id
    option.textContent = `${student.id} - ${student.name}`
    studentSelect.appendChild(option)
  })
}

// Show payment modal
function showPaymentModal() {
  document.getElementById("paymentModal").style.display = "block"
  document.getElementById("paymentDate").value = new Date().toISOString().split("T")[0]
}

// Record payment for existing fee
function recordPayment(paymentId) {
  const payment = payments.find((p) => p.id === paymentId)
  if (payment) {
    document.getElementById("paymentStudentId").value = payment.studentId
    document.getElementById("feeType").value = payment.feeType
    document.getElementById("amount").value = payment.amount
    document.getElementById("paymentDate").value = new Date().toISOString().split("T")[0]

    // Store the payment ID for updating
    document.getElementById("paymentForm").dataset.paymentId = paymentId

    showPaymentModal()
  }
}

// Handle payment form submission
document.getElementById("paymentForm").addEventListener("submit", function (e) {
  e.preventDefault()

  const studentId = document.getElementById("paymentStudentId").value
  const feeType = document.getElementById("feeType").value
  const amount = Number.parseFloat(document.getElementById("amount").value)
  const paymentMethod = document.getElementById("paymentMethod").value
  const paymentDate = document.getElementById("paymentDate").value
  const paymentId = this.dataset.paymentId

  const student = students.find((s) => s.id === studentId)

  if (paymentId) {
    // Update existing payment
    const payment = payments.find((p) => p.id === Number.parseInt(paymentId))
    if (payment) {
      payment.status = "paid"
      payment.paymentDate = paymentDate
      payment.paymentMethod = paymentMethod
      payment.amount = amount
    }
    delete this.dataset.paymentId
  } else {
    // Create new payment record
    const newPayment = {
      id: payments.length + 1,
      studentId: studentId,
      studentName: student.name,
      feeType: feeType,
      amount: amount,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days from now
      status: "paid",
      paymentDate: paymentDate,
      paymentMethod: paymentMethod,
    }
    payments.push(newPayment)
  }

  // Reset form and close modal
  this.reset()
  closeModal("paymentModal")

  // Refresh display
  displayPayments()
  updateSummary()

  alert("Payment recorded successfully!")
})

// View payment details
function viewPaymentDetails(paymentId) {
  const payment = payments.find((p) => p.id === paymentId)
  if (payment) {
    let details = `Payment Details:\n\n`
    details += `Student: ${payment.studentName} (${payment.studentId})\n`
    details += `Fee Type: ${formatFeeType(payment.feeType)}\n`
    details += `Amount: ₹${payment.amount}\n`
    details += `Due Date: ${formatDate(payment.dueDate)}\n`
    details += `Status: ${payment.status}\n`

    if (payment.paymentDate) {
      details += `Payment Date: ${formatDate(payment.paymentDate)}\n`
      details += `Payment Method: ${payment.paymentMethod}\n`
    }

    alert(details)
  }
}

// Delete payment
function deletePayment(paymentId) {
  if (confirm("Are you sure you want to delete this payment record?")) {
    payments = payments.filter((p) => p.id !== paymentId)
    displayPayments()
    updateSummary()
    alert("Payment record deleted successfully!")
  }
}

// Utility functions
function formatFeeType(feeType) {
  const types = {
    hostel_rent: "Hostel Rent",
    mess_fee: "Mess Fee",
    security_deposit: "Security Deposit",
    maintenance: "Maintenance",
  }
  return types[feeType] || feeType
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
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
