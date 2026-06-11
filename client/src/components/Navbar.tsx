import type { UserType } from '../types/auth.types'

const Navbar = ({ user }: { user: UserType | null }) => {
    return (
        <div>
            {user ? user.email : ""}
        </div>
    )
}

export default Navbar