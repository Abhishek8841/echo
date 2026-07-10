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
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-5 shrink-0">

            <div className="flex items-center gap-3 min-w-0">
                {opened ? (
                    <div className="flex items-center gap-3 animate-fade-in">
                        <button
                            onClick={() => setOpened(null)}
                            className="text-gray-400 hover:text-amber-500 transition-colors duration-200 p-1 -ml-1"
                            aria-label="Close chat"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12.5 5L7.5 10L12.5 15" />
                            </svg>
                        </button>

                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-800 text-sm truncate">
                                    {openedName}
                                </span>
                                {isOnline ? (
                                    <span className="inline-flex items-center gap-1 text-xs text-emerald-500 font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                                        Online
                                    </span>
                                ) : (
                                    <span className="text-xs text-gray-400">Offline</span>
                                )}
                            </div>
                            {isTyping && (
                                <p className="text-xs text-amber-500 leading-tight font-medium">
                                    typing...
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white">S</span>
                        </div>
                        <span className="font-semibold text-gray-800 text-sm">
                            Sync
                        </span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-white">
                            {user ? user.email.charAt(0).toUpperCase() : ''}
                        </span>
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                        {user ? user.email.split('@')[0] : ''}
                    </span>
                </div>
                <button
                    className="text-xs font-medium text-gray-400 hover:text-rose-500 transition-colors duration-200 px-2 py-1"
                    onClick={() => { logout(); setUser(null); navigate("/signin") }}
                >
                    Log out
                </button>
            </div>

        </div>
    )
}

export default Navbar
