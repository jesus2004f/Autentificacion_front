const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');

function getTokenAndPerformActions() {
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
    });
}

function getContactDetails() {
    getTokenAndPerformActions()
        .then((token) => {
            var request = new XMLHttpRequest();
            request.open('GET', "https://autentification-front-739523386c7c.herokuapp.com/contactos/" + email);
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
                    handleRequestError(request);
                }
            };
        })
        .catch((error) => {
            handleTokenError(error);
        });
}

function deleteContact() {
    getTokenAndPerformActions()
        .then((token) => {
            if (confirm("¿Estás seguro de que deseas borrar este contacto?")) {
                var request = new XMLHttpRequest();
                request.ophttps://autentification-front-739523386c7c.herokuapp.com/"hps:okuapp.com/contactos/" + email);
                request.setRequestHeader('Authorization', 'Bearer ' + token);
                request.send();

                request.onload = (e) => {
                    if (request.status === 200) {
                        alert("Contacto borrado exitosamente");
                        window.history.back();
                        window.location.href = "/contactos";
                    } else {
                        handleRequestError(request);
                    }
                };
            }
        })
        .catch((error) => {
            handleTokenError(error);
        });
}

function goBack() {
    window.history.back();
}

function handleRequestError(request) {
    console.error("Error en la solicitud. Código de estado:", request.status);
    sessionStorage.removeItem('userToken');
    if (request.status === 401 || request.status === 403) {
        // Token inválido
        alert("Token inválido. Por favor, inicie sesión nuevamente.");
    }
    // Redirigir al usuario a la página de inicio ("/") en caso de error
    window.location.href = "/";
    sessionStorage.removeItem('userToken');
}

function handleTokenError(error) {
    console.error("Error al obtener el token:", error);
    alert("Error al obtener el token: " + error);
    window.location.href = "/";
    sessionStorage.removeItem('userToken');
}

window.onload = getContactDetails;
