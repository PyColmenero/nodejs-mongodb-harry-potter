let agregar = $("#agregar");
let formulario = $("#formulario");
let formulario_info = $("#formulario_info");

let alertaNew = $("#alert2");

agregar.click(function() {

    let character = objectifyForm(formulario.serializeArray());


    if (character.name && character.species && character.yearOfBirth && character.gender && character.house) {
        $.ajax({
            type: "POST",
            url: "http://localhost:777/new",
            data: character,
            dataType: "json",
            success: function(response) {

                if (response.error) {
                    alert(response.error, "danger");
                } else {
                    if (response.inserts.length == 0) {
                        alert("Error, ya existe un personaje con ese nombre", "danger");
                    } else {
                        alert(response.inserts[0], "success");
                    }
                }

                createTable();
            }
        });
    } else {
        alert("Faltan datos obligatorios.", "danger");
    }

});

function objectifyForm(formArray) {
    //serialize data function
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
}