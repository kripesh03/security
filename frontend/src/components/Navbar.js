import { useLogout } from '../hooks/useLogout'
import { usePathContext } from '../context/path'
import { useAuthContext } from '../context/auth'
import { Nav, Navbar, Button } from "react-bootstrap"
import { FaHome } from "react-icons/fa"
import { Link } from "react-router-dom"

const Navbars = () => {
  const { logout } = useLogout()
  const { auth } = useAuthContext()
  const { title, setTitle } = usePathContext()

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <div className="container-fluid">
        <Navbar.Brand><h3><Link to="/" className="text-white" onClick={() => setTitle("Welcome")}><FaHome/></Link>&ensp;{title}</h3></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              {auth && (<Button variant="outline-warning" className="mx-3" onClick={() => logout()}>Log Out</Button>)}
              {!auth && (
                <>
                  <Nav.Link href="/login">Login</Nav.Link>
                  <Nav.Link href="/signup">Signup</Nav.Link>
                </>
              )}
              
            </Nav>
          </Navbar.Collapse>
        </Navbar.Collapse>
      </div>
    </Navbar>
  )
}

export default Navbars