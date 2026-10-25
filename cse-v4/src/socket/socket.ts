import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export const socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ["websocket"],
    // Same JWT used for REST (`cse_token`). Sent via handshake auth so the
    // server can verify identity before allowing room joins. Refreshed on
    // every (re)connect; socket.io calls this function before each attempt.
    auth: (cb) => {
        cb({ token: localStorage.getItem("cse_token") ?? undefined });
    },
});