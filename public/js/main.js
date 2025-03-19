
function connect() {
    socket = new WebSocket("ws://localhost:8080")
    socket.onopen = () => {
        appendMessage("System", "Connected to WebSocket server", "system-message")


    };
}

function appendMessage(from, text, className){

}