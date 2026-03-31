/**
 * Phase 4: Data Persistence & Initialization
 * Acts as the simulated backend database.
 */
const STORAGE_KEY = 'ipt_demo_v1';

window.db = {
    accounts: [],
    // Seeded with objects to support Name and Description
    departments: [
        { name: "Engineering", description: "Software team" },
        { name: "HR", description: "Human Resources" },
        { name: "Marketing", description: "Marketing team" },
        { name: "IT", description: "IT Support" }
    ],
    employees: [],
    requests: []
};

function loadFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        window.db = JSON.parse(saved);
    } else {
        // Default Admin Account
        window.db.accounts.push({
            fname: "Admin",
            lname: "User",
            email: "admin@example.com",
            password: "Password123!",
            role: "admin",
            verified: true
        });
        saveToStorage();
    }
}

function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(window.db));
}

/**
 * Phase 2: Client-Side Routing
 * Manages view visibility and route protection.
 */
let currentUser = null;

const handleRouting = () => {
    const hash = window.location.hash || '#/home';
    
    // Hide all sections with class .view
document.querySelectorAll('.view').forEach(v => v.style.display = 'none');

    // Route Protection
    const adminRoutes = ['#/employees', '#/accounts', '#/departments'];
    if (adminRoutes.includes(hash) && (!currentUser || currentUser.role !== 'admin')) {
        alert("Access Denied: Admins Only");
        window.location.hash = '#/home';
        return;
    }

    const pageName = hash.replace('#/', '');
    const targetId = `${pageName}-page`;
    const targetSection = document.getElementById(targetId);
    
    if (targetSection) {
        targetSection.style.display = 'block';
        
        // Render triggers
        if (pageName === 'profile') renderProfile();
        if (pageName === 'employees') renderEmployeesTable();
        if (pageName === 'departments') renderDepartmentsTable();
    } else {
        document.getElementById('home-page').style.display = 'block';
    }
    
    updateNavbar();
};

window.addEventListener('hashchange', handleRouting);

/**
 * Phase 3: Auth State Management
 */
function updateNavbar() {
    const navUser = document.getElementById('nav-user');
    const adminLinks = document.querySelectorAll('.role-admin');

    if (currentUser) {
        if (navUser) navUser.innerText = currentUser.fname;
        
        // Toggle Admin links visibility
        adminLinks.forEach(link => {
            link.style.display = currentUser.role === 'admin' ? 'block' : 'none';
        });
    }
}

function setAuthState(isAuth, user = null) {
    currentUser = user;
    const body = document.body;

    if (isAuth && user) {
        body.classList.remove('not-authenticated');
        body.classList.add('authenticated');
        if (user.role === 'admin') body.classList.add('is-admin');
    } else {
        body.classList.add('not-authenticated');
        body.classList.remove('authenticated', 'is-admin');
        localStorage.removeItem('auth_token');
    }
    updateNavbar();
}

/**
 * Phase 3A & 3B: Registration & Verification
 */
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fname = document.getElementById('reg-fname').value;
        const lname = document.getElementById('reg-lname').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-pass').value;

        if (window.db.accounts.some(acc => acc.email === email)) {
            alert("Email already registered!");
            return;
        }

        const newAccount = { fname, lname, email, password, role: 'user', verified: false };
        window.db.accounts.push(newAccount);
        saveToStorage();

        localStorage.setItem('unverified_email', email);
        window.location.hash = '#/verify-email';
    });
}

function simulateVerification() {
    const emailToVerify = localStorage.getItem('unverified_email');
    if (!emailToVerify) return alert("No pending verification.");

    const account = window.db.accounts.find(acc => acc.email === emailToVerify);
    if (account) {
        account.verified = true;
        saveToStorage();
        localStorage.removeItem('unverified_email');
        alert("Verification successful! You can now log in.");
        window.location.hash = '#/login';
    }
}

/**
 * Phase 3C & 3E: Login & Logout
 */
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-pass').value;

        const user = window.db.accounts.find(acc => 
            acc.email === email && acc.password === password && acc.verified === true
        );

        if (user) {
            localStorage.setItem('auth_token', email);
            setAuthState(true, user);
            window.location.hash = '#/profile';
        } else {
            alert('Invalid credentials or account not verified.');
        }
    });
}

function logout() {
    setAuthState(false);
    window.location.hash = '#/home';
}

/**
 * Phase 5: Profile Page
 */
function renderProfile() {
    if (!currentUser) return;
    document.getElementById('prof-name').innerText = `${currentUser.fname} ${currentUser.lname}`;
    document.getElementById('prof-email').innerText = currentUser.email;
    document.getElementById('prof-role').innerText = currentUser.role;
}

/**
 * Phase 6: Employee Management
 */
function showEmployeeForm() {
    const container = document.getElementById('employee-form-container');
    const deptSelect = document.getElementById('emp-dept');
    if (container && deptSelect) {
        deptSelect.innerHTML = window.db.departments.map(d => `<option value="${d.name}">${d.name}</option>`).join('');
        container.style.display = 'block';
    }
}

