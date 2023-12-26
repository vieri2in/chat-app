const net = require("node:net");
const { resolve } = require("node:path");
const readline = require("node:readline/promises");
const PORT = 3008;
const IP = "13.52.100.38";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};
const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};
let id;
const socket = net.createConnection({ host: IP, port: PORT }, async () => {
  console.log("Connected to the server.");
  const ask = async () => {
    const message = await rl.question("Enter a message > ");
    await moveCursor(0, -1);
    await clearLine(0);
    socket.write(`${id}-message-${message}`);
  };
  ask();
  socket.on("data", async (data) => {
    if (data.toString("utf-8").substring(0, 2) === "id") {
      id = data.toString("utf-8").substring(3);
      console.log();
      await moveCursor(0, -1);
      await clearLine(0);
      console.log(`Your id is ${id}\n`);
    } else {
      console.log();
      await moveCursor(0, -1);
      await clearLine(0);
      console.log(data.toString("utf-8"));
    }
    ask();
  });
});

socket.on("close", () => {
  console.log("Closed");
});
socket.on("end", () => {
  console.log("Ended");
});
