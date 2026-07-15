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
            <div className="flex-1 flex items-center justify-center">
                <p className="text-[13px] text-[#B4B4B0] animate-fade-in-up">
                    Select a conversation
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto px-5 py-4">

            <div className="flex flex-col gap-px">
                {messages.map((message) => {
                    const isSent = message.senderId === user.id;

                    return (
                        <div
                            key={message.id}
                            className={`flex flex-col mb-2 ${isSent ? 'items-end animate-slide-right' : 'items-start animate-slide-left'}`}
                        >
                            <div
                                className={`max-w-[60%] px-3 py-[7px] ${
                                    isSent
                                        ? 'bg-[#F4F3EF] text-[#37352F] rounded-[14px] rounded-br-sm'
                                        : 'bg-white ring-1 ring-[#EBEBEA] text-[#37352F] rounded-[14px] rounded-bl-sm'
                                }`}
                            >
                                <p className="text-[13.5px] break-words leading-[1.5]">
                                    {message.content}
                                </p>
                            </div>

                            <div className="flex items-center gap-1.5 mt-px px-0.5">
                                <span className="text-[10px] text-[#B4B4B0]">
                                    {new Date(message.createdAt).toLocaleString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        hour: "numeric",
                                        minute: "2-digit",
                                    })}
                                </span>

                                {isSent && (
                                    <span className={`text-[10px] ${message.readAt === null ? 'text-[#B4B4B0]' : 'text-[#9B9A97]'}`}>
                                        {message.readAt === null
                                            ? 'Sent'
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
