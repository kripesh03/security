import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ROLES } from '../config/roles'
import { usePathContext } from '../context/path'
import { useAuthContext } from '../context/auth'
import { useUserContext } from '../context/user'
import { FaUserFriends, FaTasks, FaStickyNote, FaUserCog } from 'react-icons/fa'
import { GiNightSleep } from 'react-icons/gi'
import jwt_decode from 'jwt-decode'

const Home = () => {
    const { auth, dispatch } = useAuthContext()
    const { setLink } = usePathContext()
    const { setTargetUser } = useUserContext()
    const accessRight = auth?.roles.includes(ROLES.Admin) || auth?.roles.includes(ROLES.Root)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token')
        if(token){
            const decoded = jwt_decode(token)
            dispatch({type: 'LOGIN', payload: {...decoded.userInfo, accessToken: token}})
            window.history.replaceState({}, document.title, "/")
        }
      }, [])

    const handleClick = (title) => {
        setLink(title)
        setTargetUser()
    }
    
    return (
        <>
            <div className="row">
                {/* <div className="col-lg-3">
                    <div className="card my-2">
                        <div className="card-body">
                            <h5 className="card-title">Account Management</h5>
                            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                            <Link to="/account" onClick={() => handleClick("/account")}><button className="btn btn-primary"><FaUserCog/></button></Link>
                        </div>
                    </div>
                </div> */}
                {accessRight && (<div className="col-lg-3">
                    <div className="card my-2">
                        <div className="card-body">
                            <Link to="/user" onClick={() => handleClick("/user")}><button className="btn btn-outline-primary"><FaUserFriends/>&ensp;User Management</button></Link>
                        </div>
                    </div>
                </div>)}
                <div className="col-lg-3">
                    <div className="card my-2">
                        <div className="card-body">
                            <Link to="/task" onClick={() => handleClick("/task")}><button className="btn btn-outline-primary"><FaTasks/>&ensp;{accessRight ? "Task Management" : "Tasks"}</button></Link>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3">
                    <div className="card my-2">
                        <div className="card-body">
                            <Link to="/note" onClick={() => handleClick("/note")}><button className="btn btn-outline-primary"><FaStickyNote/>&ensp;Note</button></Link>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3">
                    <div className="card my-2">
                        <div className="card-body">
                            <Link to="/sleep" onClick={() => handleClick("/sleep")}><button className="btn btn-outline-primary"><GiNightSleep/>&ensp;Record Sleep Hour</button></Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home