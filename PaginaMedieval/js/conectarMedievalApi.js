const coleccionItems = document.querySelector("#ColeccionItems")
const plantilla_tarjeta = document.querySelector(".ContenedorItem")
plantilla_tarjeta.remove();

const pantallaAgregarItem =document.querySelector(".PantallaAgregarItem")

fetch("http://localhost:3000/").then(recurso => recurso.json()).then(archivo => {
    for(i=0; i < archivo.arreglo.length; i++)
        {
        var clon = plantilla_tarjeta.cloneNode(true);
        coleccionItems.appendChild(clon);

        const Titulo = clon.querySelector(".Titulo");
        Titulo.innerHTML = archivo.arreglo[i].Titulo;

        const Descripcion = clon.querySelector(".Descripcion");
        Descripcion.innerHTML = archivo.arreglo[i].Descripcion;

        const Imagen = clon.querySelector(".Imagen");
        Imagen.style.backgroundImage = "url('http://localhost:3000/" + archivo.arreglo[i].imagen + "')";

        const Icono_Editar = clon.querySelector(".Icono_Editar");
        const PanelCreacionItem = clon.querySelector(".PanelCreacionItem");

        const boton_guardar = PanelCreacionItem.querySelector(".boton_guardar");

        const CrearItem_InputTitulo = PanelCreacionItem.querySelector(".CrearItem_InputTitulo");
        const CampoEdicionDescripcion = PanelCreacionItem.querySelector("textarea");
        const ImagenPreview = PanelCreacionItem.querySelector(".ImagenPreview")

        Icono_Editar.urlImagen = "http://localhost:3000/" + archivo.arreglo[i].imagen;

        const input_imagen = PanelCreacionItem.querySelector(".input_imagen");
        input_imagen.addEventListener("change", function(){
            const reader = new FileReader();
            const archivo = input_imagen.files[0];
            reader.readAsDataURL(archivo);
            boton_guardar.nombre_imagen = archivo.name;
            reader.onload = function(){
                console.log(reader.result);
                ImagenPreview.src = reader.result;
            }
        })


        Icono_Editar.addEventListener("click", function(evento){
            PanelCreacionItem.style.display = "flex";

            CrearItem_InputTitulo.value = Titulo.innerHTML;
            CampoEdicionDescripcion.value = Descripcion.innerHTML;

            fetch(evento.currentTarget.urlImagen).then(recurso => recurso.blob()).then(archivo =>{
                
                //const imagen_base64 = URL.createObjectURL(archivo);
                //console.log(imagen_base64);

                const reader = new FileReader();
                reader.readAsDataURL(archivo);
                reader.onload = function(){
                    ImagenPreview.src = reader.result;
                }
            })

            //alert(evento.currentTarget.urlImagen);

            //ImagenPreview.src = evento.currentTarget.urlImagen;

        })
            const boton_cancelar = PanelCreacionItem.querySelector(".boton_cancelar");
            boton_cancelar.addEventListener("click", ()=>{
                PanelCreacionItem.style.display = "none";
            })


        boton_guardar.id = archivo.arreglo[i].id;
        boton_guardar.addEventListener("click", function(evento){

            const objeto_inf_actualizada = {
                "id": evento.currentTarget.id,
                "titulo": CrearItem_InputTitulo.value,
                "descripcion":CampoEdicionDescripcion.value,
                "imagen": ImagenPreview.src,
                "nombre": evento.currentTarget.nombre_imagen
            }
            fetch("http://localhost:3000/", {
                method: "PUT",
                body:JSON.stringify(objeto_inf_actualizada)
            })
        })
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
    })

    boton_guardar.addEventListener("click", () => {

        let objeto_info_tarjeta = {
            "titulo": CrearItem_InputTitulo.value,
            "descripcion": input_descripcion.value,
            "imagen": ImagenPreview.src,
            "nombre": input_imagen.files[0].name
        }

        fetch("http://localhost:3000", {
            method: "POST",
            body: JSON.stringify(objeto_info_tarjeta)
        }).then(recurso => recurso.json()).then(respuesta => {
            alert(respuesta.mensaje)
            window.location.reload()
        })
    })
}