import { Server, Socket } from "socket.io";
import http from "http";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { GIGFLOW_TOKEN } from "../constants/index.js";

export const ConnectedUsers = new Map<string, Socket>();

let io: Server;

const socketServer = (httpServer: http.Server) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_BASE_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      preflightContinue: false,
      allowedHeaders: ["Authorization", "Content-Type", "Set-Cookie"],
    },
    transports: ["websocket"],
    allowEIO3: true,
    allowUpgrades: true,
    pingTimeout: 1000,
  });

  io.use((socket: Socket, next) => {
    const req = socket.request as any;
    const res = {} as any;

    cookieParser()(req, res, (err) => {
      if (err) return next(new Error("Cookie parsing failed"));

      const token = req.cookies?.[GIGFLOW_TOKEN];
      if (!token) return next(new Error("Unauthenticated"));

      try {
        const payload = jwt.verify(
          token,
          process.env.JWT_SECRET!
        ) as JwtPayload;

        if (!payload?.id) {
          return next(new Error("Invalid token"));
        }

        socket.user = {
          id: payload.id.toString(),
          email: payload.email,
        };

        next();
      } catch {
        next(new Error("Token verification failed"));
      }
    });
  });

  io.on("connection", (socket: Socket) => {
    ConnectedUsers.set(socket.user.id, socket);

    socket.join(socket.user!.id);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.user?.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

export default socketServer;
