import { useState } from 'react';
import axios from 'axios';

function RegisterPage() {
  const [username, setUsername] = useState(""); // Estado para el nombre de usuario
  const [email, setEmail] = useState(""); // Estado para el correo electrónico
  const [password, setPassword] = useState(""); // Estado para la contraseña
  const [confirmPassword, setConfirmPassword] = useState(""); // Estado para confirmar la contraseña
  const [error, setError] = useState(""); // Estado para manejar errores
  const [success, setSuccess] = useState(""); // Estado para manejar éxito
  const [loading, setLoading] = useState(false); // Estado para manejar carga

  const handleRegister = async (e:any) => {
    e.preventDefault(); // Evitar que el formulario recargue la página
    setError(""); // Limpiar errores anteriores
    setSuccess(""); // Limpiar mensajes de éxito
    setLoading(true); // Iniciar carga

    // Validación básica de contraseña
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false); // Detener carga
      return;
    }

    try {
      // Hacer la solicitud POST para registrar un nuevo usuario
       await axios.post("http://localhost:4000/api/auth/register", {
        username,
        email,
        password,
      });

      setSuccess("Registro exitoso. Puedes iniciar sesión."); // Mensaje de éxito
      // Limpiar los campos después del registro
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err:any) {
      setError(err.response?.data?.message || "Error al registrar."); // Manejo de errores
      console.error("Error registering:", err);
    } finally {
      setLoading(false); // Detener carga
    }
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
          {/* Campo de Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-white/80"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username} // Bind de estado
                onChange={(e) => setUsername(e.target.value)} // Manejar cambios en el input
                disabled={loading} // Deshabilitar si está cargando
                className="w-full h-full p-3 selection:text-white/95 text-white/95 focus:border-white/75 bg-primary-dark/90 placeholder:text-white/80 focus-visible:text-white/95 placeholder:text-md rounded-[5px] border-white/70 border-2 focus:outline-none decoration-transparent shadow-md"
              />
            </div>
          </div>

          {/* Campo de Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-white/80"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email} // Bind de estado
                onChange={(e) => setEmail(e.target.value)} // Manejar cambios en el input
                disabled={loading} // Deshabilitar si está cargando
                className="w-full h-full p-3 selection:text-white/95 text-white/95 focus:border-white/75 bg-primary-dark/90 placeholder:text-white/80 focus-visible:text-white/95 placeholder:text-md rounded-[5px] border-white/70 border-2 focus:outline-none decoration-transparent shadow-md"
              />
            </div>
          </div>

          {/* Campo de Password */}
          <div>
            <div className="flex items-center justify-between ">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-white/80"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password} // Bind de estado
                onChange={(e) => setPassword(e.target.value)} // Manejar cambios en el input
                disabled={loading} // Deshabilitar si está cargando
                className="w-full h-full p-3 selection:text-white/95 text-white/95 focus:border-white/75 bg-primary-dark/90 placeholder:text-white/80 focus-visible:text-white/95 placeholder:text-md rounded-[5px] border-white/70 border-2 focus:outline-none decoration-transparent shadow-md"
              />
            </div>
          </div>

          {/* Campo de Confirm Password */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium leading-6 text-white/80"
              >
                Confirm Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                autoComplete="current-password"
                value={confirmPassword} // Bind de estado
                onChange={(e) => setConfirmPassword(e.target.value)} // Manejar cambios en el input
                disabled={loading} // Deshabilitar si está cargando
                className="w-full h-full p-3 selection:text-white/95 text-white/95 focus:border-white/75 bg-primary-dark/90 placeholder:text-white/80 focus-visible:text-white/95 placeholder:text-md rounded-[5px] border-white/70 border-2 focus:outline-none decoration-transparent shadow-md"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading} // Deshabilitar si está cargando
              className={`flex w-full justify-center rounded-md ${loading ? 'bg-gray-500' : 'bg-primary-light/90'} px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-light/95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            >
              {/* {loading ? (
                <></> // Muestra el loader si está cargando
              ) : ( */}
                Register
              {/* )} */}
            </button>
          </div>
        </form>

        {error && <p className="mt-4 text-center text-sm text-red-500">{error}</p>} {/* Mensaje de error */}
        {success && <p className="mt-4 text-center text-sm text-green-500">{success}</p>} {/* Mensaje de éxito */}

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