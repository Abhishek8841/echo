import React from 'react'
import type { UserType } from '../types/auth.types'
import { sendReadMessage } from '../services/websocket'

const avatarColors = [
    'bg-amber-100 text-amber-600',
    'bg-rose-100 text-rose-600',
    'bg-sky-100 text-sky-600',
    'bg-lime-100 text-lime-600',
    'bg-emerald-100 text-emerald-600',
    'bg-pink-100 text-pink-600',
    'bg-teal-100 text-teal-600',
    'bg-orange-100 text-orange-600',
];

function getAvatarColor(id: string) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return avatarColors[Math.abs(hash) % avatarColors.length];
}

const Sidebar = ({ userList, setOpened, opened, onlineList, unreadCount, setUnreadCount }: {
    userList: UserType[],
    setOpened: React.Dispatch<React.SetStateAction<UserType | null>>,
    opened: UserType | null,
    onlineList: Set<string>,
    unreadCount: Record<string, number>,
    setUnreadCount: React.Dispatch<React.SetStateAction<Record<string, number>>>
}) => {

    return (
        <div className="w-72 bg-white border-r border-gray-100 h-screen flex flex-col shrink-0">

            <div className="px-4 pt-5 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">S</span>
                    </div>
                    <h2 className="text-sm font-semibold text-gray-800">Messages</h2>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-2">
                {userList.map((user, index) => {
                    const name = user.email.split('@')[0];
                    const initial = name.charAt(0).toUpperCase();
                    const isSelected = opened?.id === user.id;
                    const isOnline = onlineList.has(user.id);
                    const unread = unreadCount[user.id] || 0;
                    const colorClass = getAvatarColor(user.id);

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
                            style={{ animationDelay: `${index * 40}ms` }}
                            className={`animate-fade-in flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 mb-0.5 ${
                                isSelected
                                    ? 'bg-amber-50 border border-amber-100'
                                    : 'hover:bg-gray-50 border border-transparent'
                            }`}
                        >
                            <div className="relative shrink-0">
                                <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center`}>
                                    <span className="text-sm font-semibold">
                                        {initial}
                                    </span>
                                </div>
                                {isOnline && (
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-white" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <span className={`text-sm truncate block ${
                                    unread > 0 ? 'font-semibold text-gray-900' : 'font-medium text-gray-600'
                                }`}>
                                    {name}
                                </span>
                                {isOnline && (
                                    <span className="text-xs text-emerald-500">Online</span>
                                )}
                            </div>

                            {unread > 0 && (
                                <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-semibold min-w-[22px] h-[22px] flex items-center justify-center rounded-full px-1.5 shrink-0 shadow-sm shadow-amber-200">
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
