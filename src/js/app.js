$(document).ready(createTable);
let info = $("#info");

let filtros = $(".filter");
let filter;
filtros.click(function(e) {

    filter = $(this).data("filter");

    createTable();

})

function createTable() {

    let url = "http://localhost:777/find";

    $.ajax("http://localhost:777/find", {
        type: 'POST',
        data: { "filter": filter },
        success: function(response, status, xhr) {
            // alert('status: ' + status, "success");
            generateTable(response);
        },
        error: function(jqXhr, textStatus, errorMessage) {
            alert('Error: ' + errorMessage, "danger");
            console.log(jqXhr);
        }
    });
}

let charactersTable = $("#charactersTable");

function generateTable(characters) {

    let table = "";
    let index = 0;
    characters.forEach(element => {
        let house = (element.house) ? element.house : "<b class='text-danger'>No information</b>";
        let yearOfBirth = (element.yearOfBirth) ? element.yearOfBirth : "<b class='text-danger'>No information</b>";
        if (element.image) {
            image = "<img src='" + element.image + "' alt='Retrato del personaje' width='100px' class='rounded-circle'>";
        } else {
            image = "<b class='text-danger'>No information</b>";
        }

        table += "<tr>"
        table += "  <td><div>" + (++index) + "</div></td>"
        table += "  <td>" + image + "</td>"
        table += "  <td><div>" + element.name + "</div></td>"
        table += "  <td><div>" + element.species + "</div></td>"
        table += "  <td><div>" + element.gender + "</div></td>"
        table += "  <td><div>" + house + "</div></td>"
        table += "  <td><div>" + yearOfBirth + "</div></td>"
        table += "  <td><div> <button class='btn btn-danger w-100 rounded-0 borrar' data-name='" + element.name + "'>BORRAR</button> </div></td>"
        table += "</tr>"
    });
    charactersTable.html(table);
}

function alert(message, type) {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'

    alerta.append(wrapper);
}