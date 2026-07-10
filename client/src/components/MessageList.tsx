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
            <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-white to-amber-50/30 gap-3">
                <div className="animate-fade-in-up">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-600 text-center">
                        Select a conversation
                    </p>
                    <p className="text-xs text-gray-400 text-center mt-1">
                        Pick someone from the sidebar to start chatting
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-gray-50/50 px-5 py-4">

            <div className="flex flex-col gap-1">
                {messages.map((message) => {
                    const isSent = message.senderId === user.id;

                    return (
                        <div
                            key={message.id}
                            className={`flex flex-col mb-3 ${isSent ? 'items-end animate-slide-right' : 'items-start animate-slide-left'}`}
                        >
                            <div
                                className={`max-w-[65%] px-4 py-2.5 shadow-sm ${
                                    isSent
                                        ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-2xl rounded-br-md'
                                        : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-bl-md'
                                }`}
                            >
                                <p className="text-sm break-words leading-relaxed">
                                    {message.content}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 mt-1 px-1">
                                <span className="text-[11px] text-gray-400">
                                    {new Date(message.createdAt).toLocaleString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        hour: "numeric",
                                        minute: "2-digit",
                                    })}
                                </span>

                                {isSent && (
                                    <span className={`text-[11px] font-medium ${message.readAt === null ? 'text-gray-400' : 'text-amber-500'}`}>
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
