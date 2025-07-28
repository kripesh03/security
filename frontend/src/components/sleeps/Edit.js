import { useRef, useState } from 'react'
import { ROLES } from '../../config/roles'
import { BsPencilSquare } from "react-icons/bs"
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import { useSleepsContext } from '../../context/sleep'
import { useAuthContext } from '../../context/auth'
import { useUserContext } from '../../context/user'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
const validator = require('validator')

const Edit = ({ sleep }) => {
  const axiosPrivate = useAxiosPrivate()
  const { targetUser } =  useUserContext()
  const { dispatch } =  useSleepsContext()
  const { auth } = useAuthContext()
  const [ error, setError ] = useState(null)
  const [ show, setShow ] = useState(false)
  const sleepRef = useRef('')
  const wakeRef = useRef('')
  
  const handleUpdate = async () => {
    const updateSleep = {sleep: sleepRef.current.value, wake: wakeRef.current.value}
    const prevSleep  = [sleepRef.current.defaultValue, wakeRef.current.defaultValue]
  
    Object.keys(updateSleep).forEach(key => {
      if (validator.isEmpty(updateSleep[key], { ignore_whitespace:true }) || prevSleep.includes(updateSleep[key])) {
        delete updateSleep[key]
      }
    })
    
    if (!auth) {
      setError('You must be logged in')
      return
    }

    const checkChange = Object.keys(updateSleep).length === 0

    if(!checkChange){
      try {
        if(targetUser?.userId && (auth.email !== targetUser?.userEmail) && (auth.roles.includes(ROLES.Admin))){
          updateSleep.id = targetUser.userId
        }
        const response = await axiosPrivate.patch(`/api/sleeps/${sleep._id}`, updateSleep)
        setError(null)
        setShow(false)
        dispatch({type: 'UPDATE_SLEEP', payload: response.data})
      } catch (error) {
        // console.log(error)
        setError(error.response?.data.error)
      }
    }else{
      setError("Nothing Changed")
    }
  }
    
  return (
    <>
      <button className="btn btn-sm btn-outline-primary rounded-circle mx-2 p-2" onClick={() => setShow(!show)}><BsPencilSquare className="fs-5"/></button>
      
      <Modal show={show} onHide={() => {setShow(!show);setError(null)}} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Sleep Record</Modal.Title>
        </Modal.Header> 
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Sleep Time:</Form.Label>
            <Form.Control type="datetime-local" defaultValue={sleep.sleep} ref={sleepRef}/>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Wake Time:</Form.Label>
            <Form.Control type="datetime-local" defaultValue={sleep.wake} ref={wakeRef}/>
          </Form.Group>
          {error && (<Alert variant={'danger'}>{error}</Alert>)}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleUpdate}>Save Changes </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Edit