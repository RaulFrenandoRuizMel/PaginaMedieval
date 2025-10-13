const http = require("node:http");
const fs = require("node:fs");

const puerto = 3000;

var archivo = JSON.parse(fs.readFileSync("./guerreros.json").toString());
var id_actual =0;

for(i=0; i<archivo.arreglo.length; i++)
{
    if(archivo.arreglo[i]> id_actual)
    {
        id_actual= archivo.arreglo[i].id;
    }
}
id_actual++;
console.log(id_actual);

const server = http.createServer((request, response) => {
    response.setHeader("Access-Control-Allow-Origin","*");
    
    switch(request.method){
        case "GET":
            if(request.url == "/")
                {   
                    response.statusCode = 200;
                    response.setHeader("Content-Type", "application/json");
                    response.end(JSON.stringify(archivo));
                    return 0;
                }
            
                //console.log(request.url);
                fs.readFile("./img"+request.url, (err, file)=>{
                    if(err)
                    {
                        response.statusCode = 404;
                        response.setHeader("Content-Type", "application/json");
                        const objeto_error = {
                            "mensaje": "esa imagen no la tengo"
                        }
                        response.end(JSON.stringify(objeto_error));
                        return 0;
                    }
                    response.statusCode = 200;
                    response.end(file);
                });                      
        break;
        case "POST":
            var informacion = "";

            request.on("data", info =>{
                informacion += info.toString();
            });

            request.on("end", ()=>{
                const objeto_tarjeta = JSON.parse(informacion);

                const imagen_base64 = objeto_tarjeta.imagen.split(',')[1];

                const imagen_buffer = Buffer.from(objeto_tarjeta.imagen, "base64");

                const nombre_cortado = objeto_tarjeta.nombre.split('.');

                const formato_imagen = nombre_cortado[nombre_cortado.length-1];

                console.log(formato_imagen);

                fs.writeFile("./img/"+id_actual+"."+formato_imagen, imagen_buffer, (err) => {
                    if(err)
                    {
                        console.log(err);
                    }
                    else{

                        const objeto_respuesta = {
                            "mensaje": "elemento guardado"
                        }

                        const objeto_tarjeta_a_guardar = {
                            "id": id_actual,
                            "titulo":objeto_tarjeta.titulo,
                            "descripcion": objeto_tarjeta.descripcion,
                            "imagen": id_actual+"."+formato_imagen
                        }

                        archivo.arreglo.push(objeto_tarjeta_a_guardar);

                        fs.writeFile("./guerreros.json", JSON.stringify(archivo), (err)=>{
                            if (err)
                            {

                            }
                            else
                            {
                                id_actual++;

                                response.statusCode = 200,
                                response.setHeader("Content-Type", "application/json");
                                response.end(JSON.stringify(objeto_respuesta));
                            }
                        })

                    }
                });

                //archivo.
            });
        break;
    }
});
server.listen(puerto,()=>{
    console.log("Server a la escucha en el puerto http://localhost:"+puerto)
})