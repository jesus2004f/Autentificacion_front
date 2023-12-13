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
    });
}

function getContactDetails() {
    getTokenAndFetchContactDetails()
        .then((token) => {
            var request = new XMLHttpRequest();
            request.open('GET', "https://autentification-front-739523386c7c.herokuapp.com/contactos/" + email);
            request.setRequestHeader('Authorization', 'Bearer ' + token);
            request.send();

            request.onload = function () {
                if (request.status === 200) {
                    const response = request.responseText;
                    const json = JSON.parse(response);

                    // Ahora, asignamos los valores a los campos de entrada
                    document.getElementById('email').value = json.email;
                    document.getElementById('nombre').value = json.nombre;
                    document.getElementById('telefono').value = json.telefono;
                } else {
                    console.error('Error fetching contact details:', request.status, request.statusText);
                    alert('Error fetching contact details. Please try again later.');
                }
            };
        })
        .catch((error) => {
            handleTokenError(error);
        });
}

window.onload = getContactDetails;

function goBack() {
    window.history.back();
}

function editar() {
    getTokenAndFetchContactDetails()
        .then((token) => {
            var newEmail = document.getElementById('email').value;
            var newNombre = document.getElementById('nombre').value;
            var newTelefono = document.getElementById('telefono').value;

            if (!newEmail || !newNombre || !newTelefono) {
                alert('Por favor, complete todos los campos.');
                return;
            }

            if (confirm("¿Estás seguro de que deseas actualizar este contacto?")) {
                var request = new XMLHttpRequest();
                request.open('PUT', "https://autentification-front-739523386c7c.herokuapp.com/contactos/" + email);
                request.setRequestHeader("Content-Type", "application/json");
                request.setRequestHeader('Authorization', 'Bearer ' + token);

                var updatedData = {
                    email: newEmail,
                    nombre: newNombre,
                    telefono: newTelefono
                };

                request.send(JSON.stringify(updatedData));

                request.onload = function () {
                    if (request.status === 200) {
                        alert("Contacto actualizado exitosamente");
                        window.history.back();
                        window.location.href = "/contactos";
                    } else {
                        console.error('Error updating contact details:', request.status, request.statusText);
                        alert('Error updating contact details. Please try again later.');
                    }
                }
            }
        })
        .catch((error) => {
            handleTokenError(error);
        });
}
