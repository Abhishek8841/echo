import type { UserType } from '../types/auth.types'
import type { MessagesType } from '../types/message.types'

const MessageList = ({ messages, user, opened }: { messages: MessagesType, user: UserType | null, opened: UserType | null }) => {
    console.log("message list rendered")

    if (!user || !opened) return (<></>);

    return (
        <div className="flex flex-col gap-4 p-6 bg-slate-100 h-[calc(100vh-9rem)] overflow-y-auto">

            {messages.map((message) => {
                return (
                    <div
                        className={
                            message.senderId == user.id
                                ? "bg-amber-400 border border-amber-950 rounded-2xl p-4 max-w-[70%] self-end shadow"
                                : "bg-blue-500 text-white border border-blue-950 rounded-2xl p-4 max-w-[70%] self-start shadow"
                        }
                        key={message.id}
                    >
                        <div className="break-words">
                            {message.content}
                        </div>

                        <br />

                        <div className="text-sm opacity-80">
                            {message.createdAt.toLocaleString()}
                        </div>

                        <br />
                        {
                            message.receiverId == opened.id
                                ?
                                (message.readAt == null) ? "delivered" : "read"
                                :
                                <></>
                        }

                        <br />
                        <div className="text-sm font-medium">
                            {message.senderId == user.id
                                ? "sent by you"
                                : `sent by ${opened.email}`}
                        </div>

                    </div>
                )
            })}

        </div >
    )

}

export default MessageList
