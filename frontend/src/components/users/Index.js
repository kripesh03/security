import Delete from './Delete'
import View from './View'
import Edit from './Edit'
import { ROLES } from '../../config/roles'
import { MdOutlineWifi, MdOutlineWifiOff } from 'react-icons/md'
import { FaUserCheck, FaUserTimes } from 'react-icons/fa'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useAuthContext } from '../../context/auth'

const Index = ({ filteredNames }) => {
  const { auth } = useAuthContext()

  const permitDeleteUser = (auth, user) => {
    return (!auth.roles.includes(ROLES.Admin) && !user.roles.includes(ROLES.Root)) || user.roles.includes(ROLES.User)
  }

  return (
    <>
      {filteredNames.map((user, index) => (
        <tr key={index} className="hover:bg-gray-50 transition">
          <td className="px-6 py-3 font-medium">{index + 1}.</td>
          <td className="px-6 py-3 font-bold">{user.name}</td>
          <td className="px-6 py-3">{user.email}</td>
          <td className="px-6 py-3 text-sm text-gray-700">{user.roles.join(', ')}</td>
          <td className="px-6 py-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {user.active ? <FaUserCheck className="mr-1" /> : <FaUserTimes className="mr-1" />}
              {user.active ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td className="px-6 py-3">
            {user.isOnline ? (
              <span className="inline-flex items-center text-green-600">
                <MdOutlineWifi size={22} className="mr-1" /> Online
              </span>
            ) : (
              <span className="inline-flex items-center text-gray-400">
                <MdOutlineWifiOff size={22} className="mr-1" /> Offline
              </span>
            )}
          </td>
          <td className="px-6 py-3 text-sm text-gray-500">
            {formatDistanceToNow(new Date(user.lastActive), { addSuffix: true })}
          </td>
          <td className="px-6 py-3 flex space-x-2">
            <View user={user} />
            <Edit user={user} />
            {permitDeleteUser(auth, user) && <Delete user={user} />}
          </td>
        </tr>
      ))}
    </>
  )
}

export default Index
