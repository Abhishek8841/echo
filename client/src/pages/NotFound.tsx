import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50">
            <div className="text-center animate-fade-in-up">

                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-200/50">
                    <span className="text-3xl font-bold text-white">?</span>
                </div>

                <h1 className="text-6xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-3">
                    404
                </h1>
                <p className="text-lg font-medium text-gray-700 mb-2">
                    Page not found
                </p>
                <p className="text-sm text-gray-400 mb-8 max-w-xs mx-auto">
                    The page you are looking for does not exist or has been moved.
                </p>

                <div className="flex gap-3 justify-center">
                    <Link
                        to="/chat"
                        className="bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-200 shadow-md shadow-amber-200/50 hover:shadow-lg hover:shadow-amber-300/50"
                    >
                        Go to Chat
                    </Link>
                    <Link
                        to="/signin"
                        className="bg-white border border-gray-200 hover:border-amber-300 text-gray-700 hover:text-amber-600 text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-200"
                    >
                        Sign In
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default NotFound
