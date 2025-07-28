import { useLogout } from '../hooks/useLogout'
import { usePathContext } from '../context/path'
import { useAuthContext } from '../context/auth'
import { FaHome } from "react-icons/fa"
import { Link } from "react-router-dom"
import logo from "../assets/Frame.png"

const Navbars = () => {
  const { logout } = useLogout()
  const { auth } = useAuthContext()
  const { title, setTitle } = usePathContext()

  return (
    <nav className="bg-white shadow-sm py-3 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            onClick={() => setTitle("Welcome")}
            className="flex items-center gap-2 no-underline"
          >
            <img src={logo} alt="logo" className="h-6 w-6" />
            <span className="text-blue-600 font-bold text-lg no-underline">ManageWise</span>
          </Link>
        </div>

        {/* Right: Auth Buttons */}
        <div className="flex items-center gap-3">
          {auth ? (
            <button
              onClick={logout}
              className="border border-red-900 text-red-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 hover:text-white transition"
            >
              Log Out
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="no-underline bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="no-underline border border-blue-600 text-blue-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbars
