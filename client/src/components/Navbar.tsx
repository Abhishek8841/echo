import type { UserType } from '../types/auth.types'

const Navbar = ({ user }: { user: UserType | null }) => {
    console.log("navbar rendered")
    return (
        <div>
            {user ? user.email : ""}
        </div>
    )
}

export default Navbar