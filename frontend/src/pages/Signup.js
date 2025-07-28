import { useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { TbMailForward } from "react-icons/tb";
import { Link } from "react-router-dom";
import PersistLoginAlert from "../components/auth/PersistLoginAlert";
import PersistLoginCheckbox from "../components/auth/PersistLoginCheckbox";
import SignInWithGoogleButton from "../components/auth/SignInWithGoogleButton";
import usePersist from "../hooks/usePersist";
import { useSignup } from "../hooks/useSignup";

const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[\W_]/.test(password)) score++;

  let percent = (score / 5) * 100;
  let color = "bg-red-500";
  let label = "Weak";

  if (score === 3 || score === 4) {
    color = "bg-yellow-400";
    label = "Moderate";
  } else if (score === 5) {
    color = "bg-green-500";
    label = "Strong";
  }

  return { score, percent, color, label };
};

const Signup = () => {
  const { signup, error, isLoading, mailSent } = useSignup();
  const { persist, setPersist } = usePersist();
  const [changeIcon, setChangeIcon] = useState(false);
  const [password, setPassword] = useState("");
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(
      nameRef.current.value,
      emailRef.current.value.trim(),
      passwordRef.current.value.trim(),
      persist
    );
  };

  const handleShowPassword = (e) => {
    e.preventDefault();
    const isPassword = passwordRef.current.type === "password";
    passwordRef.current.type = isPassword ? "text" : "password";
    setChangeIcon(isPassword);
  };

  const strength = getPasswordStrength(password);

  return (
    <>
      {!mailSent && (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-center mb-1">
            Create Your Account
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Join and start connecting!
          </p>

          <form onSubmit={handleSubmit}>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Username
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              type="text"
              ref={nameRef}
            />

            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              type="email"
              ref={emailRef}
            />

            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative mb-1">
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                ref={passwordRef}
                autoComplete="off"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600"
                onClick={handleShowPassword}
              >
                {changeIcon ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {password && (
              <div className="mb-3">
                <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-2 transition-all duration-300 ${strength.color}`}
                    style={{ width: `${strength.percent}%` }}
                  />
                </div>
                <p className="text-sm font-medium mt-1 text-gray-600">
                  Password Strength: {strength.label}
                </p>
              </div>
            )}

            <PersistLoginCheckbox persist={persist} setPersist={setPersist} />

            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 mt-4 rounded-lg transition duration-200"
              disabled={isLoading}
            >
              Register
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mt-4 text-sm">
                {error}
                {error === "Password not strong enough" && (
                  <ul className="list-disc list-inside text-xs mt-1">
                    <li>At least 8 characters</li>
                    <li>At least 1 lowercase</li>
                    <li>At least 1 uppercase</li>
                    <li>At least 1 number</li>
                    <li>At least 1 symbol</li>
                  </ul>
                )}
              </div>
            )}
          </form>

          <div className="my-4 border-t relative">
            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-2 text-sm text-gray-400">
              or
            </span>
          </div>

          <SignInWithGoogleButton persist={persist} setPersist={setPersist} />

          {persist && <PersistLoginAlert maxWidth="400px" marginAuto={true} />}
        </div>
      )}

      {mailSent && (
        <div className="max-w-lg mx-auto mt-10 p-8 bg-white shadow-lg rounded-xl text-center">
          <div className="flex justify-center mb-4 text-blue-600 text-5xl">
            <TbMailForward />
          </div>
          <h3 className="text-xl font-semibold mb-2">Verify your email</h3>
          <p className="text-gray-600 mb-2">
            We've sent you a link in your email to verify your email address and
            activate your account. Just click the link to complete the signup
            process.
          </p>
          <p className="text-sm font-medium text-blue-500">
            The link in the email will expire in 15 minutes.
          </p>
        </div>
      )}
    </>
  );
};

export default Signup;
