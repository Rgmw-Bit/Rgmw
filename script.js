// ================================
// Rgmw IA — Script Completo con cerebro real
// ================================

// Elementos del DOM
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");

// ================================
// Memoria básica
// ================================
if(!localStorage.getItem("historialRgmw")){
    localStorage.setItem("historialRgmw", JSON.stringify([]));
}

function guardarHistorial(usuario, mensaje){
    const historial = JSON.parse(localStorage.getItem("historialRgmw"));
    historial.push({usuario, mensaje, fecha: new Date()});
    localStorage.setItem("historialRgmw", JSON.stringify(historial));
}

// ================================
// Mostrar mensajes
// ================================
function addMessage(sender, text){

    const div = document.createElement("div");

    if(sender === "user"){
        div.className = "userMsg";
        div.textContent = "Tú: " + text;
    }else{
        div.className = "rgmwMsg";
        div.textContent = "Rgmw: " + text;
    }

    chatBox.appendChild(div);

    chatBox.scrollTop = chatBox.scrollHeight;
}

// ================================
// Saludo inicial
// ================================
addMessage("rgmw","Hola. Soy Rgmw 😼. Estoy listo para ayudarte.");

// ================================
// Detectar tipo de mensaje
// ================================
function esPregunta(msg){

    msg = msg.toLowerCase();

    const palabrasPregunta = [
        "que",
        "quien",
        "cuando",
        "donde",
        "por que",
        "como",
        "cuanto",
        "cual"
    ];

    for(let palabra of palabrasPregunta){
        if(msg.includes(palabra)){
            return true;
        }
    }

    return false;
}

// ================================
// Cerebro real — buscar en Wikipedia
// ================================
async function buscarWikipedia(consulta){

    try{

        const url =
        "https://es.wikipedia.org/api/rest_v1/page/summary/" +
        encodeURIComponent(consulta);

        const respuesta = await fetch(url);

        if(!respuesta.ok){
            return null;
        }

        const data = await respuesta.json();

        if(data.extract){
            return data.extract;
        }

        return null;

    }catch(error){

        return null;

    }
}

// ================================
// Generar respuesta inteligente
// ================================
async function generarRespuesta(msg){

    msg = msg.toLowerCase();

    // respuestas básicas
    if(msg === "hola"){
        return "Hola 😸";
    }

    if(msg === "como estas"){
        return "Funcionando correctamente.";
    }

    if(msg === "2+2"){
        return "2 + 2 = 4";
    }

    // si es pregunta → investigar
    if(esPregunta(msg)){

        addMessage("rgmw","Investigando...");

        const info = await buscarWikipedia(msg);

        if(info){
            return info;
        }else{
            return "No encontré información suficiente.";
        }

    }

    // respuesta por defecto
    return "Entendido.";
}

// ================================
// Enviar mensaje
// ================================
sendBtn.addEventListener("click", async ()=>{

    const mensaje = userInput.value.trim();

    if(mensaje === "") return;

    addMessage("user",mensaje);

    guardarHistorial("usuario",mensaje);

    userInput.value = "";

    const respuesta = await generarRespuesta(mensaje);

    addMessage("rgmw",respuesta);

    guardarHistorial("rgmw",respuesta);

});

// ================================
// Enter para enviar
// ================================
userInput.addEventListener("keydown", function(e){

    if(e.key === "Enter"){
        sendBtn.click();
    }

});

// ================================
// Nuevo chat
// ================================
newChatBtn.addEventListener("click", ()=>{

    chatBox.innerHTML = "";

    addMessage("rgmw","Nuevo chat iniciado.");

});
