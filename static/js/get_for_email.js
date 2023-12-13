function getTokenAndFetchByEmail() {
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

function getForEmail() {
    getTokenAndFetchByEmail()
        .then((token) => {
            var email = document.getElementById("email").value;
            var request = new XMLHttpRequest();
            var url = "https://heroku-autentificacion-dfb5fac1dad8.herokuapp.com/contactos/" + encodeURIComponent(email);
            request.open('GET', url);
            request.setRequestHeader('Authorization', 'Bearer ' + token);
            request.send();

            if (!email) {
                alert('Por favor, ingrese un valor.');
                return;
            }

            request.onload = (e) => {
                const response = request.responseText;
                const json = JSON.parse(response);

                console.log("response: " + response);
                console.log("json: " + JSON.stringify(json));
                console.log("status_code: " + request.status);

                const tbody_contactos = document.getElementById("tbody_contactos");
                tbody_contactos.innerHTML = '';

                if (response !== "null") {
                    var tr = document.createElement("tr");
                    var td_email = document.createElement("td");
                    var td_nombre = document.createElement("td");
                    var td_telefono = document.createElement("td");
                    var td_opciones = document.createElement("td");

                    td_email.innerHTML = json["email"];
                    td_nombre.innerHTML = json["nombre"];
                    td_telefono.innerHTML = json["telefono"];

                    var enlaceVer = document.createElement('a');
                    enlaceVer.href = 'ver?email=' + json["email"];
                    enlaceVer.textContent = 'Ver';
                    var enlaceEditar = document.createElement('a');
                    enlaceEditar.href = 'editar?email=' + json["email"];
                    enlaceEditar.textContent = 'Editar';
                    var enlaceBorrar = document.createElement('a');
                    enlaceBorrar.href = 'borrar?email=' + json["email"];
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
                } else {
                    var tr = document.createElement("tr");
                    var td_error = document.createElement("td");

                    td_error.setAttribute("colspan", "4");
                    td_error.textContent = 'No se encontró ningún contacto con ese email.';

                    tr.appendChild(td_error);

                    tbody_contactos.appendChild(tr);
                }
            };
        })
        .catch((error) => {
            handleTokenError(error);
        });
}
