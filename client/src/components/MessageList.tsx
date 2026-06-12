import type { UserType } from '../types/auth.types'
import type { MessagesType } from '../types/message.types'

const MessageList = ({ messages, user, opened }: { messages: MessagesType, user: UserType | null, opened: UserType | null }) => {
    console.log("message list rendered")
    if (!user || !opened) return (<></>);
    return (
        <div>
            {messages.map((message) => {
                return <div className={message.senderId == user.id ? "bg-amber-400 border border-amber-950" : "bg-blue-500 border-amber-950"}  key={message.id}>
                    {message.content}
                    <br />
                    {message.createdAt.toLocaleString()}
                    <br />
                    {message.senderId == user.id ? "sent by you" : `sent by ${opened.email}`}
                </div>
            })}
        </div>
    )
}

export default MessageList