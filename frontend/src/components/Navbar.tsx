import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { logout } from '../_store/authSlice';

const Navbar = () => {
  const [, , removeCookie] = useCookies();
  const dispatch = useDispatch(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    removeCookie('token'); 

    dispatch(logout());

    navigate('/sign-in'); 
  };

  return (
    <div className="bg-primary-dark fixed top-0 left-0 right-0 flex items-center justify-between p-4 shadow-md z-50">
      <h1 className="text-4xl font-bold text-primary-light tracking-wide cursor-pointer">
        Tusks
      </h1>
      
      <div className="hidden md:flex space-x-6">
        <Link to="/user-tasks" className="text-white text-lg hover:text-gray-300 transition">
          Tareas
        </Link>
      
      </div>

     
      <div className="hidden md:flex items-center">
        <button
          onClick={handleLogout}
          className=" border-2 border-white/60 text-white px-4 py-2 rounded-md transition">
          Cerrar Sesión
        </button>
      </div>

      <div className="md:hidden flex items-center">
        <MobileMenu />
      </div>
    </div>
  );
};


const MobileMenu = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [, , removeCookie] = useCookies();
  const dispatch = useDispatch(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    removeCookie('token');
    dispatch(logout());
    navigate('/sign-in');
  };

  return (
    <>
      <button
        className="text-white hover:text-gray-300 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      {menuOpen && (
        <div className="absolute top-16 right-0 mt-2 w-48 bg-primary-dark shadow-lg rounded-lg py-2 text-white/80">
          <Link to="/user-tasks" className="block px-4 py-2 hover:bg-light/50 transition">
            Tareas
          </Link>
          <Link to="/profile" className="block px-4 py-2 hover:bg-light/50 transition">
            Perfil
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 hover:text-white/90 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;