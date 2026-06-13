export type MessagesType = {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    createdAt: Date;
}[]

export type recieveMessage = {
    type: "recieve_message",
    payload: {
        id: string;
        content: string;
        senderId: string;
        receiverId: string;
        createdAt: Date;
    }
}

export type statusIndicatorType = {
    type: "status_indicator",
    payload: {
        from: string,
        content: "ONLINE" | "OFFLINE",
    }
}

export type OnlineList = {
    type: "online_list",
    payload: string[],
}

export type serverMessageType =
    | recieveMessage
    | statusIndicatorType
    | OnlineList