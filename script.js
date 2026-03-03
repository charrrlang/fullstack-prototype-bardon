document.addEventListener('DOMContentLoaded', () => {
    const simulateBtn = document.getElementById('simulate-btn');
    const goToLoginBtn = document.getElementById('go-to-login');

    simulateBtn.addEventListener('click', () => {
        // Change the alert message
        document.querySelector('.alert-success').innerHTML = '✅ Email verified! You may now log in.';
        
        // Hide the simulation button and show the "Go to Login" link
        simulateBtn.style.display = 'none';
        goToLoginBtn.style.display = 'inline-block';
    });
});

const simulateBtn = document.getElementById('simulate-btn');
const loginBtn = document.getElementById('go-to-login');
const alertBox = document.querySelector('.alert-info'); // or alert-success

simulateBtn.addEventListener('click', () => {
    // 1. Update the message
    alertBox.innerHTML = "✅ Email verified! You may now log in.";
    
    // 2. Optionally hide the simulate button and show the login button
    // simulateBtn.style.display = 'none'; 
    // loginBtn.style.display = 'inline-block';
});

/*FOR REUESTS */

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('requestModal');
    const openBtn = document.getElementById('openModalBtn');
    const createBtn = document.getElementById('createOneBtn');
    const closeBtn = document.getElementById('closeModalBtn');

    // Toggle Visibility
    const toggleModal = () => modal.classList.toggle('hidden');

    // Attach Click Events
    if (openBtn) openBtn.addEventListener('click', toggleModal);
    if (createBtn) createBtn.addEventListener('click', toggleModal);
    if (closeBtn) closeBtn.addEventListener('click', toggleModal);

    // Close on outside click (Overlay)
    window.addEventListener('click', (e) => {
        if (e.target === modal) toggleModal();
    });
});

// Logic for dynamic rows
function addItemRow() {
    const itemList = document.getElementById('itemList');
    const row = document.createElement('div');
    row.className = 'item-row';
    row.innerHTML = `
        <input type="text" placeholder="Item name" class="item-name">
        <input type="number" value="1" min="1" class="item-qty">
        <button type="button" class="btn-item-action remove" onclick="this.parentElement.remove()">×</button>
    `;
    itemList.appendChild(row);
}