let socket;
async function connectToWebPubSub() {
  try {
    const response = await fetch("http://localhost:5000/api/negotiate");
    if (!response.ok) {
      console.error("Failed to negotiate, status code =", response.status);
      return;
    }
    const data = await response.json();
    console.log("🔗 Negotiated WebSocket URL:", data.url);
    socket = io(data.url, {
      path: "/clients/socketio/hubs/socketio",
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to Web PubSub for Socket.IO");
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from Web PubSub");
    });
    socket.on("message", (msg) => {
      console.log("Received:", msg);
      displayMessage(msg);
    });

    sendMessage();
  } catch (error) {
    console.error(" Error connecting to Web PubSub:", error.message);
  }
}
function sendMessage() {
  const messageInput = document.getElementById("messageInput");
  const message = messageInput.value.trim();
  if (message && socket) {
    socket.emit("message", message);
    console.log("📤 Message sent via WebSocket!");
    messageInput.value = "";
  }
}
function displayMessage(msg) {
  const messagesDiv = document.getElementById("messages");
  const messageElement = document.createElement("div");
  messageElement.textContent = msg;
  messagesDiv.appendChild(messageElement);
}
connectToWebPubSub();
