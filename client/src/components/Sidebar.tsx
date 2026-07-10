import React from 'react'
import type { UserType } from '../types/auth.types'
import { sendReadMessage } from '../services/websocket'

const Sidebar = ({ userList, setOpened, opened, onlineList, unreadCount, setUnreadCount }: {
    userList: UserType[],
    setOpened: React.Dispatch<React.SetStateAction<UserType | null>>,
    opened: UserType | null,
    onlineList: Set<string>,
    unreadCount: Record<string, number>,
    setUnreadCount: React.Dispatch<React.SetStateAction<Record<string, number>>>
}) => {

    return (
        <div className="w-72 bg-white border-r border-gray-200 h-screen flex flex-col shrink-0">

            <div className="px-4 pt-4 pb-3 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Messages</h2>
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-gray-100 text-sm rounded-md px-3 py-2 border-0 outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-blue-600 focus:bg-white transition-colors duration-150"
                />
            </div>

            <div className="flex-1 overflow-y-auto">
                {userList.map((user) => {
                    const name = user.email.split('@')[0];
                    const initial = name.charAt(0).toUpperCase();
                    const isSelected = opened?.id === user.id;
                    const isOnline = onlineList.has(user.id);
                    const unread = unreadCount[user.id] || 0;

                    return (
                        <div
                            key={user.id}
                            onClick={() => {
                                setOpened(user);
                                sendReadMessage(user.id);
                                setUnreadCount(prev => ({
                                    ...prev,
                                    [user.id]: 0
                                }));
                            }}
                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-150 ${
                                isSelected
                                    ? 'bg-gray-100'
                                    : 'hover:bg-gray-50'
                            }`}
                        >
                            <div className="relative shrink-0">
                                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-600">
                                        {initial}
                                    </span>
                                </div>
                                {isOnline && (
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <span className={`text-sm truncate block ${
                                    unread > 0 ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                                }`}>
                                    {name}
                                </span>
                            </div>

                            {unread > 0 && (
                                <span className="bg-blue-600 text-white text-xs font-medium min-w-[20px] h-5 flex items-center justify-center rounded-full px-1.5 shrink-0">
                                    {unread}
                                </span>
                            )}
                        </div>
                    )
                })}
            </div>

        </div>
    )
}

export default Sidebar
