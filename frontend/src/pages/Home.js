import jwt_decode from "jwt-decode";
import { useEffect } from "react";
import { FaStickyNote, FaTasks, FaUserFriends } from "react-icons/fa";
import { GiNightSleep } from "react-icons/gi";
import { Link } from "react-router-dom";
import { ROLES } from "../config/roles";
import { useAuthContext } from "../context/auth";
import { usePathContext } from "../context/path";
import { useUserContext } from "../context/user";

const Home = () => {
  const { auth, dispatch } = useAuthContext();
  const { setLink } = usePathContext();
  const { setTargetUser } = useUserContext();
  const accessRight =
    auth?.roles.includes(ROLES.Admin) || auth?.roles.includes(ROLES.Root);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      const decoded = jwt_decode(token);
      dispatch({
        type: "LOGIN",
        payload: { ...decoded.userInfo, accessToken: token },
      });
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  const handleClick = (title) => {
    setLink(title);
    setTargetUser();
  };

  return (
    <div className="mt-12 px-4">
      <h1 className="text-2xl font-semibold text-center mb-8">
        Welcome to the Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {accessRight && (
          <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-xl transition">
            <div className="flex justify-center items-center text-blue-600 text-4xl mb-3">
              <FaUserFriends />
            </div>
            <h2 className="text-lg font-semibold mb-1">User Management</h2>
            <p className="text-sm text-gray-600 mb-3">
              Manage all platform users, roles, and access rights.
            </p>
            <Link to="/user" onClick={() => handleClick("/user")}>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Go to Users
              </button>
            </Link>
          </div>
        )}
        {auth?.roles.includes(ROLES.Root) && (
          <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-xl transition">
            <div className="flex justify-center items-center text-blue-600 text-4xl mb-3">
              📝
            </div>
            <h2 className="text-lg font-semibold mb-1">Audit Logs</h2>
            <p className="text-sm text-gray-600 mb-3">
              Review all system activity and API requests.
            </p>
            <Link to="/audit" onClick={() => handleClick("/audit")}>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                View Logs
              </button>
            </Link>
          </div>
        )}

        <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-xl transition">
          <div className="flex justify-center items-center text-blue-600 text-4xl mb-3">
            <FaTasks />
          </div>
          <h2 className="text-lg font-semibold mb-1">
            {accessRight ? "Task Management" : "Your Tasks"}
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            View, update and manage your tasks efficiently.
          </p>
          <Link to="/task" onClick={() => handleClick("/task")}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Go to Tasks
            </button>
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-xl transition">
          <div className="flex justify-center items-center text-blue-600 text-4xl mb-3">
            <FaStickyNote />
          </div>
          <h2 className="text-lg font-semibold mb-1">Notes</h2>
          <p className="text-sm text-gray-600 mb-3">
            Keep your important thoughts and memos organized.
          </p>
          <Link to="/note" onClick={() => handleClick("/note")}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Go to Notes
            </button>
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-xl transition">
          <div className="flex justify-center items-center text-blue-600 text-4xl mb-3">
            <GiNightSleep />
          </div>
          <h2 className="text-lg font-semibold mb-1">Record Sleep Hours</h2>
          <p className="text-sm text-gray-600 mb-3">
            Track your sleep schedule and improve your rest.
          </p>
          <Link to="/sleep" onClick={() => handleClick("/sleep")}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Go to Sleep Log
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
