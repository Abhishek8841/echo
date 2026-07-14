let socket: WebSocket | null = null;

export function connect() {
    if (!socket) socket = new WebSocket(import.meta.env.VITE_WS_URL);
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

export function sendStartTyping(to: string) {
    socket?.send(
        JSON.stringify(
            {
                type: "start_typing",
                payload: {
                    to
                }
            }
        )
    )
}

export function sendStopTyping(to: string) {
    socket?.send(
        JSON.stringify(
            {
                type: "stop_typing",
                payload: {
                    to
                }
            }
        )
    )
}

export function sendReadMessage(to: string) {
    socket?.send(
        JSON.stringify(
            {
                type: "send_read_receipt",
                payload: {
                    to
                }
            }
        )
    )
}