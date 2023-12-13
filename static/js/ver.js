const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');

function getTokenAndFetchContactDetails() {
    return new Promise((resolve, reject) => {
        const storedToken = sessionStorage.getItem('userToken');

        if (storedToken) {
            resolve(storedToken);
        } else {
            const userToken = prompt("Por favor, ingrese su token:");

            if (userToken) {
                sessionStorage.setItem('userToken', userToken);
                resolve(userToken);
            } else {
                reject("Token no ingresado");
            }
        }
    })
    .then((token) => {
        // Modifica la URL para apuntar a tu servidor local
        var request = new XMLHttpRequest();
        request.open('GET', "https://heroku-autentificacion-dfb5fac1dad8.herokuapp.com/contactos/" + email);
        request.setRequestHeader('Authorization', 'Bearer ' + token);
        request.send();

        request.onload = (e) => {
            if (request.status === 200) {
                const response = request.responseText;
                const json = JSON.parse(response);

                document.getElementById('email').textContent = json.email;
                document.getElementById('nombre').textContent = json.nombre;
                document.getElementById('telefono').textContent = json.telefono;
                console.log(json.email);
            } else {
                // Manejo de errores
                console.error("Error al obtener detalles del contacto. Código de estado:", request.status);
                
                if (request.status === 401 || request.status === 403) {
                    // Token inválido o no proporcionado
                    sessionStorage.removeItem('userToken');
                    alert("Token inválido o no proporcionado. Por favor, inicie sesión nuevamente.");
                    // Redirigir al usuario a la página de inicio de sesión ("/login") u otra según tu aplicación
                    window.location.href = "/";
                }
            }
        };
    })
    .catch((error) => {
        // Redirigir al usuario a la página de inicio de sesión ("/login") en caso de error al obtener el token
        alert("Error al obtener el token: " + error);
        sessionStorage.removeItem('userToken');
        window.location.href = "/";
    });
}

window.onload = getTokenAndFetchContactDetails;

function goBack() {
    window.history.back();
}
