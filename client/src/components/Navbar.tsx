import { useNavigate } from 'react-router-dom'
import { logout } from '../services/api'
import type { UserType } from '../types/auth.types'
import { useAuth } from '../hooks/useAuth'

const Navbar = ({ setOpened, opened, onlineList, typingUsers }: {
    setOpened: React.Dispatch<React.SetStateAction<UserType | null>>,
    opened: UserType | null,
    onlineList: Set<string>,
    typingUsers: Set<string>,
}) => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const openedName = opened ? opened.email.split('@')[0] : null;
    const isOnline = opened ? onlineList.has(opened.id) : false;
    const isTyping = opened ? typingUsers.has(opened.id) : false;

    return (
        <div className="h-11 bg-white border-b border-[#F0F0EE] flex items-center justify-between px-5 shrink-0">

            <div className="flex items-center gap-2 min-w-0">
                {opened ? (
                    <div className="flex items-center gap-2 animate-fade-in">
                        <button
                            onClick={() => setOpened(null)}
                            className="text-[#B4B4B0] hover:text-[#37352F] transition-colors duration-100 p-0.5"
                            aria-label="Close chat"
                        >
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12.5 5L7.5 10L12.5 15" />
                            </svg>
                        </button>

                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <span className="font-medium text-[#37352F] text-[13px] truncate">
                                    {openedName}
                                </span>
                                {isOnline ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] text-[#4DAA57]">
                                        <span className="w-[5px] h-[5px] rounded-full bg-[#4DAA57] animate-pulse-dot" />
                                    </span>
                                ) : (
                                    <span className="text-[11px] text-[#B4B4B0]">offline</span>
                                )}
                            </div>
                            {isTyping && (
                                <p className="text-[11px] text-[#9B9A97] leading-none mt-px">
                                    typing...
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5">
                        <div className="w-[18px] h-[18px] rounded bg-[#37352F] flex items-center justify-center">
                            <span className="text-[8px] font-semibold text-white">S</span>
                        </div>
                        <span className="font-medium text-[#37352F] text-[13px]">
                            Sync
                        </span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-1.5">
                <div className="hidden sm:flex items-center gap-1.5 px-1.5 py-1">
                    <div className="w-[18px] h-[18px] rounded-full bg-[#EBEBEA] flex items-center justify-center">
                        <span className="text-[8px] font-medium text-[#37352F]/60">
                            {user ? user.email.charAt(0).toUpperCase() : ''}
                        </span>
                    </div>
                    <span className="text-[12px] text-[#9B9A97]">
                        {user ? user.email.split('@')[0] : ''}
                    </span>
                </div>
                <button
                    className="text-[11px] text-[#B4B4B0] hover:text-[#37352F] transition-colors duration-100 px-1.5 py-0.5"
                    onClick={() => { logout(); setUser(null); navigate("/signin") }}
                >
                    Log out
                </button>
            </div>

        </div>
    )
}

export default Navbar