function hideEmployeeForm() {
    const container = document.getElementById('employee-form-container');
    if (container) container.style.display = 'none';
}

function renderEmployeesTable() {
    const tbody = document.getElementById('employees-table-body');
    if (!tbody) return;
    tbody.innerHTML = ""; 

    if (window.db.employees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No employees recorded.</td></tr>';
        return;
    }

    window.db.employees.forEach((emp, index) => {
        const account = window.db.accounts.find(a => a.email === emp.email);
        const displayName = account ? `${account.fname} ${account.lname}` : "Unlinked Account";
        const row = `
            <tr>
                <td>${emp.id}</td>
                <td>${displayName}</td>
                <td>${emp.position}</td>
                <td><span class="badge bg-secondary">${emp.dept}</span></td>
                <td><button class="btn btn-sm btn-outline-danger" onclick="deleteEmployee(${index})">Delete</button></td>
            </tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

const employeeForm = document.getElementById('employee-form');
if (employeeForm) {
    employeeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newEmp = {
            id: document.getElementById('emp-id').value,
            email: document.getElementById('emp-email').value,
            position: document.getElementById('emp-position').value,
            dept: document.getElementById('emp-dept').value,
            hireDate: document.getElementById('emp-date').value
        };

        // Check if account exists first
        if (!window.db.accounts.some(acc => acc.email === newEmp.email)) {
            return alert("Error: No registered account found with this email.");
        }

        window.db.employees.push(newEmp);
        saveToStorage(); 
        renderEmployeesTable();
        hideEmployeeForm();
        employeeForm.reset();
        alert("Employee added successfully!");
    });
}

function deleteEmployee(index) {
    if (confirm("Delete this employee record?")) {
        window.db.employees.splice(index, 1);
        saveToStorage();
        renderEmployeesTable();
    }
}


/**
 * Phase 6B: Department Management
 */
function renderDepartmentsTable() {
    const tbody = document.getElementById('dept-table-body');
    if (!tbody) return;
    tbody.innerHTML = "";

    window.db.departments.forEach((dept, index) => {
        // Accessing .name and .description correctly fixes the "undefined" error
        const row = `
            <tr>
                <td>${dept.name}</td>
                <td>${dept.description}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editDept(${index})">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteDept(${index})">Delete</button>
                </td>
            </tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

/**
 * Phase 6B: Edit Department Logic
 */
function editDept(index) {
    const dept = window.db.departments[index];
    
    // Ask for new values, providing the current values as default
    const newName = prompt("Edit Department Name:", dept.name);
    const newDesc = prompt("Edit Department Description:", dept.description);

    if (newName && newDesc) {
        // Update the object in the array
        window.db.departments[index] = {
            name: newName,
            description: newDesc
        };
        
        saveToStorage(); // Persist the change
        renderDepartmentsTable(); // Refresh the table
        alert("Department updated successfully!");
    }
}

/**
 * Phase 6C: Account Management
 * Handles the CRUD operations for the User Accounts table.
 */

// 1. Render the Table
function renderAccountsTable() {
    const tbody = document.getElementById('accounts-table-body');
    if (!tbody) return;
    tbody.innerHTML = "";

    window.db.accounts.forEach((acc, index) => {
        const row = `
            <tr>
                <td>${acc.fname} ${acc.lname}</td>
                <td>${acc.email}</td>
                <td>${acc.role}</td>
                <td class="text-center">${acc.verified ? '✅' : '❌'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editAccount(${index})">Edit</button>
                    <button class="btn btn-sm btn-outline-warning" onclick="resetPassword(${index})">Reset Password</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteAccount(${index})">Delete</button>
                </td>
            </tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

// 2. Show/Hide the "Add/Edit Account" Form
function showAccountForm() {
    const container = document.getElementById('account-form-container');
    if (container) container.style.display = 'block';
}

function hideAccountForm() {
    const container = document.getElementById('account-form-container');
    if (container) {
        container.style.display = 'none';
        document.getElementById('account-form').reset();
        // Clear any hidden email trackers if you add an "edit mode"
        delete document.getElementById('account-form').dataset.editEmail;
    }
}

// 3. Handle Form Submission (Add or Update)
const accountForm = document.getElementById('account-form');
if (accountForm) {
    accountForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('acc-email').value;
        const newAccount = {
            fname: document.getElementById('acc-fname').value,
            lname: document.getElementById('acc-lname').value,
            email: email,
            password: document.getElementById('acc-pass').value,
            role: document.getElementById('acc-role').value,
            verified: document.getElementById('acc-verified').checked
        };

        // Check if we are editing an existing account or adding a new one
        const existingIndex = window.db.accounts.findIndex(a => a.email === email);
        
        if (existingIndex > -1) {
            window.db.accounts[existingIndex] = newAccount;
            alert("Account updated successfully!");
        } else {
            window.db.accounts.push(newAccount);
            alert("Account created successfully!");
        }

        saveToStorage(); // Save to local storage
        renderAccountsTable(); // Refresh table
        hideAccountForm(); // Close form
    });
}

// 4. Edit Account Logic (Fills the form with current data)
function editAccount(index) {
    const acc = window.db.accounts[index];
    
    document.getElementById('acc-fname').value = acc.fname;
    document.getElementById('acc-lname').value = acc.lname;
    document.getElementById('acc-email').value = acc.email;
    document.getElementById('acc-pass').value = acc.password;
    document.getElementById('acc-role').value = acc.role;
    document.getElementById('acc-verified').checked = acc.verified;

    showAccountForm();
}

// 5. Delete Account Logic
function deleteAccount(index) {
    if (confirm("Are you sure you want to delete this account?")) {
        window.db.accounts.splice(index, 1);
        saveToStorage();
        renderAccountsTable();
    }
}

// 6. Reset Password Logic
function resetPassword(index) {
    const newPass = prompt("Enter new password for " + window.db.accounts[index].email);
    if (newPass) {
        window.db.accounts[index].password = newPass;
        saveToStorage();
        alert("Password updated!");
    }
}

/**
 * Phase 3: Navbar Dropdown Logic
 */
function updateNavbar() {
    const navUser = document.getElementById('nav-user');
    const adminLinks = document.querySelectorAll('.role-admin');

    if (currentUser) {
        if (navUser) navUser.innerText = currentUser.fname;
        
        // Show "Employees", "Accounts", and "Departments" only for Admin
        adminLinks.forEach(link => {
            link.style.display = currentUser.role === 'admin' ? 'block' : 'none';
        });
    }
}

/**
 * Add Department Function
 */
function addDepartment() {
    const name = prompt("Enter Department Name:");
    const desc = prompt("Enter Description:");
    
    if (name && desc) {
        window.db.departments.push({ name: name, description: desc });
        saveToStorage();
        renderDepartmentsTable();
    }
}

function deleteDept(index) {
    if (confirm("Delete department?")) {
        window.db.departments.splice(index, 1);
        saveToStorage();
        renderDepartmentsTable();
    }
}

/**
 * Phase 7: Request Management
 */

function openRequestModal() {
    document.getElementById('request-modal').style.display = 'block';
    document.getElementById('req-items-container').innerHTML = "";
    addRequestItemRow(); // Start with one row
}

function closeRequestModal() {
    document.getElementById('request-modal').style.display = 'none';
}

// Adds a new row with "Item name", "Quantity", and a remove button
function addRequestItemRow() {
    const container = document.getElementById('req-items-container');
    const rowId = Date.now();
    const rowHtml = `
        <div class="input-group mb-2" id="row-${rowId}">
            <input type="text" class="form-control item-name" placeholder="Item name">
            <input type="number" class="form-control item-qty" value="1" style="max-width: 80px;">
            <button class="btn btn-outline-danger" onclick="removeRequestItemRow('${rowId}')">×</button>
            <button class="btn btn-outline-primary" onclick="addRequestItemRow()">+</button>
        </div>`;
    container.insertAdjacentHTML('beforeend', rowHtml);
}

function removeRequestItemRow(id) {
    const rows = document.querySelectorAll('#req-items-container .input-group');
    if (rows.length > 1) {
        document.getElementById(`row-${id}`).remove();
    }
}

function submitRequest() {
    const type = document.getElementById('req-type').value;
    const itemRows = document.querySelectorAll('#req-items-container .input-group');
    const items = [];

    itemRows.forEach(row => {
        const name = row.querySelector('.item-name').value;
        const qty = row.querySelector('.item-qty').value;
        if (name) items.push(`${qty}x ${name}`);
    });

    if (items.length === 0) return alert("Please add at least one item.");

    const newRequest = {
        userEmail: currentUser.email,
        type: type,
        items: items.join(", "),
        status: "Pending"
    };

    window.db.requests.push(newRequest);
    saveToStorage();
    renderRequestsTable();
    closeRequestModal();
}

function renderRequestsTable() {
    const tbody = document.getElementById('requests-table-body');
    const emptyState = document.getElementById('empty-requests');
    const table = document.getElementById('requests-table');

    // Filter requests to only show the current user's requests
    const userRequests = window.db.requests.filter(r => r.userEmail === currentUser.email);

    if (userRequests.length === 0) {
        emptyState.style.display = 'block';
        table.style.display = 'none';
        return;
    }


    emptyState.style.display = 'none';
    table.style.display = 'table';
    tbody.innerHTML = "";

    userRequests.forEach(req => {
        tbody.innerHTML += `
            <tr>
                <td>${req.type}</td>
                <td>${req.items}</td>
                <td><span class="badge bg-warning">${req.status}</span></td>
            </tr>`;
    });
}

/**
 * Initialization
 */
loadFromStorage();
const savedEmail = localStorage.getItem('auth_token');
if (savedEmail) {
    const user = window.db.accounts.find(a => a.email === savedEmail);
    if (user) setAuthState(true, user);
}
handleRouting();

