let socket: WebSocket | null = null;

export function connect() {
    if (!socket) socket = new WebSocket("ws://localhost:3000");
    return;
}

export function disconnect() {
    socket?.close();
    socket = null;
}

export function getSocket() {
    return socket;
}

export function sendMessage(to: string, content: string) {
    socket?.send(
        JSON.stringify(
            {
                type: "send_message",
                payload: {
                    to, content
                }
            }
        )
    );
}