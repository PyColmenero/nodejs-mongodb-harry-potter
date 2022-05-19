$(document).ready(importar);
let ddbb = $("#ddbb");
let collection = $("#collection");
let inserts = $("#inserts");

function importar() {

    $.ajax({
        url: "http://localhost:777/importarDDBB",
        dataType: "json",
        success: function(response) {

            console.log(response);
            ddbb.html(response.ddbb);
            collection.html(response.collection);

            if (response.inserts.length != 0) {
                response.inserts = response.inserts.map(i => "<li><code>" + i + "</code></li>")
                inserts.html("<ul>" + response.inserts.join("") + "</ul>");
            } else {
                inserts.html("<code>No se ha insertado nada. Todos los personajes ya están en la base de datos. Puedes probar a borrar alguno <a href='./'>aquí</a>.</code>");
            }
        }
    });

}