import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { MdOutlineMailLock } from 'react-icons/md'
import axiosPublic from '../../../api/axios'
const validator = require('validator')

const RestPassword = ({ email }) => {
  const navigate = useNavigate()
  const passwordRef = useRef('')
  const confirmPasswordRef = useRef('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [changeIcon, setChangeIcon] = useState(false)

  const handleShowPassword = (e, ref) => {
    e.preventDefault()
    const isPassword = ref.current.type === 'password'
    ref.current.type = isPassword ? 'text' : 'password'
    setChangeIcon(isPassword)
  }

  const validatePasswordField = (ref, fieldName) => {
    if (validator.isEmpty(ref.current?.value ?? '', { ignore_whitespace: true })) {
      throw new Error(`${fieldName} is required`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      validatePasswordField(passwordRef, 'Password')
      validatePasswordField(confirmPasswordRef, 'Confirm Password')

      if (passwordRef.current.value !== confirmPasswordRef.current.value) {
        throw Error("Passwords don't match")
      }

      await axiosPublic.post('/api/auth/rest-password', {
        email,
        password: passwordRef.current.value
      })

      setIsLoading(false)
      setError(null)
      navigate('/login')
    } catch (error) {
      setError(error.response?.data.error || error.message)
      setIsLoading(false)

      if (!error.response?.data?.passwordUpdated) {
        setTimeout(() => navigate('/not-found'), 10000)
      }
    }
  }

  return (
    <div className="flex justify-center mt-20 items-center px-4">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center text-blue-600 text-4xl mb-4">
          <MdOutlineMailLock />
        </div>
        <h3 className="text-xl font-semibold mb-2">Reset Password</h3>
        <p className="text-sm text-gray-600 mb-4">
          Enter your new password below. Make sure it's strong and secure.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden mb-3">
            <input
              type="password"
              ref={passwordRef}
              placeholder="New Password"
              className="w-full px-4 py-2 focus:outline-none"
            />
            <button
              className="px-3 text-gray-600"
              onClick={(e) => handleShowPassword(e, passwordRef)}
              type="button"
            >
              {changeIcon ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden mb-3">
            <input
              type="password"
              ref={confirmPasswordRef}
              placeholder="Confirm New Password"
              className="w-full px-4 py-2 focus:outline-none"
            />
            <button
              className="px-3 text-gray-600"
              onClick={(e) => handleShowPassword(e, confirmPasswordRef)}
              type="button"
            >
              {changeIcon ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition mb-2"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Reset Password'}
          </button>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded text-sm mt-3 text-left">
            {error}
            {error === 'Password not strong enough' && (
              <ul className="list-disc list-inside mt-2 text-xs text-red-600">
                <li>At least 8 characters</li>
                <li>At least 1 lowercase</li>
                <li>At least 1 uppercase</li>
                <li>At least 1 number</li>
                <li>At least 1 symbol</li>
              </ul>
            )}
          </div>
        )}

        <p className="text-sm text-gray-500 mt-4">
          Back to{' '}
          <Link to="/" className="text-blue-600 hover:underline">
            Home Page
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RestPassword
