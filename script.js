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

