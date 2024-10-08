import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, clearMessages } from "../_store/authSlice"; // Asegúrate de la ruta correcta
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../_store";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch:AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [, setCookie] = useCookies();
  
  const { error, success, loading, token } = useSelector((state:RootState) => state.auth); // Selecciona el estado de autenticación

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearMessages()); // Limpiar mensajes anteriores
    dispatch(login({ email, password })); // Disparar la acción de login
  };

  useEffect(() => {
    if (token) {
      setCookie('token', token); // Guardar el token en las cookies
      navigate('/user-tasks'); // Redirigir después del inicio de sesión
    }
  }, [token, setCookie, navigate]);

  // Validación del formato de email
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Expresión regular para validar el formato de email
  const isFormValid = isEmailValid && password; // Valida que el email sea válido y que la contraseña esté llena

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-primary-dark">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="text-center text-6xl text-light font-bold tracking-wide">Tusks</h1>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white/90">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {error && <div className="bg-red-600 text-white p-3 rounded-md mb-4">{error}</div>}
        {success && <div className="bg-green-600 text-white p-3 rounded-md mb-4">{success}</div>}

        <form action="#" method="POST" className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="email123@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-full p-3 selection:text-white/95 text-white/95 focus:border-white/75 bg-primary-dark/90 placeholder:text-white/80 focus-visible:text-white/95 placeholder:text-md  rounded-[5px] border-white/70 border-2 focus:outline-none decoration-transparent shadow-md"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password1234*"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-full p-3 selection:text-white/95 text-white/95 focus:border-white/75 bg-primary-dark/90 placeholder:text-white/80 focus-visible:text-white/95 placeholder:text-md  rounded-[5px] border-white/70 border-2 focus:outline-none decoration-transparent shadow-md"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!isFormValid || loading} // Desactiva el botón si el formulario no es válido o está cargando
              className={`flex w-full justify-center rounded-md ${isFormValid && !loading ? 'bg-light/90 hover:bg-light' : 'bg-gray-600 cursor-not-allowed'} px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            >
              {loading ? "Loading..." : "Sign in"}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-white/80">
          Not a member?{' '}
          <a href="/register" className="font-semibold leading-6 text-light/80 hover:text-light/90">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignIn;