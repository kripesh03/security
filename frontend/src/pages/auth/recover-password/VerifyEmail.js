import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdOutlineMailLock } from 'react-icons/md'
import axiosPublic from '../../../api/axios'
import RestPassword from './RestPassword'
import VerifyOTP from './VerifyOTP'
const validator = require('validator')
const EMAIL_VALIDATOR_OPTIONS = { host_whitelist: ['gmail.com', 'yahoo.com', 'outlook.com'] }

const VerifyEmail = () => {
  const emailRef = useRef('')
  const navigate = useNavigate()
  const [email, setEmail] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [otpVerify, setOTPVerify] = useState(false)

  const validateEmail = (emailInput) => {
    if (validator.isEmpty(emailInput, { ignore_whitespace: true }))
      throw Error('Email is required', 400)

    if (!validator.isEmail(emailInput, EMAIL_VALIDATOR_OPTIONS))
      throw Error('Email not valid', 400)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      validateEmail(emailRef.current.value.trim())

      const response = await axiosPublic.post('/api/auth/verify-email', {
        email: emailRef.current.value.trim()
      })

      setIsVerified(response.data.emailVerified)
      setEmail(response.data.email)
      setIsLoading(false)
    } catch (error) {
      setError(error.response?.data?.error || 'An unexpected error occurred')
      setIsLoading(false)
    }
  }

  return (
    <>
      {!isVerified && (
        <div className="flex justify-center mt-20 items-center px-4">
          <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full text-center">
            <div className="flex justify-center text-blue-600 text-4xl mb-4">
              <MdOutlineMailLock />
            </div>
            <h3 className="text-xl font-semibold mb-2">Forgot Your Password?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please enter your email address. We will send a one-time password (OTP) to this address for verification.
            </p>
            <form onSubmit={handleSubmit} className="mb-3">
              <input
                type="email"
                ref={emailRef}
                placeholder="Email Address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Next'}
              </button>
            </form>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded text-sm mb-2">
                {error}
              </div>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Back to{' '}
              <Link to="/" className="text-blue-600 hover:underline">
                Home Page
              </Link>
            </p>
          </div>
        </div>
      )}

      {isVerified && !otpVerify && <VerifyOTP setOTPVerify={setOTPVerify} email={email} />}
      {isVerified && otpVerify && <RestPassword email={email} />}
    </>
  )
}

export default VerifyEmail
