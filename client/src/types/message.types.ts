export type MessagesType = {
    id: string,
    content: string,
    senderId: string,
    receiverId: string,
    createdAt: Date,
    readAt: Date | null
}[]

export type singleMessageType = {
    id: string,
    content: string,
    senderId: string,
    receiverId: string,
    createdAt: Date,
    readAt: Date | null
}

export type recieveMessage = {
    type: "recieve_message",
    payload: {
        id: string,
        content: string,
        senderId: string,
        receiverId: string,
        createdAt: Date,
        readAt: Date | null,
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

export type startTypingType = {
    type: "start_typing",
    payload: {
        from: string,
    }
}

export type stopTypingType = {
    type: "stop_typing",
    payload: {
        from: string,
    }
}

export type readReceiptType = {
    type: "recieve_read_receipt",
    payload: {
        from: string,
        readAt: Date,
    }
}


export type serverMessageType =
    | recieveMessage
    | statusIndicatorType
    | OnlineList
    | startTypingType
    | stopTypingType
    | readReceiptType