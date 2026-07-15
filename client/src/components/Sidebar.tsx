import React from 'react'
import type { UserType } from '../types/auth.types'
import { sendReadMessage } from '../services/websocket'

const avatarColors = [
    'bg-[#EBEBEA] text-[#787774]',
    'bg-[#E8E7E3] text-[#787774]',
    'bg-[#DFDEDB] text-[#787774]',
    'bg-[#EBEBEA] text-[#787774]',
    'bg-[#E8E7E3] text-[#787774]',
    'bg-[#DFDEDB] text-[#787774]',
    'bg-[#EBEBEA] text-[#787774]',
    'bg-[#E8E7E3] text-[#787774]',
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
        <div className="w-[260px] bg-[#F7F6F3] h-screen flex flex-col shrink-0">

            <div className="h-14 px-4 flex items-center shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-[22px] h-[22px] rounded bg-[#37352F] flex items-center justify-center">
                        <span className="text-[9px] font-semibold text-white">E</span>
                    </div>
                    <span className="text-[13px] font-medium text-[#37352F]">Messages</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-0.5">
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
                            style={{ animationDelay: `${index * 30}ms` }}
                            className={`animate-fade-in flex items-center gap-2.5 px-2 py-[7px] rounded-md cursor-pointer transition-colors duration-100 ${
                                isSelected
                                    ? 'bg-[#EBEBEA]'
                                    : 'hover:bg-[#EBEBEA]/50'
                            }`}
                        >
                            <div className="relative shrink-0">
                                <div className={`w-[30px] h-[30px] rounded-full ${colorClass} flex items-center justify-center`}>
                                    <span className="text-[11px] font-medium">
                                        {initial}
                                    </span>
                                </div>
                                {isOnline && (
                                    <span className="absolute -bottom-px -right-px w-2 h-2 bg-[#4DAA57] rounded-full ring-[1.5px] ring-[#F7F6F3]" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <span className={`text-[13px] truncate block leading-tight ${
                                    unread > 0 ? 'font-medium text-[#37352F]' : 'text-[#37352F]/70'
                                }`}>
                                    {name}
                                </span>
                                {isOnline && (
                                    <span className="text-[11px] text-[#9B9A97] leading-tight">Online</span>
                                )}
                            </div>

                            {unread > 0 && (
                                <span className="bg-[#EB5757] text-white text-[10px] font-medium min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 shrink-0">
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
