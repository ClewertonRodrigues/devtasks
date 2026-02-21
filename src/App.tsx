import { FormEvent, useState, useRef, useEffect, useMemo } from "react";
import 'animate.css';

import { CounterTasks } from "./components/counterTasks";
import { FilterTasks } from "./components/filtersTasks";
import { MessageInfo } from "./components/messageInfo";
import { ButtonActions } from "./components/buttonActions";
import { ButtonModal } from "./components/buttonModal";

import { CiSquareCheck } from "react-icons/ci";
import { IoIosList } from "react-icons/io";
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { FaRegTrashAlt, FaRegSave } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import { SlPencil } from "react-icons/sl";
import { FaRegClock } from "react-icons/fa6";

import toast from "react-hot-toast";

interface TaskProps {
  id: string;
  task: string;
  status: boolean;
  created: Date;
}

function App() {
  const inputEditRef = useRef<HTMLInputElement>(null);
  const firstRender = useRef(true);

  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [filter, setFilter] = useState<"todas" | "pendentes" | "concluidas">(
    "todas",
  );

  const completedTask = tasks.filter((task) => task.status).length;

  const [input, setInput] = useState("");
  const [inputEdit, setInputEdit] = useState("");

  const [editTask, setEditTask] = useState({
    enabled: false,
    task: "",
  });

  const [modal, setModal] = useState(false)
  const [idTaskDelete, setIdTaskDelete] = useState("")

  useEffect(() => {
    const tasksSaved = localStorage.getItem("@tasks");

    if (tasksSaved) {
      const parsed = JSON.parse(tasksSaved);

      const tasksConverted = parsed.map((item: TaskProps) => ({
        ...item,
        created: new Date(item.created),
      }));

      setTasks(tasksConverted);
    }
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    localStorage.setItem("@tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (editTask.enabled) {
      inputEditRef.current?.focus();
    }
  }, [editTask.enabled]);

  function handleRegisterTask(e: FormEvent) {
    e.preventDefault();
    handleFilterTask("todas");

    if (!input.trim()) {
      toast("Digite uma tarefa!", {
        icon: "❗",
      });
      return;
    } else if (input.trim().length < 3) {
      toast("Sua tarefa deve ter mais de 2 caracteres!", {
        icon: "❗",
      });
      return;
    }

    const taskExisting = tasks.some(
      (tarefas) => tarefas.task.toLowerCase() === input.toLowerCase(),
    );

    if (taskExisting) {
      toast.error("Essa tarefa já existe!");
      return;
    }

    const newTask: TaskProps = {
      id: crypto.randomUUID(),
      task: input,
      status: false,
      created: new Date(),
    };

    toast.success("Tafera adicionada!")
    setTasks((tarefas) => [...tarefas, newTask]);
    setInput("");
  }

  function confirmDeleteTask(action: boolean){
    if(action){
      const removeTask = tasks.filter((item) => item.id !== idTaskDelete);
      setTasks(removeTask);
      setIdTaskDelete("")
      setModal(!modal)

      toast.success("Tarefa exluída!");
    }else{
      setModal(!modal)
      setIdTaskDelete("")
    }
  }

  function handleDeleteTask(id: string) {
    setModal(!modal);
    setIdTaskDelete(id);
  }

  function handleEditTask(task: string) {
    setInputEdit(task);
    setEditTask({
      enabled: true,
      task: task,
    });
  }

  function validationEditTask(){
    if(!inputEdit.trim()){
      toast("Preencha o campo para editar a tarefa!", {
        icon: "🚫",
      });
      return false;
    } else if (inputEdit.trim().length < 3) {
      toast("Sua tarefa deve ter mais de 2 caracteres!", {
        icon: "❗",
      });
      return false;
    }

    return true;
  }

  function handleSaveEditTask(task: string) {

    if(!validationEditTask()){
      return;
    };
     
    const tarefaEditExisting = tasks.some(
      (tarefa) => tarefa.task.toLowerCase() === inputEdit.toLowerCase(),
    );

    if (task.toLowerCase() === inputEdit.toLowerCase() || !tarefaEditExisting){
      const findIndexTask = tasks.findIndex(
        (item) => item.task === editTask.task,
      );
      const copyTasks = [...tasks];

      copyTasks[findIndexTask].task = inputEdit;
      setTasks(copyTasks);

      setEditTask({
        enabled: false,
        task: "",
      });
      toast.success("Tarefa editada!")
    }else{
      toast.error("Essa tarefa já existe!");
      return;
    }
  }

  function handleCheckTask(id: string, status: boolean) {
    if (!status) {
      toast.success("Tarefa concluída!");
    }

    const checkedTask = tasks.map((tarefa) =>
      tarefa.id === id ? { ...tarefa, status: !tarefa.status } : tarefa,
    );

    setTasks(checkedTask);
  }

  function handleFilterTask(paramFil: "todas" | "pendentes" | "concluidas") {
    setFilter(paramFil);
  }

  const filtered = useMemo(() => {
    if(filter === "pendentes"){
      return tasks.filter(task => !task.status)
    }

    if(filter === "concluidas"){
      return tasks.filter(task => task.status)
    }

    return tasks;
  }, [tasks, filter])

  
  return (
      <main className="w-full min-h-screen flex flex-col items-center bg-linear-120 from-[#14203E] via-[#21388A] 
      to-[#511F87] relative">

        {modal && (
          <div className="min-h-screen w-full flex justify-center items-center absolute backdrop-blur-md z-50">
            <div className="bg-white/20 p-5 rounded-xl mx-2 animate__bounceIn">
              <span className="text-center text-white text-xl font-bold">Confirmar exclusão</span>
              <p className="mb-6 mt-2 text-gray-300">Tem certeza que deseja excluir esta tarefa?</p>

              <div className="flex justify-between">
                <ButtonModal
                  title="Cancelar"
                  style="bg-red-500 hover:bg-red-700"
                  onClick={() => confirmDeleteTask(false)}
                />
                <ButtonModal
                  title="Confirmar"
                  style="bg-green-500 hover:bg-green-600"
                  onClick={() => confirmDeleteTask(true)}
                />
              </div>
            </div>
          </div>
        )}
        

        <section>
          <div className="flex mt-8 gap-3 items-center justify-center">
            <CiSquareCheck
              size={60}
              color="white"
              className="bg-linear-120 from-[#5c7bcc] via-[#4b5989] to-[#663d91] p-2 rounded-xl"
            />
            <span className="text-white text-3xl md:text-4xl font-bold">
              Lista de tarefas
            </span>
          </div>

          <p className="text-white/60 mt-3 text-center">
            Organize suas atividades e mantenha-se produtivo
          </p>
        </section>

        <section className="w-full max-w-4xl mt-10 px-2">
          <form
            onSubmit={handleRegisterTask}
            className="w-full flex gap-3 h-12"
          >
            <input
              type="text"
              placeholder="Digite uma nova tarefa..."
              className="w-full bg-white/10 rounded-xl px-3 text-white outline-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="bg-linear-120 from-[#5c7bcc] via-[#4b5989] to-[#663d91] rounded-xl text-white px-2 md:px-5 transition-transform duration-700 hover:scale-103 hover:border"
            >
              <span className="mr-2">+</span>Adicionar
            </button>
          </form>

          <div className="w-full bg-white/5 mt-5 rounded-xl flex justify-around py-5">
            <CounterTasks
              counter={tasks.length}
              color="text-white"
              nameCounter="Todas"
            />
            <CounterTasks
              counter={tasks.length - completedTask}
              color="text-yellow-400"
              nameCounter="Pendentes"
            />
            <CounterTasks
              counter={completedTask}
              color="text-green-400"
              nameCounter="Concluídas"
            />
          </div>

          <div className="mt-5 flex gap-2 justify-center md:justify-start">
            <FilterTasks
              onClick={() => handleFilterTask("todas")}
              filter={filter === "todas" ? "bg-blue-700" : "bg-white/10"}
              icon={<IoIosList color="white" />}
              nameFilter="Todas"
            />

            <FilterTasks
              onClick={() => handleFilterTask("pendentes")}
              filter={filter === "pendentes" ? "bg-yellow-400" : "bg-white/10"}
              icon={<FaRegClock color="white" />}
              nameFilter="Pendentes"
            />

            <FilterTasks
              onClick={() => handleFilterTask("concluidas")}
              filter={filter === "concluidas" ? "bg-green-400" : "bg-white/10"}
              icon={<FiCheckCircle color="white" />}
              nameFilter="Concluídas"
            />
          </div>
        </section>

        <section className="w-full max-w-4xl pb-5 px-2">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center w-full mt-10">
              {filter === "todas" && (
                <>
                  <MessageInfo
                    icon={<IoIosList size={30} color="white" />}
                    message="Nenhuma tarefa no momento!"
                  />
                  <p className="text-gray-400">Adicione suas tarefas!</p>
                </>
              )}

              {filter === "pendentes" && (
                <MessageInfo
                  icon={<FaRegClock size={30} color="white" />}
                  message="Nenhuma tarefa pendente!"
                />
              )}

              {filter === "concluidas" && (
                <MessageInfo
                  icon={<FiCheckCircle size={30} color="white" />}
                  message="Nenhuma tarefa concluida!"
                />
              )}
            </div>
          )}

          {filtered.map((item) => (
            <article
              key={item.id}
              className={`mt-5 p-4  rounded-xl transition-colors duration-300 ${item.status ? "bg-slate-600/40" : "bg-white/10"}
            hover:scale-102 transition-transform`}
            >
              {editTask.enabled && editTask.task === item.task ? (
                <div className="flex justify-center mb-2">
                  <input
                    type="text"
                    title="Editar"
                    value={inputEdit}
                    onChange={(e) => setInputEdit(e.target.value)}
                    ref={inputEditRef}
                    className="w-full bg-slate-500/80 rounded-xl py-1.5 px-3 text-white outline-white mr-2.5"
                  />

                  <button
                    onClick={() => handleSaveEditTask(item.task)}
                    type="button"
                    title="Salvar"
                    className="cursor-pointer"
                  >
                    <FaRegSave color="#10C426" size={22} />
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    {item.status ? (
                      <button
                        type="button"
                        title="concluir"
                        disabled={editTask.enabled}
                        onClick={() => handleCheckTask(item.id, item.status)}
                      >
                        <FiCheckCircle
                          color="#10C426"
                          size={25}
                          className={`transition-all duration-300 ${editTask.enabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                        />
                      </button>
                    ) : (
                      <button
                        type="button"
                        title="concluir"
                        disabled={editTask.enabled}
                        onClick={() => handleCheckTask(item.id, item.status)}
                      >
                        <MdOutlineRadioButtonUnchecked
                          color="white"
                          size={25}
                          className={`transition-all duration-300 ${editTask.enabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                        />
                      </button>
                    )}

                    <p
                      className={`text-white first-letter:capitalize break-all ${item.status ? "line-through" : ""}`}
                    >
                      {item.task}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    {item.status === false && (
                      <ButtonActions
                        title="Editar"
                        disabled={editTask.enabled}
                        onClick={() => handleEditTask(item.task)}
                      >
                        <SlPencil
                          size={20}
                          color="#0DE4FC"
                          className={`${editTask.enabled ? "opacity-35" : "opacity-100"}`}
                        />
                      </ButtonActions>
                    )}

                    <ButtonActions
                      title="Excluir"
                      disabled={editTask.enabled}
                      onClick={() => handleDeleteTask(item.id)}
                    >
                      <FaRegTrashAlt
                        size={20}
                        color="#FC0D0D"
                        className={`${editTask.enabled ? "opacity-35" : "opacity-100"}`}
                      />
                    </ButtonActions>
                  </div>
                </div>
              )}

              <span className="text-sm text-white/40">
                Criada em{" "}
                {` ${item.created.toLocaleDateString("pt-BR")} ás ${item.created.toLocaleTimeString(
                  "pt-BR",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}`}
              </span>
            </article>
          ))}
        </section>
      </main>
  );
}

export default App;
