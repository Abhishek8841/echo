import { useEffect, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import type { UserType } from '../types/auth.types'
import type { MessagesType } from '../types/message.types'

const MessageList = ({ messages, opened }: { messages: MessagesType, opened: UserType | null }) => {
    const { user } = useAuth();
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!user || !opened) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <p className="text-sm text-gray-400">
                    Select a conversation to start messaging
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50 px-5 py-4">

            <div className="flex flex-col gap-1">
                {messages.map((message) => {
                    const isSent = message.senderId === user.id;

                    return (
                        <div
                            key={message.id}
                            className={`flex flex-col mb-2 ${isSent ? 'items-end' : 'items-start'}`}
                        >
                            <div
                                className={`max-w-[65%] px-4 py-2.5 rounded-lg ${
                                    isSent
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-white border border-gray-200 text-gray-900'
                                }`}
                            >
                                <p className="text-sm break-words leading-relaxed">
                                    {message.content}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 mt-1 px-1">
                                <span className="text-xs text-gray-400">
                                    {new Date(message.createdAt).toLocaleString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        hour: "numeric",
                                        minute: "2-digit",
                                    })}
                                </span>

                                {isSent && (
                                    <span className="text-xs text-gray-400">
                                        {message.readAt === null
                                            ? 'Delivered'
                                            : 'Read'
                                        }
                                    </span>
                                )}
                            </div>
                        </div>
                    )
                })}
                <div ref={bottomRef} />
            </div>

        </div>
    )
}

export default MessageList
