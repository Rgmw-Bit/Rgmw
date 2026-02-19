// Elementos del DOM
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");

// 1️⃣ Comprobar si el usuario es nuevo o recurrente
if(!localStorage.getItem("usuarioExperiencia")) {
    localStorage.setItem("usuarioExperiencia", "nuevo");
} else {
    localStorage.setItem("usuarioExperiencia", "recurrente");
}

// 2️⃣ Crear historial de mensajes si no existe
if(!localStorage.getItem("historialRgmw")) {
    localStorage.setItem("historialRgmw", JSON.stringify([]));
}

// 3️⃣ Función para guardar mensajes en historial
function guardarHistorial(usuario, mensaje) {
    const historial = JSON.parse(localStorage.getItem("historialRgmw"));
    historial.push({usuario, mensaje, fecha: new Date()});
    localStorage.setItem("historialRgmw", JSON.stringify(historial));
}

// 4️⃣ Array de saludos gatunos y con personalidad
const saludos = [
    "Hola, soy Rgmw 😼. ¿Listo para charlar un rato?",
    "Miau 😸… soy Rgmw, tu asistente felino y curioso.",
    "¡Hey! Soy Rgmw 😼. Prepárate para un chat interesante.",
    "Saludos humanos 🐾, soy Rgmw y estoy atento a tus movimientos.",
    "Hola 😺… Rgmw al habla, listo para analizar tus ideas y jugar un poco."
];

// 5️⃣ Función para analizar comportamiento del usuario
function analizarComportamiento(msg) {
    msg = msg.toLowerCase();
    if(msg.includes("jugar") || msg.includes("ajedrez") || msg.includes("divertido")) {
        return "jugueton"; 
    }
    if(msg.includes("problema") || msg.includes("analizar")) {
        return "analitico"; 
    }
    if(msg.includes("hola") || msg.includes("hey")) {
        return "amistoso"; 
    }
    return "neutral"; 
}

// 6️⃣ Saludos adaptativos según historial y comportamiento
function saludoAdaptativo() {
    const historial = JSON.parse(localStorage.getItem("historialRgmw"));
    let saludo = "";

    if(historial.length === 0) {
        saludo = "Hola, soy Rgmw 😼. Listo para charlar un rato.";
    } else {
        const ultimo = historial[historial.length - 1].mensaje;
        const comportamiento = analizarComportamiento(ultimo);

        switch(comportamiento) {
            case "jugueton":
                saludo = "Miau 😸… ¡veo que quieres jugar o divertirte!";
                break;
            case "analitico":
                saludo = "Hmm 😼… listo para analizar tus ideas conmigo.";
                break;
            case "amistoso":
                saludo = "¡Hola de nuevo! 😺 Qué gusto verte charlar otra vez.";
                break;
            default:
                saludo = "Hola 😼… ¿qué tal hoy?";
        }
    }

    return saludo;
}

// 7️⃣ Función para agregar mensajes al chat
function addMessage(sender, text) {
    const div = document.createElement("div");
    div.classList.add(sender === "user" ? "userMsg" : "rgmwMsg");
    div.textContent = `${sender === "user" ? "Tú" : "Rgmw"}: ${text}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 8️⃣ Función para generar respuestas simuladas
function getRgmwResponse(msg) {
    msg = msg.toLowerCase();
    const responses = [
        "Interesante... cuéntame más 😼",
        "¡Ja! Eso me hace pensar",
        "Hmm… déjame analizar eso...",
        "¡Claro! Continuemos",
        "¿Quieres hablar de ajedrez o de otra cosa?"
    ];
    if(msg.includes("hola")) return "¡Hola! 😸 Listo para conversar.";
    if(msg.includes("quién eres")) return "Soy Rgmw, tu IA con personalidad de gato profesional.";
    return responses[Math.floor(Math.random() * responses.length)];
}

// 9️⃣ Mostrar saludo inicial al cargar
addMessage("rgmw", saludoAdaptativo());

// 🔟 Botón enviar
sendBtn.addEventListener("click", () => {
    const message = userInput.value.trim();
    if (!message) return;
    addMessage("user", message);
    guardarHistorial("usuario", message);
    setTimeout(() => {
        const respuesta = getRgmwResponse(message);
        addMessage("rgmw", respuesta);
        guardarHistorial("rgmw", respuesta);
    }, 500);
    userInput.value = "";
    userInput.focus();
});

// 1️⃣1️⃣ Enviar con Enter
userInput.addEventListener("keydown", e => { if(e.key === "Enter") sendBtn.click(); });

// 1️⃣2️⃣ Botón Nuevo Chat
newChatBtn.addEventListener("click", () => {
    chatBox.innerHTML = "";
    addMessage("rgmw", "Nuevo chat iniciado. " + saludoAdaptativo());
});
