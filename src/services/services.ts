// src/services/socketService.ts
import { connected } from "process";
import { io, Socket } from "socket.io-client";
import config from "../config";

// Replace with your FastAPI server's URL
const SOCKET_URL = config.socketurl;//"http://localhost:8000";

class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(SOCKET_URL, {
      transports: ["websocket"],
      path: "/sockets", // Use websocket transport explicitly
    });
    // Handle socket connection errors
    this.socket.on("connect_error", (error: Error) => {
      console.error("Socket connection error:", error);
    });

    // Handle socket disconnects
    this.socket.on("disconnect", (reason: string) => {
      console.log("Socket disconnected:", reason);
    });
  }

  public connect() {
    this.socket.connect();
    console.log("Socket connection established", this.socket.connect());
  }

  public disconnect() {
    this.socket.disconnect();
    console.log("Socket connection closed", this.socket.disconnect());
  }

  public onNewEmail(callback: (data: any) => void) {
    console.log(
      "we are getting new emails events",
      this.socket.on("new_email", callback)
    );
    this.socket.on("new_email", callback);
  }
}

export default new SocketService();
