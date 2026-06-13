import { useNavigate } from 'react-router-dom'
import { logout } from '../services/api'
import type { UserType } from '../types/auth.types'

const Navbar = ({ user, setOpened, opened }: {
    user: UserType | null, setOpened: React.Dispatch<React.SetStateAction<UserType | null>>, opened: UserType | null
}) => {
    const navigate = useNavigate();
    console.log("navbar rendered")

    return (
        <div className="h-16 bg-slate-800 text-white flex items-center justify-between px-6 shadow-md">

            <div className="font-medium text-lg">
                {user ? user.email.split('@')[0] : ""}
            </div>

            <div className="flex gap-3 items-center">

                {opened ?
                    <button
                        className="bg-slate-600 hover:bg-slate-500 px-4 py-2 rounded-lg transition"
                        onClick={() => { setOpened(null) }}
                    >
                        CLOSE CHAT
                    </button>
                    :
                    <></>
                }

                <button
                    className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg transition"
                    onClick={() => { logout(), navigate("/signin") }}
                >
                    Logout
                </button>

            </div>

        </div>
    )
}

export default Navbar
