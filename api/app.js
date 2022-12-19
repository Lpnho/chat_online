import http from "http";
import { Server } from "socket.io";
import { app } from "./routes.js";
const httpServer = http.createServer(app);
const io = new Server(httpServer);
export { httpServer, io };
