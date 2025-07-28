import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdOutlineSecurity } from "react-icons/md"
import axiosPublic from '../../../api/axios'

const VerifyOTP = ({ email, setOTPVerify }) => {
  const navigate = useNavigate()
  const inputs = useRef([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [otp, setOtp] = useState(Array(6).fill(''))

  const handleChange = (e, index) => {
    const value = e.target.value
    if (/^\d$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      if (index < 5) inputs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp]
      if (otp[index] === '') {
        if (index > 0) {
          inputs.current[index - 1].focus()
          newOtp[index - 1] = ''
        }
      } else {
        newOtp[index] = ''
      }
      setOtp(newOtp)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (!/^\d{6}$/.test(otp.join(''))) return setError('Invalid OTP')
      const response = await axiosPublic.post('/api/auth/verify-OTP', {
        email,
        otp: otp.join('')
      })
      setOTPVerify(response.data.otpVerified)
      setIsLoading(false)
      setError(null)
    } catch (error) {
      setError(error.response.data.error)
      setIsLoading(false)
      if (!error.response.data.otpVerified) {
        setTimeout(() => navigate('/not-found'), 10000)
      }
    }
  }

  return (
    <div className="flex justify-center mt-20 items-center px-4">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center text-blue-600 text-4xl mb-4">
          <MdOutlineSecurity />
        </div>
        <h3 className="text-xl font-semibold mb-2">OTP Verification</h3>
        <p className="text-sm text-gray-600 mb-4">
          A 6-digit OTP (One-Time Password) has been sent to <strong>{email}</strong>.
          <br /> Please enter it below to verify your identity.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-4">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputs.current[index] = el)}
                className="w-10 h-12 text-center border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Verify OTP'}
          </button>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded text-sm mt-4">
            {error}
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

export default VerifyOTP
