// ================================
// EMPLOYEE DATA
// ================================

let employees = [
    {
        id: "E001",
        name: "Aditi",
        dept: "IT",
        role: "Developer"
    },
    {
        id: "E002",
        name: "Vedita",
        dept: "HR",
        role: "HR Executive"
    },
    {
        id: "E003",
        name: "Priya",
        dept: "Finance",
        role: "Accountant"
    },
    {
        id: "E004",
        name: "Triveni",
        dept: "IT",
        role: "Developer"
    }
];


// ================================
// ATTENDANCE DATA
// ================================

let attendance = [];


// ================================
// LEAVE DATA
// ================================

let leaves = [];


// ================================
// SHOW SECTION
// ================================

function showSection(sectionName) {

    let sections = document.querySelectorAll(".section");

    sections.forEach(function(section) {
        section.classList.add("hidden");
    });

    document.getElementById(sectionName)
        .classList.remove("hidden");

    updateDashboard();

    if (sectionName === "employees") {
        displayEmployees();
    }

    if (sectionName === "attendance") {
        displayAttendance();
    }

    if (sectionName === "leave") {
        displayEmployeesForLeave();
        displayLeaves();
    }

    if (sectionName === "reports") {
        displayReports();
    }
}


// ================================
// ADD EMPLOYEE
// ================================

function addEmployee() {

    let id = document.getElementById("empId").value;
    let name = document.getElementById("empName").value;
    let dept = document.getElementById("empDept").value;
    let role = document.getElementById("empRole").value;

    if (id === "" || name === "" || dept === "" || role === "") {

        alert("Please fill all fields");

        return;
    }

    employees.push({
        id: id,
        name: name,
        dept: dept,
        role: role
    });

    alert("Employee added successfully!");

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

    employees.forEach(function(employee, index) {

        table.innerHTML += `

        <tr>

            <td>${employee.id}</td>

            <td>${employee.name}</td>

            <td>${employee.dept}</td>

            <td>${employee.role}</td>

            <td>

                <button onclick="deleteEmployee(${index})">
                    Delete
                </button>

            </td>

        </tr>

        `;
    });
}


// ================================
// DELETE EMPLOYEE
// ================================

function deleteEmployee(index) {

    if (confirm("Delete this employee?")) {

        employees.splice(index, 1);

        displayEmployees();

        updateDashboard();
    }
}


// ================================
// ATTENDANCE
// ================================

function displayAttendance() {

    let table = document.getElementById("attendanceTable");

    table.innerHTML = "";

    employees.forEach(function(employee) {

        table.innerHTML += `

        <tr>

            <td>${employee.name}</td>

            <td>${employee.dept}</td>

            <td>

                <button onclick="markAttendance('${employee.id}', 'Present')">
                    Present
                </button>

                <button onclick="markAttendance('${employee.id}', 'Absent')">
                    Absent
                </button>

            </td>

        </tr>

        `;
    });
}


// ================================
// MARK ATTENDANCE
// ================================

function markAttendance(employeeId, status) {

    let date = document.getElementById("attendanceDate").value;

    if (date === "") {

        date = new Date().toISOString().split("T")[0];

        document.getElementById("attendanceDate").value = date;
    }

    let employee = employees.find(function(emp) {
        return emp.id === employeeId;
    });

    attendance.push({

        employee: employee.name,

        employeeId: employeeId,

        date: date,

        status: status

    });

    alert(employee.name + " marked " + status);

    updateDashboard();
}


// ================================
// LEAVE EMPLOYEE DROPDOWN
// ================================

function displayEmployeesForLeave() {

    let dropdown = document.getElementById("leaveEmployee");

    dropdown.innerHTML =
        '<option value="">Select Employee</option>';

    employees.forEach(function(employee) {

        dropdown.innerHTML += `

        <option value="${employee.name}">
            ${employee.name}
        </option>

        `;
    });
}


// ================================
// APPLY LEAVE
// ================================

function applyLeave() {

    let employee =
        document.getElementById("leaveEmployee").value;

    let type =
        document.getElementById("leaveType").value;

    let date =
        document.getElementById("leaveDate").value;

    if (employee === "" || date === "") {

        alert("Please select employee and date");

        return;
    }

    leaves.push({

        employee: employee,

        type: type,

        date: date,

        status: "Pending"

    });

    alert("Leave application submitted!");

    document.getElementById("leaveEmployee").value = "";

    document.getElementById("leaveDate").value = "";

    displayLeaves();

    updateDashboard();
}


// ================================
// DISPLAY LEAVES
// ================================

function displayLeaves() {

    let table = document.getElementById("leaveTable");

    table.innerHTML = "";

    leaves.forEach(function(leave, index) {

        table.innerHTML += `

        <tr>

            <td>${leave.employee}</td>

            <td>${leave.type}</td>

            <td>${leave.date}</td>

            <td class="${leave.status.toLowerCase()}">
                ${leave.status}
            </td>

            <td>

                ${
                    leave.status === "Pending"

                    ?

                    `<button onclick="approveLeave(${index})">
                        Approve
                    </button>

                    <button onclick="rejectLeave(${index})">
                        Reject
                    </button>`

                    :

                    "Completed"
                }

            </td>

        </tr>

        `;
    });
}


// ================================
// APPROVE LEAVE
// ================================

function approveLeave(index) {

    leaves[index].status = "Approved";

    displayLeaves();

    updateDashboard();
}


// ================================
// REJECT LEAVE
// ================================

function rejectLeave(index) {

    leaves[index].status = "Rejected";

    displayLeaves();

    updateDashboard();
}


// ================================
// DASHBOARD
// ================================

function updateDashboard() {

    document.getElementById("totalEmployees")
        .innerText = employees.length;

    let today =
        new Date().toISOString().split("T")[0];

    let todayAttendance =
        attendance.filter(function(record) {

            return record.date === today;

        });

    let present =
        todayAttendance.filter(function(record) {

            return record.status === "Present";

        }).length;

    let absent =
        todayAttendance.filter(function(record) {

            return record.status === "Absent";

        }).length;

    let pending =
        leaves.filter(function(leave) {

            return leave.status === "Pending";

        }).length;

    document.getElementById("presentToday")
        .innerText = present;

    document.getElementById("absentToday")
        .innerText = absent;

    document.getElementById("pendingLeaves")
        .innerText = pending;
}


// ================================
// REPORTS
// ================================

function displayReports() {

    document.getElementById("reportEmployees")
        .innerText = employees.length;

    document.getElementById("attendanceRecords")
        .innerText = attendance.length;

    document.getElementById("leaveRecords")
        .innerText = leaves.length;
}


// ================================
// INITIAL LOAD
// ================================

document.getElementById("attendanceDate").value =
    new Date().toISOString().split("T")[0];

showSection("dashboard");
