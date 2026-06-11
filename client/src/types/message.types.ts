export type MessagesType = {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    createdAt: Date;
    sender: {
        id: string;
        email: string;
    };
    receiver: {
        id: string;
        email: string;
    };
}[]

export type conversation = {
    email: string,
    id: string,
}