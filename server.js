const http = require("http");
const app = require("./app");
const databaseConnect = require("./connect.db");

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

async function startServer() {
  await databaseConnect();

  server.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
  });
}

startServer();
