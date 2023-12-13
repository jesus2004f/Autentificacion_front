function post() {
    // Obtén el token almacenado en el sessionStorage
    var token = sessionStorage.getItem('userToken');

    // Verifica si se proporcionó el token
    if (!token) {
        alert('Token no disponible. Por favor, inicie sesión.');
        window.location.href = "/"; // Redirige al usuario a la página de inicio de sesión
        sessionStorage.removeItem('userToken');
        return;
    }

    // Obtén los valores de los campos de entrada
    var email = document.getElementById('email').value;
    var nombre = document.getElementById('nombre').value;
    var telefono = document.getElementById('telefono').value;

    // Verifica si se proporcionaron todos los campos
    if (!email || !nombre || !telefono) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    // Crea una solicitud XMLHttpRequest
    var request = new XMLHttpRequest();
    var url = 'https://autentification-front-739523386c7c.herokuapp.com/contactos';  // Modifica la URL según tu servidor local

    request.open('POST', url);
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Authorization', 'Bearer ' + token);

    // Crea el cuerpo de la solicitud en formato JSON
    var requestBody = JSON.stringify({
        email: email,
        nombre: nombre,
        telefono: telefono
    });

    // Envía la solicitud con el cuerpo JSON
    request.send(requestBody);

    // Define la función a ejecutar cuando la solicitud se complete
    request.onload = function () {
        if (request.status === 200) {  // 201 significa creado exitosamente
            // Limpia los campos de entrada después de una operación exitosa
            document.getElementById('email').value = '';
            document.getElementById('nombre').value = '';
            document.getElementById('telefono').value = '';
            alert('Datos guardados exitosamente');
        } else {
            console.error('Error al enviar datos:', request.status, request.statusText);

            if (request.status === 400) {
                alert('El contacto ya existe. Por favor, ingrese un correo diferente.');
            } else {
                alert('Ocurrió un problema al guardar los datos. Por favor, intente nuevamente.');
            }
        }
    };
}
