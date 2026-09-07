function handleAuth() {
    const role = document.getElementById('loginRole').value;
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!username || !password) {
        alert('Please enter both username and password!');
        return;
    }

    if (password.length < 4) {
        alert('Password must be at least 4 characters long!');
        return;
    }

    // सुरक्षिततेसाठी आधीचे युजर्स सुरक्षितपणे फेच करणे
    let registeredUsers = [];
    try {
        registeredUsers = JSON.parse(localStorage.getItem('jharkhand_registered_users')) || [];
    } catch (e) {
        registeredUsers = [];
    }

    if (isSignUpMode) {
        // Sign Up Logic
        const existingUser = registeredUsers.find(u => u.username === username && u.role === role);
        if (existingUser) {
            alert('User already exists with this username and role! Please login.');
            return;
        }

        registeredUsers.push({ username, password, role });
        localStorage.setItem('jharkhand_registered_users', JSON.stringify(registeredUsers));
        
        showNotification('Account created successfully! Please login now.');
        switchAuthMode();
        document.getElementById('loginPassword').value = '';
    } else {
        // Login Logic
        const validUser = registeredUsers.find(u => u.username === username && u.password === password && u.role === role);
        
        if (!validUser && !(role === 'admin' && username === 'admin' && password === 'admin')) {
            alert('Invalid credentials or role! Please check or Sign Up first.');
            return;
        }

        currentUser = { username, role };
        localStorage.setItem('jharkhand_adv_user', JSON.stringify(currentUser));
        document.getElementById('loginPassword').value = '';
        
        showDashboard(currentUser);
        showNotification(`Successfully logged in as: ${username}`);
    }
}
