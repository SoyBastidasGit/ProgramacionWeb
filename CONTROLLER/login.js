function login() {
    var username = document.getElementsById("usrName").value;
    var password = document.getElementsById("usrPass").value;
    if (username == "Daniel" && password == "123") {
        window.location.href = "VIEW/dashboard.html";
    } else {
        alert("Usuario y/o contraseña incorrectos");
    }
}