import { useEffect, useState } from "react";
import { connect, disconnect, getSocket } from "../services/websocket";
import type { OnlineList, readReceiptType, recieveMessage, serverMessageType, startTypingType, statusIndicatorType, stopTypingType } from "../types/message.types";

const useSocket = ({ recieve_message,
    status_indicator,
    online_list,
    start_typing,
    stop_typing,
    recieve_read_receipt }: {
        recieve_message: (msg: recieveMessage) => void,
        status_indicator: (msg: statusIndicatorType) => void,
        online_list: (msg: OnlineList) => void,
        start_typing: (msg: startTypingType) => void,
        stop_typing: (msg: stopTypingType) => void,
        recieve_read_receipt: (msg: readReceiptType) => void
    }) => {
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        connect();
        const socket = getSocket();
        if (!socket) return;
        socket.onopen = () => {
            setConnected(true);
        }
        socket.onclose = () => {
            setConnected(false);
        }

        socket.onmessage = (event) => {

            try {
                const msg: serverMessageType = JSON.parse(event.data);
                switch (msg.type) {
                    case "recieve_message":
                        recieve_message(msg);
                        break;

                    case "status_indicator":
                        status_indicator(msg);
                        break;

                    case "online_list":
                        online_list(msg);
                        break;

                    case "start_typing":
                        start_typing(msg);
                        break;

                    case "stop_typing":
                        stop_typing(msg)
                        break;

                    case "recieve_read_receipt":
                        recieve_read_receipt(msg)
                        break;
                }
            }
            catch (e) {
                console.error(e);
            }

        };

        return () => { disconnect() }
    }, [])

    return { connected };
}

export default useSocket