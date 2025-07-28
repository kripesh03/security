import { useRef, useState } from 'react'
import { ROLES } from '../../config/roles'
import { BsPlusLg } from 'react-icons/bs'
import { BiArrowBack } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Modal } from 'react-bootstrap'
import { usePathContext } from '../../context/path'
import { useUserContext } from '../../context/user'
import { useAuthContext } from '../../context/auth'
import { useSleepsContext } from '../../context/sleep'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
const moment = require('moment')

const Navbar = () => {
  const navigate = useNavigate()
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuthContext()
  const { setTitle } = usePathContext()
  const { targetUser } = useUserContext()
  const { dispatch } = useSleepsContext()
  const [error, setError] = useState(null)
  const [show, setShow] = useState(false)
  const sleepRef = useRef('')
  const wakeRef = useRef('')
  const now = moment(new Date()).format('YYYY-MM-DD HH:mm')

  const handleAdd = async () => {
    if (!auth) {
      setError('You must be logged in')
      return
    }
    
    try {
      const rughtToAdd = auth.roles.includes(ROLES.Admin) || auth.roles.includes(ROLES.Root)
      const sleep = {sleep: sleepRef.current.value, wake: wakeRef.current.value}

      if(targetUser?.userId && (auth.email !== targetUser?.userEmail) && (rughtToAdd)){
        sleep.id = targetUser.userId
      }

      const response = await axiosPrivate.post('/api/sleeps', sleep)
      setError(null)
      sleepRef.current.value = now
      wakeRef.current.value = now
      setShow(false)
      dispatch({type: 'CREATE_SLEEP', payload: response.data})
    } catch (error) {
      // console.log(error)
      setError(error.response?.data.error)
    }
  }

  const handleBack = () => {
    setTitle("Welcome")
    navigate("/")
  }

  return (
    <>
      <div className="d-flex justify-content-between">
        <button className="btn btn-outline-primary mb-2" onClick={handleBack}><BiArrowBack /></button>
        <button className="btn btn-outline-primary mb-2" onClick={() => setShow(!show)}><BsPlusLg /></button>
      </div>

      <Modal show={show} onHide={() => {setShow(!show);setError(null)}} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Sleep Hours</Modal.Title>
        </Modal.Header> 
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Sleep Time:</Form.Label>
            <Form.Control type="datetime-local" ref={sleepRef} defaultValue={now}/>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Wake Time:</Form.Label>
            <Form.Control type="datetime-local" ref={wakeRef} defaultValue={now}/>
          </Form.Group>
          {error && <div className="error">{error}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAdd}>Add Sleep</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Navbar