function getTokenAndGetData() {
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
        // Obtener las credenciales de la sesión
        const username = sessionStorage.getItem('username');
        const password = sessionStorage.getItem('password');

        // Eliminar las credenciales de la sesión
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('password');

        // Intenta obtener el token del almacenamiento local
        var storedToken = sessionStorage.getItem('userToken');

        // Si no hay token en el almacenamiento, solicita al usuario que ingrese uno
        if (!storedToken) {
            storedToken = prompt("Por favor, ingrese su token:");

            // Guarda el token en el almacenamiento local para futuras sesiones
            sessionStorage.setItem('userToken', storedToken);
        }

        return new Promise((resolve, reject) => {
            var request = new XMLHttpRequest();
            request.open('GET', 'https://heroku-autentificacion-dfb5fac1dad8.herokuapp.com/contactos');
            request.setRequestHeader('Authorization', 'Bearer ' + storedToken);
            request.send();

            request.onload = (e) => {
                if (request.status === 200) {
                    const response = request.responseText;
                    const json = JSON.parse(response);

                    console.log("response: " + response);
                    console.log("json: " + JSON.stringify(json));
                    console.log("status_code: " + request.status);

                    const tbody_contactos = document.getElementById("tbody_contactos");
                    tbody_contactos.innerHTML = '';

                    for (let i = 0; i < json.length; i++) {
                        // Tu código para procesar la respuesta exitosa aquí
                        var tr = document.createElement("tr");
                        var td_email = document.createElement("td");
                        var td_nombre = document.createElement("td");
                        var td_telefono = document.createElement("td");
                        var td_opciones = document.createElement("td");

                        td_email.innerHTML = json[i]["email"];
                        td_nombre.innerHTML = json[i]["nombre"];
                        td_telefono.innerHTML = json[i]["telefono"];

                        var enlaceVer = document.createElement('a');
                        enlaceVer.href = 'ver?email=' + json[i]["email"];
                        enlaceVer.textContent = 'Ver';
                        var enlaceEditar = document.createElement('a');
                        enlaceEditar.href = 'editar?email=' + json[i]["email"];
                        enlaceEditar.textContent = 'Editar';
                        var enlaceBorrar = document.createElement('a');
                        enlaceBorrar.href = 'borrar?email=' + json[i]["email"];
                        enlaceBorrar.textContent = 'Borrar';

                        td_opciones.innerHTML = '';

                        td_opciones.appendChild(enlaceVer);
                        td_opciones.appendChild(document.createTextNode('   |   '));
                        td_opciones.appendChild(enlaceEditar);
                        td_opciones.appendChild(document.createTextNode('   |   '));
                        td_opciones.appendChild(enlaceBorrar);

                        tr.appendChild(td_email);
                        tr.appendChild(td_nombre);
                        tr.appendChild(td_telefono);
                        tr.appendChild(td_opciones);

                        tbody_contactos.appendChild(tr);
                    }

                    resolve(); // Resuelve la promesa externa
                } else {
                    // Manejo de errores
                    console.error("Error al realizar la solicitud. Código de estado:", request.status);
                    sessionStorage.removeItem('userToken');

                    if (request.status === 401 || request.status === 403) {
                        // Token inválido
                        alert("Token inválido. Por favor, inicie sesión nuevamente.");
                        sessionStorage.removeItem('userToken');
                    }

                    // Rechaza la promesa externa
                    reject();
                }
            };

            // Manejo de errores de red
            request.onerror = () => {
                console.error("Error de red al realizar la solicitud.");
                sessionStorage.removeItem('userToken');

                // Rechaza la promesa externa
                reject();
            };
        });
    })
    .catch(() => {
        // Redirigir al usuario a la página de inicio ("/") en caso de error
        window.location.href = "/";
        sessionStorage.removeItem('userToken');
    });
}

// Llamada a la función
getTokenAndGetData();
