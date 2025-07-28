import { useEffect, useState } from 'react'
import { ROLES } from '../../config/roles'
import { Link, useNavigate, useParams } from "react-router-dom"
import { Badge, Button, Col, Row, Stack } from "react-bootstrap"
import { BiArrowBack } from 'react-icons/bi'
import { FaAddressCard } from 'react-icons/fa'
import { BsPencilSquare, BsFillTrashFill, BsFillPersonFill } from 'react-icons/bs'
import { usePathContext } from '../../context/path'
import { useUserContext } from '../../context/user'
import { useAuthContext } from '../../context/auth'
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import ReactMarkdown from "react-markdown"

const View = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { auth } = useAuthContext()
  const { setTitle } = usePathContext()
  const { targetUser } = useUserContext()
  const [ notes, setNotes ] = useState()
  const axiosPrivate = useAxiosPrivate()

  const statusBar = {
    Root: "bg-danger",
    Admin: "bg-warning",
    User: "bg-primary"
  }
  
  const color = statusBar[targetUser?.userRoles]

  useEffect(() => {
    let isMounted = true
    const abortController = new AbortController()
    setTitle("Note Management")
    if(!id) navigate('/not-found')

    const getNoteList = async () => {
      try {
        let response
        const admin = auth.roles.includes(ROLES.Admin) || auth.roles.includes(ROLES.Root)
        if(targetUser?.userId && (auth.email !== targetUser.userEmail) && admin){
          // Admin view
          response = await axiosPrivate.post('/api/notes/admin-byid', {
            id: id,
            signal: abortController.signal
          })
        }else{
          response = await axiosPrivate.get(`/api/notes/${id}`, {
            signal: abortController.signal
          })
        }
        isMounted && setNotes(response.data)
      } catch (err) {
        // console.log(err)
        if(err.response?.status === 404) {
          navigate('/note')
        }
      }
    }

    if(auth){
      getNoteList()
    }

    return () => {
      isMounted = false
      abortController.abort()
    }
  },[])

  const deleteNote = async () => {
    try {
      await axiosPrivate.delete(`/api/notes/${id}`)
      navigate('/note', {replace: true})
    } catch (error) {
      // console.log(error)
    }
  }

  const handleBack = () => {
    setTitle("Note Management")
    navigate("/note")
  }

  return (
  <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
    {/* User Info Bar */}
    {targetUser?.userName && notes && (
      <div className={`${color} text-white rounded-md px-4 py-2 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between`}>
        <div className="flex items-center gap-3">
          <FaAddressCard className="text-xl" />
          <span className="font-semibold">{targetUser.userName}</span>
        </div>
        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <BsFillPersonFill className="text-xl" />
          <span className="font-semibold">{targetUser.userRoles}</span>
        </div>
      </div>
    )}

    {notes && (
      <>
        {/* Title & Actions */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
          <div>
            <button
              className="inline-flex items-center px-3 py-2 border border-gray-400 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-100 transition"
              onClick={handleBack}
            >
              <BiArrowBack className="mr-1" />
              Back
            </button>

            <h2 className="text-2xl font-bold text-gray-800 m-2">{notes.title}</h2>
            {!notes?.length && (
              <div className="flex flex-wrap gap-2">
                {notes?.tag.map((tags, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                    {tags}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <Link to={`/note/edit/${id}`}>
              <button className="inline-flex items-center px-3 py-2 border border-blue-600 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-50 transition">
                <BsPencilSquare className="mr-1" />
                Edit
              </button>
            </Link>
            <button
              className="inline-flex items-center px-3 py-2 border border-red-600 text-red-600 text-sm font-medium rounded-md hover:bg-red-50 transition"
              onClick={deleteNote}
            >
              <BsFillTrashFill className="mr-1" />
              Delete
            </button>
            
          </div>
        </div>

        {/* Markdown Content */}
        <div className="prose max-w-full text-gray-800">
          <ReactMarkdown>{notes?.text}</ReactMarkdown>
        </div>
      </>
    )}
  </div>
)

}

export default View