const WebSocket = require("ws");

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("WebSocket connection established");

    // Send a welcome message
    ws.send(JSON.stringify({ message: "Connected to WebSocket" }));

    // Handle messages from the client
    ws.on("message", (data) => {
      console.log("Received from client:", data);
    });

    // Handle translation updates
    ws.on("translation-progress", (update) => {
      ws.send(JSON.stringify({ type: "progress", data: update }));
    });

    // Handle WebSocket closure
    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
  });

  return wss;
}

module.exports = { setupWebSocket };
