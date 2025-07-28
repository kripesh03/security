import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import PersistLoginAlert from "./PersistLoginAlert";
import PersistLoginCheckbox from "./PersistLoginCheckbox";

const SignInWithGoogleButton = ({ persist, setPersist }) => {
  const [show, setShow] = useState(false);

  const handleLogin = () =>
    (window.location.href = `${process.env.REACT_APP_SERVER_URL}/api/auth/google?persist=${persist}`);

  return (
    <>
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:bg-gray-100 transition"
        onClick={() => setShow(true)}
      >
        <FcGoogle size={20} />
        Sign in with Google
      </button>

      {show && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-gray-100 bg-opacity-70 z-40"
            onClick={() => setShow(false)}
          ></div>

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Google Sign In
              </h3>

              <PersistLoginCheckbox
                persist={persist}
                setPersist={setPersist}
                className="mb-3"
                bold
              />

              <PersistLoginAlert maxWidth="100%" marginAuto={false} />

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleLogin}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  CONTINUE
                </button>
              </div>

              <button
                onClick={() => setShow(false)}
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SignInWithGoogleButton;
