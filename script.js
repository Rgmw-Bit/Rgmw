// ================================
// Rgmw IA Completa
// Chat + Cerebro + Ajedrez
// ================================

// ================================
// ELEMENTOS DOM
// ================================

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");

const chessBtn = document.getElementById("chessBtn");
const chessContainer = document.getElementById("chessContainer");


// ================================
// MEMORIA
// ================================

if(!localStorage.getItem("historialRgmw")){
    localStorage.setItem("historialRgmw", JSON.stringify([]));
}

function guardarHistorial(usuario,mensaje){

    const historial =
    JSON.parse(localStorage.getItem("historialRgmw"));

    historial.push({
        usuario,
        mensaje,
        fecha:new Date()
    });

    localStorage.setItem(
        "historialRgmw",
        JSON.stringify(historial)
    );
}


// ================================
// MOSTRAR MENSAJES
// ================================

function addMessage(sender,text){

    const div=document.createElement("div");

    if(sender==="user"){
        div.className="userMsg";
        div.textContent="Tú: "+text;
    }else{
        div.className="rgmwMsg";
        div.textContent="Rgmw: "+text;
    }

    chatBox.appendChild(div);

    chatBox.scrollTop=
    chatBox.scrollHeight;

}


// ================================
// SALUDO
// ================================

addMessage("rgmw",
"Hola. Soy Rgmw 😼");

// ================================
// DETECTAR PREGUNTAS
// ================================

function esPregunta(msg){

    const palabras=[
        "que",
        "quien",
        "cuando",
        "donde",
        "por que",
        "como",
        "cuanto",
        "cual"
    ];

    msg=msg.toLowerCase();

    for(let p of palabras){
        if(msg.includes(p)) return true;
    }

    return false;
}


// ================================
// BUSCAR WIKIPEDIA
// ================================

async function buscarWikipedia(consulta){

    try{

        const url=
        "https://es.wikipedia.org/api/rest_v1/page/summary/"
        +encodeURIComponent(consulta);

        const r=await fetch(url);

        if(!r.ok) return null;

        const data=await r.json();

        return data.extract;

    }catch{

        return null;

    }

}


// ================================
// GENERAR RESPUESTA
// ================================

async function generarRespuesta(msg){

    const lower=msg.toLowerCase();

    if(lower==="hola")
        return "Hola 😸";

    if(lower==="2+2")
        return "4";

    if(esPregunta(lower)){

        addMessage("rgmw",
        "Investigando...");

        const info=
        await buscarWikipedia(msg);

        if(info)
            return info;

        return "No encontré información.";

    }

    return "Entendido.";

}


// ================================
// ENVIAR MENSAJE
// ================================

sendBtn.onclick=async()=>{

    const msg=
    userInput.value.trim();

    if(!msg) return;

    addMessage("user",msg);

    guardarHistorial("user",msg);

    userInput.value="";

    const resp=
    await generarRespuesta(msg);

    addMessage("rgmw",resp);

    guardarHistorial("rgmw",resp);

};


userInput.onkeydown=(e)=>{

    if(e.key==="Enter")
        sendBtn.click();

};


// ================================
// NUEVO CHAT
// ================================

newChatBtn.onclick=()=>{

    chatBox.innerHTML="";

    addMessage("rgmw",
    "Nuevo chat.");

};


// ================================
// AJEDREZ
// ================================

let tablero=[];
let seleccion=null;


chessBtn.onclick=()=>{

    if(chessContainer.style.display==="none"){

        chessContainer.style.display="block";

        iniciarTablero();

    }else{

        chessContainer.style.display="none";

    }

};


function iniciarTablero(){

    chessContainer.innerHTML="";

    tablero=[];

    const table=
    document.createElement("table");

    const blancas=
    ["♖","♘","♗","♕","♔","♗","♘","♖"];

    const negras=
    ["♜","♞","♝","♛","♚","♝","♞","♜"];


    for(let i=0;i<8;i++){

        const fila=[];

        const tr=
        document.createElement("tr");

        for(let j=0;j<8;j++){

            const td=
            document.createElement("td");

            td.dataset.row=i;
            td.dataset.col=j;

            td.onclick=()=>
            moverPieza(i,j,td);

            tr.appendChild(td);

            fila.push(null);

        }

        table.appendChild(tr);

        tablero.push(fila);

    }


    for(let j=0;j<8;j++){

        tablero[0][j]=negras[j];
        tablero[1][j]="♟";

        tablero[6][j]="♙";
        tablero[7][j]=blancas[j];

        table.rows[0].cells[j]
        .textContent=negras[j];

        table.rows[1].cells[j]
        .textContent="♟";

        table.rows[6].cells[j]
        .textContent="♙";

        table.rows[7].cells[j]
        .textContent=blancas[j];

    }

    chessContainer.appendChild(table);

}


function movimientoValido(
pieza,fr,fc,tr,tc){

    const dr=tr-fr;
    const dc=tc-fc;

    switch(pieza){

        case "♙":
            return dr===-1&&dc===0;

        case "♟":
            return dr===1&&dc===0;

        case "♖":case"♜":
            return dr===0||dc===0;

        case "♘":case"♞":
            return(
            Math.abs(dr)===2
            &&Math.abs(dc)===1
            ||
            Math.abs(dr)===1
            &&Math.abs(dc)===2
            );

        case "♗":case"♝":
            return Math.abs(dr)===Math.abs(dc);

        case "♕":case"♛":
            return(
            dr===0
            ||dc===0
            ||Math.abs(dr)
            ===Math.abs(dc)
            );

        case "♔":case"♚":
            return Math.abs(dr)<=1
            &&Math.abs(dc)<=1;

    }

    return false;

}


function moverPieza(r,c,td){

    if(seleccion==null){

        if(tablero[r][c]){

            seleccion={
                r,c,
                pieza:tablero[r][c]
            };

            td.style.outline=
            "3px solid orange";

        }

    }else{

        if(movimientoValido(
        seleccion.pieza,
        seleccion.r,
        seleccion.c,
        r,c)){

            tablero[r][c]=
            seleccion.pieza;

            tablero[
            seleccion.r]
            [seleccion.c]=null;

            iniciarTablero();

        }

        seleccion=null;

    }

}
