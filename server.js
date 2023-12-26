const net = require("node:net");
const server = net.createServer();
const clients = [];
const PORT = 3008;
const IP = "172.31.11.146";
server.on("connection", (socket) => {
  const clientId = clients.length + 1;
  console.log("A new connection to the server.");
  socket.write(`id-${clientId}`);
  clients.map((client) => {
    client.socket.write(`User ${clientId} joined`);
  });
  socket.on("data", (data) => {
    // console.log(data.toString("utf-8"));
    const dataString = data.toString("utf-8");
    const id = dataString.substring(0, dataString.indexOf("-"));
    const message = dataString.substring(dataString.indexOf("-message-") + 9);
    clients.map((s) => {
      s.socket.write(`> User ${id}: ${message}`);
    });
  });
  socket.on("end", () => {
    clients.map((client) => {
      client.socket.write(`User ${clientId} exited`);
    });
  });
  // If you are on Windows, you probably have noticed that when you shut down one of the clients
  // using Control + c, the whole server goes down instead of everyone receiving a "User <id> left"
  // message. On Windows, instead of getting an 'end' event, we will get an 'error' event in that case.
  socket.on("error", () => {
    clients.map((client) => {
      client.socket.write(`User ${clientId} exited`);
    });
  });
  clients.push({ id: clientId.toString(), socket });
});
server.listen(PORT, IP, () => {
  console.log("opened server on", server.address());
});
