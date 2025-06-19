
import http from "http";
import mongoose from "mongoose";
import config from "./config";

import app from "./app";
import { initSocket } from "./app/modules/Chat/chat.socket";
// import { UserRoutes } from "./app/modules/User/user.route";
// import { ProjectRoutes } from "./app/modules/project/project.route";
// import { ChatRoutes } from "./app/modules/Chat/chat.route";

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log("Database connected successfully");

    const server = http.createServer(app);
    initSocket(server);

    server.listen(config.port, () => {
      console.log(`Task Flow app listening on port ${config.port}`);
    });
  } catch (err) {
    console.log("Failed to connect to database or start server:", err);
  }
}

main();