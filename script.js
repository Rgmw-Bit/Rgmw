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

// 2️⃣ Array de saludos gatunos y con personalidad
const saludos = [
    "Hola, soy Rgmw 😼. ¿Listo para charlar un rato?",
    "Miau 😸… soy Rgmw, tu asistente felino y curioso.",
    "¡Hey! Soy Rgmw 😼. Prepárate para un chat interesante.",
    "Saludos humanos 🐾, soy Rgmw y estoy atento a tus movimientos.",
    "Hola 😺… Rgmw al habla, listo para analizar tus ideas y jugar un poco."
];

// 3️⃣ Función para elegir saludo según comportamiento
function saludoRgmw() {
    if(localStorage.getItem("usuarioExperiencia") === "nuevo") {
        return saludos[0]; // primer saludo para usuarios nuevos
    } else {
        return saludos[Math.floor(Math.random() * saludos.length)];
    }
}

// 4️⃣ Función para agregar mensajes al chat
function addMessage(sender, text) {
    const div = document.createElement("div");
    div.classList.add(sender === "user" ? "userMsg" : "rgmwMsg");
    div.textContent = `${sender === "user" ? "Tú" : "Rgmw"}: ${text}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 5️⃣ Función para generar respuestas simuladas
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

// 6️⃣ Mostrar saludo inicial al cargar
addMessage("rgmw", saludoRgmw());

// 7️⃣ Botón enviar
sendBtn.addEventListener("click", () => {
    const message = userInput.value.trim();
    if (!message) return;
    addMessage("user", message);
    setTimeout(() => addMessage("rgmw", getRgmwResponse(message)), 500);
    userInput.value = "";
    userInput.focus();
});

// 8️⃣ Enviar con Enter
userInput.addEventListener("keydown", e => { if(e.key === "Enter") sendBtn.click(); });

// 9️⃣ Botón Nuevo Chat
newChatBtn.addEventListener("click", () => {
    chatBox.innerHTML = "";
    addMessage("rgmw", "Nuevo chat iniciado. " + saludoRgmw());
});
