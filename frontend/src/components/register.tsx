import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../_store/registerSlice'; // Ensure this path is correct
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { AppDispatch } from '../_store';

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState(""); // State for password mismatch error
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [, setCookie] = useCookies();

  const { loading, error, success, token } = useSelector((state: any) => state.register);

  useEffect(() => {
    if (token) {
      setCookie('token', token);
      navigate('/user-tasks');
    }
  }, [token, setCookie, navigate]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = () => {
    return username && isValidEmail(email) && password && confirmPassword;
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMatchError("Passwords do not match."); 
      return;
    }

   
    setPasswordMatchError("");

    if (!isFormValid()) {
      return; 
    }

    const userData = { username, email, password };
    dispatch(registerUser(userData)); 
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-primary-dark">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="text-center text-6xl text-light font-bold tracking-wide">
          Tusks
        </h1>

        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Register an TaskAccount
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleRegister} className="space-y-6">
          {/* Input para Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-white/80">
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder='tusks123'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full h-full p-3 selection:text-white/95 text-white/95 focus:border-white/75 bg-primary-dark/90 placeholder:text-white/80 focus-visible:text-white/95 placeholder:text-md rounded-[5px] border-white/70 border-2 focus:outline-none decoration-transparent shadow-md"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-white/80">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder='correo@email.com'
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full h-full p-3 selection:text-white/95 text-white/95 focus:border-white/75 bg-primary-dark/90 placeholder:text-white/80 focus-visible:text-white/95 placeholder:text-md rounded-[5px] border-white/70 border-2 focus:outline-none decoration-transparent shadow-md"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between ">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-white/80">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder='Password1234'
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full h-full p-3 selection:text-white/95 text-white/95 focus:border-white/75 bg-primary-dark/90 placeholder:text-white/80 focus-visible:text-white/95 placeholder:text-md rounded-[5px] border-white/70 border-2 focus:outline-none decoration-transparent shadow-md"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-white/80">
                Confirm Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                placeholder='Password1234'
                required
                autoComplete="current-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="w-full h-full p-3 selection:text-white/95 text-white/95 focus:border-white/75 bg-primary-dark/90 placeholder:text-white/80 focus-visible:text-white/95 placeholder:text-md rounded-[5px] border-white/70 border-2 focus:outline-none decoration-transparent shadow-md"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className={`flex w-full justify-center rounded-md ${loading ? 'bg-gray-500' : (isFormValid() ? 'bg-primary-light/90' : 'bg-primary-dark')} px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            >
              {loading ? "Loading ..." : "Register"}
            </button>
          </div>
        </form>

        {error && <p className="mt-4 text-center text-sm text-red-500">{error}</p>}
        {success && <p className="mt-4 text-center text-sm text-green-500">{success}</p>}
        {passwordMatchError && <p className="mt-4 text-center text-sm text-red-500">{passwordMatchError}</p>} {/* Display password match error */}

        <p className="mt-10 text-center text-sm text-white/80">
          Already a member?{" "}
          <a
            href="/sign-in"
            className="font-semibold leading-6 text-primary-light/95 hover:text-primary-light"
          >
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
