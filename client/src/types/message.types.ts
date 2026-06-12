export type MessagesType = {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    createdAt: Date;
}[]

export type conversation = {
    email: string,
    id: string,
}