import { TbTrash } from "react-icons/tb";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, addTask } from "../_store/tasksSlice";
import { MdClose } from "react-icons/md";
import emptyStateSvg from "../../public/empty_state.svg";
import { AppDispatch, RootState } from "../_store";
import { URL_API } from '../config';
import { BiEdit } from "react-icons/bi";

function TaskUserPage() {
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newProgreso, setNewProgreso] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Nuevo estado para controlar si estamos editando
  const [editTaskId, setEditTaskId] = useState<string | null>(null); // Guardar el ID de la tarea que se está editando
  const navigate = useNavigate();
  const [cookie] = useCookies();
  const dispatch: AppDispatch = useDispatch();

  const { tasks = [], loading } = useSelector(
    (state: RootState) => state.tasks || {}
  );

  useEffect(() => {
    if (!cookie.token) {
      navigate("/sign-in");
    } else {
      dispatch(fetchTasks(cookie.token));
    }
  }, [cookie.token, navigate, dispatch]);

  const handleAddOrUpdateTask = async (e: any) => {
    e.preventDefault();
    
    try {
      if (isEditing && editTaskId) {
        // Si estamos editando, realizar la actualización
        await axios.put(
          `${URL_API}/api/tasks/${editTaskId}`,
          {
            title: newTitle,
            description: newDescription,
            progress: newProgreso,
          },
          {
            headers: {
              token: cookie.token,
            },
          }
        );
      } else {
        // Si no estamos editando, agregar una nueva tarea
        await dispatch(
          addTask({
            title: newTitle,
            description: newDescription,
            progress: newProgreso,
            token: cookie.token,
          })
        );
      }

      // Limpiar campos y cerrar el modal
      setNewTitle("");
      setNewDescription("");
      setNewProgreso("");
      setModalOpen(false);
      setIsEditing(false); // Reiniciar estado de edición
      dispatch(fetchTasks(cookie.token)); // Recargar tareas
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await axios.delete(`${URL_API}/api/tasks/${taskId}`, {
        headers: {
          token: cookie.token,
        },
      });
      dispatch(fetchTasks(cookie.token)); // Recargar tareas después de eliminar
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const editTask = (taskId: string) => {
    const task:any = tasks.find((t: any) => t._id === taskId);
    if (task) {
      setNewTitle(task.title);
      setNewDescription(task.description);
      setNewProgreso(task.progress);
      setEditTaskId(taskId); // Establecer la tarea que se va a editar
      setIsEditing(true);
      setModalOpen(true); // Abrir el modal
    }
  };

  return (
    <div className="flex min-h-screen w-full h-full flex-col justify-center px-6 py-12 lg:px-8 bg-primary-dark">
      <Navbar />
      <div className="w-full h-full mt-12">
        <button
          onClick={() => {
            setModalOpen(true);
            setIsEditing(false); // No estamos editando al agregar una tarea
          }}
          className="bg-primary-light/95 hover:bg-primary-light text-white/90 px-4 py-2 rounded-md transition"
        >
          Agregar Tarea
        </button>

        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-primary-dark bg-opacity-50 z-50">
            <div className="bg-primary-dark p-6 rounded-lg shadow-lg w-96">
              <div className="flex justify-between -z-1">
                <h2 className="text-xl font-bold mb-4 text-white/80">
                  {isEditing ? "Editar Tarea" : "Agregar Nueva Tarea"}
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-white/80 text-lg hover:text-white/90 transition"
                >
                  <MdClose />
                </button>
              </div>
              <form
                onSubmit={handleAddOrUpdateTask}
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
                      background: `linear-gradient(to right, #ffffff ${newProgreso}%, #4a4a4a ${newProgreso}%)`,
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className={`bg-primary-light mt-4 text-white px-4 py-2 rounded-md transition ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading
                    ? "Cargando..."
                    : isEditing
                    ? "Guardar Cambios"
                    : "Agregar"}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="w-full overflow-y-auto mt-4">
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
              {tasks.map((task: any) => (
                <li
                  key={task._id}
                  className="bg-primary-dark/80 p-2 my-2 rounded-lg shadow-xl relative"
                >
                  <div className="flex justify-between">
                    <h3 className="text-xl font-semibold text-white/85">
                      {task.title}
                    </h3>
                    <div className="flex">
                      <button
                        onClick={() => editTask(task._id)}
                        className="hover:text-white/70 text-white/60 px-2.5 py-1.5 rounded-md transition"
                      >
                        <BiEdit />
                      </button>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="hover:text-white/70 text-white/60 px-2.5 py-1.5 rounded-md transition"
                      >
                        <TbTrash />
                      </button>
                    </div>
                  </div>
                  <p className="text-white/80">{task.description}</p>
                  <p className="text-white/80">Progreso: {task.progress}</p>
                  <div className="bg-primary-light/10 rounded-full w-full h-2 mt-2">
                    <div
                      className="bg-primary-light h-full rounded-full"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(Number(task.progress), 100)
                        )}%`,
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
