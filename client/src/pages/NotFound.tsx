import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center animate-fade-in-up">

                <p className="text-3xl font-medium text-[#37352F] mb-1">404</p>
                <p className="text-[13px] text-[#9B9A97] mb-6">
                    This page doesn't exist
                </p>

                <div className="flex gap-2 justify-center">
                    <Link
                        to="/chat"
                        className="bg-[#37352F] hover:bg-[#2F2D28] text-white text-[12px] font-medium px-3.5 py-[6px] rounded transition-colors duration-100"
                    >
                        Go to Chat
                    </Link>
                    <Link
                        to="/signin"
                        className="bg-[#F4F3EF] hover:bg-[#EBEBEA] text-[#37352F] text-[12px] font-medium px-3.5 py-[6px] rounded transition-colors duration-100"
                    >
                        Sign In
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default NotFound
