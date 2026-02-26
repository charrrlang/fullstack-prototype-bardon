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

