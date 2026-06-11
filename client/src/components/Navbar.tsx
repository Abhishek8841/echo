import { useNavigate } from 'react-router-dom'
import { logout } from '../services/api'
import type { UserType } from '../types/auth.types'

const Navbar = ({ user }: { user: UserType | null }) => {

const navigate = useNavigate();
console.log("navbar rendered")
return (
    <div>
        {user ? user.email : ""}
        <div><button onClick={() => { logout(), navigate("/signin") }}>logout</button></div>
    </div>
)
}

export default Navbar