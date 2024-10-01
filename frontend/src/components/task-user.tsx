import { TbTrash } from "react-icons/tb";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, addTask } from "../_store/tasksSlice"; // Asegúrate de que la ruta sea correcta
import { MdClose } from "react-icons/md";
import emptyStateSvg from "../../public/empty_state.svg";

function TaskUserPage() {
  const [newTitle, setNewTitle] = useState(""); // Estado para el nombre de la nueva tarea
  const [newDescription, setNewDescription] = useState(""); // Estado para la descripción
  const [newProgreso, setNewProgreso] = useState(""); // Estado para el progreso
  const [modalOpen, setModalOpen] = useState(false); // Estado para el modal
  const navigate = useNavigate();
  const [cookie] = useCookies();
  const dispatch = useDispatch();

  // Obtener tareas y estado de carga del store de Redux
  const { tasks = [], loading } = useSelector((state) => state.tasks || {});

  useEffect(() => {
    if (!cookie.token) {
      navigate("/sign-in");
    } else {
      dispatch(fetchTasks(cookie.token));
    }
  }, [cookie.token, navigate, dispatch]);

  const handleAddTask = async (e: any) => {
    e.preventDefault(); // Evitar que el formulario recargue la página

    try {
      await dispatch(
        addTask({
          title: newTitle,
          description: newDescription,
          progress: newProgreso,
          token: cookie.token,
        })
      );
      // Limpiar los campos después de agregar
      setNewTitle("");
      setNewDescription("");
      setNewProgreso("");
      setModalOpen(false); // Cerrar el modal después de agregar
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:4000/api/tasks/${taskId}`, {
        headers: {
          token: cookie.token, // Enviar el token en el header
        },
      });

      // Filtrar la tarea eliminada de la lista
      dispatch(fetchTasks(cookie.token)); // Recargar tareas después de eliminar
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full h-full flex-col justify-center px-6 py-12 lg:px-8 bg-primary-dark">
      <Navbar />
      <div className="w-full h-full mt-12">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-primary-light/95 hover:bg-primary-light text-white/90 px-4 py-2 rounded-md transition"
        >
          Agregar Tarea
        </button>

        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-primary-dark bg-opacity-50 z-50">
            <div className="bg-primary-dark p-6 rounded-lg shadow-lg w-96">
              {" "}
              {/* Aumentar el ancho del modal */}
              <div className="flex justify-between -z-1">
                <h2 className="text-xl font-bold mb-4 text-white/80">
                  Agregar Nueva Tarea
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-white/80 text-lg hover:text-white/90 transition"
                >
                  <MdClose />
                </button>
              </div>
              <form
                onSubmit={handleAddTask}
                className="flex flex-col gap-2 w-full"
              >
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Nombre de la tarea"
                  required
                  className="w-full h-full p-3 selection:text-white/95 text-white/95 focus:border-white/75 bg-primary-dark/90 placeholder:text-white/80 focus-visible:text-white/95 placeholder:text-md rounded-[5px] border-white/70 border-2 focus:outline-none decoration-transparent shadow-md"
                />
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Descripción"
                  required
                  className="w-full h-24 p-3 selection:text-white/95 text-white/95 focus:border-white/75 bg-primary-dark/90 placeholder:text-white/80 focus-visible:text-white/95 placeholder:text-md rounded-[5px] border-white/70 border-2 focus:outline-none decoration-transparent shadow-md"
                />
                <div className="flex flex-col">
                  <label htmlFor="progress" className="text-white/80 mb-2">
                    Progreso (%): {newProgreso}
                  </label>
                  <input
                    type="range"
                    id="progress"
                    min="0"
                    max="100"
                    value={newProgreso}
                    onChange={(e) => setNewProgreso(e.target.value)}
                    className="w-full h-2 bg-primary-light/20 rounded-lg appearance-none cursor-pointer focus:outline-none"
                    style={{
                      background: `linear-gradient(to right, #ffffff ${newProgreso}%, #4a4a4a ${newProgreso}%)`, // Progreso dinámico
                    }}
                  />
                </div>

                <style jsx>{`
                  input[type="range"]::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #ffffff; /* Color blanco para el thumb */
                    cursor: pointer;
                  }

                  input[type="range"]::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #ffffff; /* Color blanco para el thumb */
                    cursor: pointer;
                  }
                `}</style>
                <button
                  type="submit"
                  className={`bg-primary-light mt-4 text-white px-4 py-2 rounded-md transition ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading} // Deshabilitar el botón si está cargando
                >
                  {loading ? "Cargando..." : "Agregar"}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="w-full overflow-y-auto mt-4">
          {/* Empty state */}
          {tasks.length === 0 && !loading ? (
            <div className="flex flex-col justify-center items-center text-white/70 py-10">
              <img
                src={emptyStateSvg}
                alt="No hay tareas"
                className="w-40 h-40 mb-4"
              />
              <p>No hay tareas disponibles. ¡Agrega tu primera tarea!</p>
            </div>
          ) : (
            <ul className="rounded-lg flex flex-col space-y-4">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className="bg-primary-dark/80 p-2 my-2 rounded-lg shadow-xl relative"
                >
                  <button
                    onClick={() => deleteTask(task._id)} // Llamar la función para eliminar
                    className="absolute top-2 right-2 hover:text-white/70 text-white/60 px-2.5 py-1.5 rounded-md transition"
                  >
                    <TbTrash />
                  </button>
                  <h3 className="text-xl font-semibold text-white/85">
                    {task.title}
                  </h3>
                  <p className="text-white/80">{task.description}</p>
                  <p className="text-white/80">Progreso: {task.progress}</p>
                  <div className="bg-primary-light/10 rounded-full w-full h-2 mt-2">
                    <div
                      className="bg-primary-light h-full rounded-full"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(Number(task.progress), 100)
                        )}%`, // Asegura que el valor esté entre 0 y 100
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskUserPage;
