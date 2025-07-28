import { AiOutlineSetting, AiOutlineUsergroupAdd } from "react-icons/ai"
import { BsCalendarWeek } from 'react-icons/bs'
import { BiTimer } from 'react-icons/bi'
import { FiMoreHorizontal } from "react-icons/fi"
import { HiLink, HiOutlineStar } from "react-icons/hi"
import { MdAdminPanelSettings } from "react-icons/md"
import { SiStatuspal } from "react-icons/si"
import { Link } from 'react-router-dom'
import { ROLES } from '../../config/roles'
import { useAuthContext } from '../../context/auth'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import Delete from './Delete'
import Edit from './Edit'

const Index = ({ tasks }) => {
  const { auth } = useAuthContext()
  const admin = auth.roles.includes(ROLES.Admin) || auth.roles.includes(ROLES.Root)

  return (
    <>
      {tasks.map(task => (<div className="card mt-2 mb-3 border-5 pt-2 pb-0 px-3" key={task._id}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3">
          <div className="mt-6 ml-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">{task.title}</h2>
            <p className="text-gray-500 text-sm">{task.description}</p>
          </div>
          <div className="flex gap-4 text-sm text-gray-600 mt-3 md:mt-0">
            <div className="flex items-center gap-1"><MdAdminPanelSettings className="text-lg" />{task.createdBy.name}</div>
            <div className="flex items-center gap-1"><SiStatuspal className="text-base" />{task.status}</div>
            <div className="flex items-center gap-1"><BsCalendarWeek className="text-base" />{new Date(task.createdAt).toLocaleDateString('en-GB')}</div>
            <div className="flex items-center gap-1"><BiTimer className="text-base" />Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</div>
            <div className="flex items-center gap-1"><BiTimer className="text-base" />Updated {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}</div>
          </div>
        </div>
        {admin && (
          <div className="card-footer bg-white px-0">
            <div className="row">
              <div className="col-md-auto">
                <Link className="btn btn-outlined text-muted taskbtn" to="/assign" state={{id: task._id, title: task.title, createdBy: task.createdBy}}>
                  <AiOutlineUsergroupAdd className="fs-4"/>
                  <small>&ensp;ASSIGN</small>
                </Link>
                <Edit task={task}/>
                <Delete task={task}/>
                {/* <button className="btn btn-outlined text-muted taskbtn">
                  <AiOutlineSetting className="fs-5"/>
                  <small>&ensp;SETTINGS</small>
                </button>
                <button className="btn btn-outlined text-muted taskbtn">
                  <HiLink className="plus fs-5"/>
                  <small>&ensp;PROGRAM LINK</small>
                </button>
                <button className="btn btn-outlined text-muted taskbtn">
                  <FiMoreHorizontal className="more mr-2 fs-5"/>
                  <small>&ensp;MORE</small>
                </button>
                <span className="vl"></span> */}
              </div>
            </div>
          </div>
        )}
      </div>))}
    </>
  )
}

export default Index