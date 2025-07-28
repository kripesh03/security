import { useState } from 'react'
import { BsFillTrashFill } from 'react-icons/bs'
import { Modal } from 'react-bootstrap'
import { useSleepsContext } from '../../context/sleep'
import { useAuthContext } from '../../context/auth'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const Delete = ({sleep}) => {
  const axiosPrivate = useAxiosPrivate()
  const { dispatch } =  useSleepsContext()
  const { auth } = useAuthContext()
  const [error, setError] = useState(null)
  const [show, setShow] = useState(false)

  const handleDelete = async () => {
    if(!auth) {
      setError('You must be logged in') 
      setShow(!show)
      return
    }

    try {
      const response = await axiosPrivate.delete(`/api/sleeps/${sleep._id}`)
      setError(null)
      dispatch({type: 'DELETE_SLEEP', payload: response.data})
    } catch (error) {
      // console.log(error)
      setError(error.response?.data.error)
    }
  }

  return (
    <>
      <button className="btn btn-outline-danger rounded-circle p-2" onClick={handleDelete}><BsFillTrashFill className="fs-5"/></button>
      
      <Modal show={show} onHide={() => {setShow(!show);setError(null)}} centered>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header> 
        <Modal.Body closeButton>
          <div className="alert alert-danger" role="alert">{error}</div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Delete