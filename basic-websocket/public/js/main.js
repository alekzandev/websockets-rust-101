const outputEl = document.getElementById("output");
const statusEl = document.getElementById("status");
const inputEl = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
let socket;

function connect() {
    socket = new WebSocket("ws://localhost:8080")
    socket.onopen = () => {
        appendMessage("System", "Connected to WebSocket server", "system-message")
        statusEl.textContent = "Status: Connected";
        statusEl.style.color = "green";
    };
    socket.onmessage = (event) => {
        appendMessage("Bot", event.data, "bot-message");
    };
    socket.onclose = () => {
        appendMessage("System", "Disconnected from WebSocket server", "system-message");
        statusEl.textContent = "Status: Disconnected";
        statusEl.style.color = "red";
    };
}

function appendMessage(from, text, className){
    const messageRow = document.createElement("div");
    messageRow.classList.add("message-row", className);
    messageRow.innerHTML = `<span class="message-from">${from}:</span> ${text}`;
    outputEl.appendChild(messageRow);
    outputEl.scrollTop = outputEl.scrollHeight;
}

function sendMessage() {
    const message = inputEl.value.trim();
    if (message && socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
        appendMessage("You", message, "user-message");
        inputEl.value = "";
    }
}
inputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});

sendButton.addEventListener("click", sendMessage);

connect();