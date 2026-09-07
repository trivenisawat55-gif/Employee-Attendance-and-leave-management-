// ================================
// EMPLOYEE DATA
// ================================
let employees = [
    { id: "E001", name: "Aditi", dept: "IT", role: "Developer" },
    { id: "E002", name: "Vedita", dept: "HR", role: "HR Executive" },
    { id: "E003", name: "Priya", dept: "Finance", role: "Accountant" },
    { id: "E004", name: "Triveni", dept: "IT", role: "Developer" }
];

let attendance = [];
let leaves = [];

// Section Navigation Titles
const sectionTitles = {
    'dashboard': 'Dashboard Overview',
    'employees': 'Employee Management',
    'attendance': 'Attendance Records',
    'leave': 'Leave Applications',
    'reports': 'System Reports'
};

// ================================
// SHOW SECTION
// ================================
function showSection(sectionName, element) {
    let sections = document.querySelectorAll(".section");
    sections.forEach(sec => sec.classList.add("hidden"));

    document.getElementById(sectionName).classList.remove("hidden");

    // Update active navbar button
    if (element) {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        element.classList.add('active');
    }

    // Update page header title
    document.getElementById('pageTitle').innerText = sectionTitles[sectionName] || 'Overview';

    updateDashboard();

    if (sectionName === "employees") displayEmployees();
    if (sectionName === "attendance") displayAttendance();
    if (sectionName === "leave") {
        displayEmployeesForLeave();
        displayLeaves();
    }
    if (sectionName === "reports") displayReports();
}

// ================================
// ADD EMPLOYEE
// ================================
function addEmployee() {
    let id = document.getElementById("empId").value.trim();
    let name = document.getElementById("empName").value.trim();
    let dept = document.getElementById("empDept").value.trim();
    let role = document.getElementById("empRole").value.trim();

    if (!id || !name || !dept || !role) {
        alert("Please complete all form fields.");
        return;
    }

    employees.push({ id, name, dept, role });
    alert("Employee registered successfully!");

    document.getElementById("empId").value = "";
    document.getElementById("empName").value = "";
    document.getElementById("empDept").value = "";
    document.getElementById("empRole").value = "";

    displayEmployees();
    updateDashboard();
}

// ================================
// DISPLAY EMPLOYEES
// ================================
function displayEmployees() {
    let table = document.getElementById("employeeTable");
    table.innerHTML = "";

    employees.forEach((employee, index) => {
        table.innerHTML += `
        <tr>
            <td><strong>${employee.id}</strong></td>
            <td>${employee.name}</td>
            <td>${employee.dept}</td>
            <td>${employee.role}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${index})">
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
            </td>
        </tr>`;
    });
}

function deleteEmployee(index) {
    if (confirm("Are you sure you want to remove this employee?")) {
        employees.splice(index, 1);
        displayEmployees();
        updateDashboard();
    }
}

// ================================
// ATTENDANCE MANAGEMENT
// ================================
function displayAttendance() {
    let table = document.getElementById("attendanceTable");
    table.innerHTML = "";

    employees.forEach(employee => {
        table.innerHTML += `
        <tr>
            <td><strong>${employee.name}</strong></td>
            <td>${employee.dept}</td>
            <td>
                <button class="btn btn-success btn-sm" onclick="markAttendance('${employee.id}', 'Present')">
                    <i class="fa-solid fa-check"></i> Present
                </button>
                <button class="btn btn-danger btn-sm" onclick="markAttendance('${employee.id}', 'Absent')">
                    <i class="fa-solid fa-xmark"></i> Absent
                </button>
            </td>
        </tr>`;
    });
}

function markAttendance(employeeId, status) {
    let date = document.getElementById("attendanceDate").value;

    if (!date) {
        date = new Date().toISOString().split("T")[0];
        document.getElementById("attendanceDate").value = date;
    }

    let employee = employees.find(emp => emp.id === employeeId);

    attendance.push({
        employee: employee.name,
        employeeId: employeeId,
        date: date,
        status: status
    });

    alert(`${employee.name} marked as ${status}`);
    updateDashboard();
}

// ================================
// LEAVE MANAGEMENT
// ================================
function displayEmployeesForLeave() {
    let dropdown = document.getElementById("leaveEmployee");
    dropdown.innerHTML = '<option value="">Choose Employee</option>';

    employees.forEach(employee => {
        dropdown.innerHTML += `<option value="${employee.name}">${employee.name}</option>`;
    });
}

function applyLeave() {
    let employee = document.getElementById("leaveEmployee").value;
    let type = document.getElementById("leaveType").value;
    let date = document.getElementById("leaveDate").value;

    if (!employee || !date) {
        alert("Please select both an employee and leave date.");
        return;
    }

    leaves.push({
        employee: employee,
        type: type,
        date: date,
        status: "Pending"
    });

    alert("Leave application logged.");
    document.getElementById("leaveEmployee").value = "";
    document.getElementById("leaveDate").value = "";

    displayLeaves();
    updateDashboard();
}

function displayLeaves() {
    let table = document.getElementById("leaveTable");
    table.innerHTML = "";

    leaves.forEach((leave, index) => {
        let badgeClass = leave.status === "Approved" ? "badge-success" : leave.status === "Rejected" ? "badge-danger" : "badge-warning";

        table.innerHTML += `
        <tr>
            <td><strong>${leave.employee}</strong></td>
            <td>${leave.type}</td>
            <td>${leave.date}</td>
            <td><span class="badge ${badgeClass}">${leave.status}</span></td>
            <td>
                ${leave.status === "Pending" ? `
                    <button class="btn btn-success btn-sm" onclick="approveLeave(${index})">Approve</button>
                    <button class="btn btn-danger btn-sm" onclick="rejectLeave(${index})">Reject</button>
                ` : `<span style="color: var(--text-secondary); font-size:12px;">Processed</span>`}
            </td>
        </tr>`;
    });
}

function approveLeave(index) {
    leaves[index].status = "Approved";
    displayLeaves();
    updateDashboard();
}

function rejectLeave(index) {
    leaves[index].status = "Rejected";
    displayLeaves();
    updateDashboard();
}

// ================================
// DASHBOARD UPDATES
// ================================
function updateDashboard() {
    document.getElementById("totalEmployees").innerText = employees.length;

    let today = new Date().toISOString().split("T")[0];
    let todayAttendance = attendance.filter(record => record.date === today);

    let present = todayAttendance.filter(record => record.status === "Present").length;
    let absent = todayAttendance.filter(record => record.status === "Absent").length;
    let pending = leaves.filter(leave => leave.status === "Pending").length;

    document.getElementById("presentToday").innerText = present;
    document.getElementById("absentToday").innerText = absent;
    document.getElementById("pendingLeaves").innerText = pending;
}

function displayReports() {
    document.getElementById("reportEmployees").innerText = employees.length;
    document.getElementById("attendanceRecords").innerText = attendance.length;
    document.getElementById("leaveRecords").innerText = leaves.length;
}

// Default Setup on Load
document.getElementById("attendanceDate").value = new Date().toISOString().split("T")[0];
showSection("dashboard");
