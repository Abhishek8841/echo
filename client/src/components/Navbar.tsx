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
    const { user } = useAuth();
    const navigate = useNavigate();

    const openedName = opened ? opened.email.split('@')[0] : null;
    const isOnline = opened ? onlineList.has(opened.id) : false;
    const isTyping = opened ? typingUsers.has(opened.id) : false;

    return (
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-5 shrink-0">

            <div className="flex items-center gap-3 min-w-0">
                {opened ? (
                    <>
                        <button
                            onClick={() => setOpened(null)}
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-150 p-1 -ml-1"
                            aria-label="Close chat"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12.5 5L7.5 10L12.5 15" />
                            </svg>
                        </button>

                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900 text-sm truncate">
                                    {openedName}
                                </span>
                                <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
                            </div>
                            {isTyping && (
                                <p className="text-xs text-gray-400 leading-tight">
                                    typing...
                                </p>
                            )}
                        </div>
                    </>
                ) : (
                    <span className="font-semibold text-gray-900 text-sm">
                        Sync
                    </span>
                )}
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 hidden sm:block">
                    {user ? user.email.split('@')[0] : ''}
                </span>
                <button
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150"
                    onClick={() => { logout(), navigate("/signin") }}
                >
                    Log out
                </button>
            </div>

        </div>
    )
}

export default Navbar
