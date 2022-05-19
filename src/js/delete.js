$(document).on("click", ".borrar", borrar);

function borrar() {

    let url = "http://localhost:777/delete?name=";
    url += $(this).data("name");
    console.log(url);

    $.ajax({
        url: url,
        dataType: "json",
        success: function(response) {
            console.log(response);

            if (response.ok) {
                alert("Borrado correctamente", "success");
            } else {
                alert("Fallo al borrar", "danger");
            }
            createTable()
        }
    });

}

let alerta = $('#alert');