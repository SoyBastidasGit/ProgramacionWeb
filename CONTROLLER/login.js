function login() {
    var username = document.getElementsByName("usrName")[0].value;
    var password = document.getElementsByName("usrPass")[0].value;
    if (username === "Daniel" && password === "123") {
        window.location.href = "VIEW/dashboard.html";
    } else {
        alert("Usuario y/o contraseña incorrectos");
    }
}