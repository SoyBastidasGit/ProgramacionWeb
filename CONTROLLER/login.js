const username = document.getElementById('usrName');
const password = document.getElementById('usrPass');
const button = document.getElementById('button');

button.addEventListener('click', (e) => {
    e.preventDefault();
    const data = {
        username: username.value,
        password: password.value
    };

    if (data.username === "Bastidas" && data.password === "123") {
        window.location.href = "VIEW/dashboard.html";
    } else {
        alert("Usuario o contraseña incorrectos");
    }
});
