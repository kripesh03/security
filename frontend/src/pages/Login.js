import { useRef, useState } from 'react'
import { useLogin } from '../hooks/useLogin'
import { Link } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import usePersist from '../hooks/usePersist'
import PersistLoginAlert from '../components/auth/PersistLoginAlert'
import PersistLoginCheckbox from '../components/auth/PersistLoginCheckbox'
import SignInWithGoogleButton from '../components/auth/SignInWithGoogleButton'

const Login = () => {
  const { login, error, isLoading } = useLogin()
  const { persist, setPersist } = usePersist()
  const [changeIcon, setChangeIcon] = useState(false)
  const emailRef = useRef('')
  const passwordRef = useRef('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(emailRef.current.value.trim(), passwordRef.current.value.trim(), persist)
  }

  const handleShowPassword = (e) => {
    e.preventDefault()
    const isPassword = passwordRef.current.type === "password"
    passwordRef.current.type = isPassword ? "text" : "password"
    setChangeIcon(isPassword)
  }

  return (
    <>
      <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-center mb-1">Log In</h3>
        <p className="text-sm text-gray-500 text-center mb-6">Welcome back! Please log in to continue.</p>

        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700 text-sm font-medium mb-1">Email Address</label>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            type="email"
            ref={emailRef}
          />

          <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
          <div className="relative mb-4">
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              ref={passwordRef}
              autoComplete="on"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-600"
              onClick={handleShowPassword}
            >
              {changeIcon ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
            <PersistLoginCheckbox persist={persist} setPersist={setPersist} />
            <Link to="/recover-password" className="hover:underline">Forgot Password?</Link>
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition duration-200"
            disabled={isLoading}
          >
            Log In
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mt-4 text-sm">
              {error}
            </div>
          )}
        </form>

        <div className="my-4 border-t relative">
          <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-2 text-sm text-gray-400">or</span>
        </div>

        <SignInWithGoogleButton persist={persist} setPersist={setPersist} />

        {persist && <PersistLoginAlert maxWidth="400px" marginAuto={true} />}
      </div>
    </>
  )
}

export default Login
