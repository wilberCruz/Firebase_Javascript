var database = firebase.database();
document.querySelector("#update").style.display = 'None';
leer();


document.querySelector("#formulario").addEventListener("submit", function(e) {
    e.preventDefault();
    guardar(e.target.nombre.value, e.target.correo.value);
    e.reset;
});

document.querySelector("#update").addEventListener("click", function(e) {
    loQueEditar.update({
        nombre: document.getElementById("nombre").value,
        correo: document.getElementById("email").value
    });
    document.getElementById("nombre").value = "";
    document.getElementById("email").value = "";
    document.querySelector("#update").style.display = 'None';
    document.querySelector("#enviar").style.display = 'Block';
});



function guardar(n, e) {
    firebase.database().ref('datos/').push({
        nombre: n,
        correo: e,
    });
    document.querySelector("#formulario").reset();
}

function leer() {
    ref = database.ref().child("datos");
    ref.on("value", function(snap) {
        var datos = snap.val();
        var tabla = "";
        for (var key in datos) {
            tabla += `
            <tr>
            <td>${datos[key].nombre}</td>
            <td>${datos[key].correo}</td>
            <td><button class="borrar red-text" borra=${key}><i class="material-icons">delete</i></button>
            <button class="editar green-text" edita=${key}><i class="material-icons">edit</i></button>
            </td>
            </tr>`

        }
        document.querySelector("#mostrarDatos").innerHTML = tabla;
        if (tabla != "") {
            var elemBorrar = document.getElementsByClassName("borrar");
            for (var i = 0; i < elemBorrar.length; i++) {
                elemBorrar[i].addEventListener("click", borrarDatos, false);
            }
            var elemEditar = document.getElementsByClassName("editar");
            for (var i = 0; i < elemEditar.length; i++) {
                elemEditar[i].addEventListener("click", editarDatos, false);
            }
        }
    });
}

function editarDatos() {
    document.querySelector("#enviar").style.display = 'None';
    document.querySelector("#update").style.display = 'block';

    var queEditar = this.getAttribute("edita");
    loQueEditar = ref.child(queEditar);
    loQueEditar.once("value", function(snap) {
        var d = snap.val();
        document.getElementById("nombre").value = d.nombre;
        document.getElementById("email").value = d.correo;
    });
}



function borrarDatos() {
    var queBorrar = this.getAttribute("borra");
    var loQueBorrar = ref.child(queBorrar);
    loQueBorrar.remove();

}