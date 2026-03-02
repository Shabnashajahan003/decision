/* Navigate to Signup Page */
function goSignup() {
    window.location.href = "signup.html";
}

/* Navigate to Login Page */
function goLogin() {
    window.location.href = "login.html";
}

/* Signup Function */
function signup() {

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("signupMsg");

    if (!name || !email || !password) {
        msg.innerText = "Please fill all fields";
        return;
    }

    fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password
        })
    })
    .then(res => res.text())
    .then(data => {
        msg.innerText = data;

        if (data.toLowerCase().includes("successful")) {
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);
        }
    })
    .catch(() => {
        msg.innerText = "Server not responding";
    });
}

/* Login Function */
function login() {

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const msg = document.getElementById("loginMsg");

    if (!email || !password) {
        msg.innerText = "Please enter email and password";
        return;
    }

    fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("userEmail", email);
            window.location.href = "dashboard.html";
        } else {
            msg.innerText = data.message;
        }
    })
    .catch(() => {
        msg.innerText = "Unable to connect to server";
    });
}
