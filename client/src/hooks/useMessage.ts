import { useRef, useState } from "react";
import type { MessagesType, readReceiptType, singleMessageType } from "../types/message.types";
import { getMessages } from "../services/api";
import { sendReadMessage } from "../services/websocket";

const useMessage = () => {

    const [messages, setMessages] = useState<MessagesType>([]);
    const controllerRef = useRef<AbortController | null>(null);

    async function fetchMessages(userId: string) {
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;
        try {
            const data = await getMessages(userId, controller.signal)
            setMessages(data);
        }
        catch (error: any) {
            if (error.name === "AbortError") return;
            // alert("Unable to load the conversation");
            console.log("Unable to load the conversation");
            console.error(error);
        }
    }
    function abortMessages() {
        // had to make it a ref since we wanted to abort the request from somewhere else
        controllerRef.current?.abort();
    }

    function appendMessage(m: singleMessageType) {
        setMessages(prev => [...prev, m])
    }
    function appendAndMarkMessageAsRead(m: singleMessageType, openedId: string) {
        setMessages(prev => [...prev, m]);
        sendReadMessage(openedId);
    }

    function receieveRead(msg: readReceiptType) {
        setMessages(prev =>
            prev.map(message => {

                if (
                    message.receiverId === msg.payload.from &&
                    message.readAt === null
                ) {
                    return {
                        ...message,
                        readAt: msg.payload.readAt
                    };
                }

                return message;
            })
        );

    }

    return (
        {
            messages, fetchMessages, abortMessages, appendAndMarkMessageAsRead, receieveRead, appendMessage
        }
    );

}

export default useMessage