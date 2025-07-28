import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './context/auth'
import { usePathContext } from './context/path'
import { ROLES } from './config/roles'
import PersistLogin from './components/PersistLogin'
import RequireAuth from './components/RequireAuth'
import RequireRoles from './components/RequireRoles'
import Recaptcha from './pages/Recaptcha'
import Signup from './pages/Signup'
import Activate from './pages/auth/Activate'
import VerifyEmail from './pages/auth/recover-password/VerifyEmail'
import Navbar from './components/Navbar'
import Status from './components/Status'
import Add from './components/notes/Add'
import Edit from './components/notes/Edit'
import View from './components/notes/View'
import Home from './pages/Home'
import Note from './pages/Note'
import Sleep from './pages/Sleep'
import Task from './pages/Task'
import User from './pages/User'
import Assign from './pages/Assign'
import Error from './pages/error/Error'
import NotFound from './pages/error/NotFound'
import io from 'socket.io-client'

function App() {
  const { auth } = useAuthContext()
  const { link } = usePathContext()
  
  useEffect(() => {
    if (auth?.accessToken) {
      const socket = io(process.env.REACT_APP_SOCKET_URL)
      socket.emit('online', auth._id)

      return () => {
        socket.disconnect()
      }
    }
  }, [auth])

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Status />
        
        <div className="container mt-3">
          <Routes>
            <Route path="/activate/:activation_token" element={<Activate />} />
            <Route path="/recover-password" element={<VerifyEmail />} />

            <Route element={<PersistLogin />}>
              <Route path="/" element={<Home />}/>
              <Route path="/login" element={!auth ? <Recaptcha /> : <Navigate to={link} />} />
              <Route path="/signup" element={!auth ? <Signup /> : <Navigate to="/" />} />

              <Route element={<RequireAuth />}>
                <Route element={<RequireRoles Roles={[...Object.values(ROLES)]} />}>
                  <Route path="/task" element={<Task />} />
                  <Route path="/note" element={<Note />} />
                  <Route path="/note/view/:id" element={<View />} />
                  <Route path="/note/add" element={<Add />} />
                  <Route path="/note/edit/:id" element={<Edit />} />
                  <Route path="/sleep" element={<Sleep />} />
                </Route>

                <Route element={<RequireRoles Roles={[ROLES.Root, ROLES.Admin]} />}>
                  <Route path="/user" element={<User />} />
                  <Route path="/assign" element={<Assign />} />
                </Route>
              </Route>
            </Route>
            
            <Route path="/error" element={<Error />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App