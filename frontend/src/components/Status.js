import { useAuthContext } from '../context/auth'
import { BsFillPersonFill } from "react-icons/bs"
import { FaAddressCard } from "react-icons/fa"

const Status = () => {
  const { auth } = useAuthContext()
  const display = auth?.name && auth?.roles

  // Define color classes per role
  const roleColors = {
    Root: "bg-red-600 text-white",
    Admin: "bg-yellow-400 text-black",
    User: "bg-blue-600 text-white"
  }

  const colorClass = roleColors[auth?.roles] || "bg-gray-500 text-white"

  return (
    <>
      {display && (
        <div className={`w-full py-2 px-4 flex items-center justify-center gap-6 ${colorClass}`}>
          <span
            className="flex items-center gap-2 text-sm font-medium"
            title="Name"
          >
            <FaAddressCard className="text-lg" />
            {auth.name}
          </span>

          <span
            className="flex items-center gap-2 text-sm font-medium"
            title="Roles"
          >
            <BsFillPersonFill className="text-lg" />
            {auth.roles}
          </span>
        </div>
      )}
    </>
  )
}

export default Status
