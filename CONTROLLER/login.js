const username = document.getElementById('usrName')
const password = document.getElementById('usrPass')
const button = document.getElementById('button')

button.addEventListener('click', (e) => {
    e.preventDefault()
    const data = {
        username: username.value,
        password: password.value
    }

    console.log(data)
})