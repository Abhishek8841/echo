import type { MessagesType } from '../types/message.types'

const MessageList = ({ messages }: { messages: MessagesType }) => {
    console.log("message list rendered")
    return (
        <div className='bg-amber-500'>
            {messages.map((message) => {
                return <div key={message.id}>
                    {message.content}
                </div>
            })}
        </div>
    )
}

export default MessageList