const coleccionItems = document.querySelector("#ColeccionItems")
const plantilla_tarjeta = document.querySelector(".ContenedorItem")
plantilla_tarjeta.remove();

const pantallaAgregarItem =document.querySelector(".PantallaAgregarItem")

fetch("http://localhost:3000/").then(recurso =>recurso.json()).then(archivo =>{
    for(i=0;i< archivo.arreglo.length; i++)
    {
        var clon = plantilla_tarjeta.cloneNode(true);
        coleccionItems.appendChild(clon);

        const Titulo = clon.querySelector(".Titulo");
        Titulo.innerHTML = archivo.arreglo[i].Titulo;

        
        const Descripcion = clon.querySelector(".Descripcion");
        Descripcion.innerHTML = archivo.arreglo[i].Descripcion;

        const Imagen = clon.querySelector(".Imagen");
        Imagen.style.backgroundImage = "url('http://localhost:3000/"+archivo.arreglo[i].imagen+"')";

        //console.log(archivo.arreglo[i].Imagen);
        //Imagen.src = archivo.arreglo[i].Imagen;
    }
    coleccionItems.appendChild(pantallaAgregarItem);
})

function crearNuevaTarjeta()
{
    var clon = plantilla_tarjeta.cloneNode(true);
    coleccionItems.appendChild(clon);
    coleccionItems.appendChild(pantallaAgregarItem);

    const PanelCreacionItem = clon.querySelector(".PanelCreacionItem");
    PanelCreacionItem.style.display = "flex";

    const CrearItem_InputTitulo = clon.querySelector(".CrearItem_InputTitulo");
    const ImagenPreview = clon.querySelector(".ImagenPreview");
    const input_imagen = clon.querySelector(".input_imagen");
    const input_descripcion = clon.querySelector("textarea");
    const boton_cancelar = clon.querySelector(".boton_cancelar");
    const boton_guardar = clon.querySelector(".boton_guardar");

    input_imagen.addEventListener("change",()=>{

        const reader = new FileReader();
        reader.readAsDataURL(input_imagen.files[0]);
        reader.onload=()=>{
            ImagenPreview.src = reader.result;
        }
    });

    boton_guardar.addEventListener("click", ()=>{

        //console.log(input_imagen.files[0])

        var objeto_info_tarjeta = {
            "titulo": CrearItem_InputTitulo.value,
            "descripcion": input_descripcion.value,
            "imagen":ImagenPreview.src,
            "formato":input_imagen.files[0].name
        }

        fetch("http://localhost:3000/", {
            method:"POST",
            body: JSON.stringify(objeto_info_tarjeta)
        }).then(recurso => recurso.json()).then(respuesta =>{
            alert(respuesta.mensaje);
        });
    });

}