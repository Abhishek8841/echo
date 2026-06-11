import type { MessagesType } from '../types/message.types'

const MessageList = ({ messages }: { messages: MessagesType }) => {
    return (
        <div>
            {messages.map((message) => {
                return <div key={message.id}>
                    {message.senderId} :
                    <br />
                    {message.content}
                    <br />
                    {message.createdAt.toDateString()}
                </div>
            })}
        </div>
    )
}

export default MessageList