import { TbTrash } from "react-icons/tb";
import Navbar from "./Navbar";

const tasks = [
  {
    name: "My tarea",
    description: "Hacer test de algo",
    progreso: "70%",
  },
  {
    name: "My tarea 2",
    description: "Hacer test de algo",
    progreso: "72%",
  },
  {
    name: "My tarea 3",
    description: "Hacer test de algo",
    progreso: "73%",
  },
  {
    name: "My tarea 4",
    description: "Hacer test de algo",
    progreso: "2%",
  },
  {
    name: "My tarea 4",
    description: "Hacer test de algo",
    progreso: "2%",
  },
  {
    name: "My tarea 4",
    description: "Hacer test de algo",
    progreso: "2%",
  },
];

function TaskUserPage() {
  return (
    <div className="flex min-h-screen w-full h-full flex-col justify-center px-6 py-12 lg:px-8 bg-primary-dark">
      <Navbar />
      <div className="w-full h-full mt-12">
        <form className="flex mb-6 space-x-4 p-3">
          <input
            type="text"
            // value={newTask}
            // onChange={(e) => setNewTask(e.target.value)}
            placeholder="Nombre de la tarea"
            className="w-full h-full p-3 selection:text-white/95 text-white/95 focus:border-white/75 bg-primary-dark/90 placeholder:text-white/80 focus-visible:text-white/95 placeholder:text-md  rounded-[5px] border-white/70 border-2 focus:outline-none decoration-transparent shadow-md"
            />
          <input
            type="text"
            // value={newDescription}
            // onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Descripción"
            className="w-full h-full p-3 selection:text-white/95 text-white/95 focus:border-white/75 bg-primary-dark/90 placeholder:text-white/80 focus-visible:text-white/95 placeholder:text-md  rounded-[5px] border-white/70 border-2 focus:outline-none decoration-transparent shadow-md"
            />
          <input
            type="text"
            // value={newProgreso}
            // onChange={(e) => setNewProgreso(e.target.value)}
            placeholder="Progreso (%)"
            className="w-full h-full p-3 selection:text-white/95 text-white/95 focus:border-white/75 bg-primary-dark/90 placeholder:text-white/80 focus-visible:text-white/95 placeholder:text-md  rounded-[5px] border-white/70 border-2 focus:outline-none decoration-transparent shadow-md"
            />
          <button
            type="submit"
            className="bg-primary-light/95 hover:bg-primary-light text-white/90 px-4 py-2 rounded-md transition"
          >
            Agregar
          </button>
        </form>
        <div className="w-full overflow-y-auto">
        <ul className="rounded-lg flex flex-col space-y-4">
          {tasks.map((task, index) => (
            <li
              key={index}
              className="bg-primary-dark/80 p-2 my-2 rounded-lg shadow-xl relative"
            >
              <button
                //   onClick={() => handleDeleteTask(index)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md transition"
              >
                <TbTrash/>
              </button>
              <h3 className="text-xl font-semibold text-white/85">
                {task.name}
              </h3>
              <p className=" text-white/80">{task.description}</p>
              <p className=" text-white/80">Progreso: {task.progreso}</p>
              <div className="bg-primary-light/30 rounded-full w-full h-2 mt-2">
                <div
                  className="bg-primary-light h-full rounded-full"
                  style={{ width: task.progreso }}
                />
              </div>
            </li>
          ))}
        </ul>
        </div>
        
      </div>
    </div>
  );
}

export default TaskUserPage;
