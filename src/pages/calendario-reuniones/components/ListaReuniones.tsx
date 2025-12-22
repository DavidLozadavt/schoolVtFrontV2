import React from 'react';
import { Task } from '../types'; 

// Ya no es necesario exportar esta función, simplificamos la lógica.
const getTaskStatus = (task: Task) => {
    // Si la fecha de la tarea es anterior a hoy, está Finalizada. De lo contrario, Programada.
    const taskDate = new Date(task.start + ' ' + task.time).getTime();
    const now = new Date().getTime();
    
    // Asumimos que si la duración es 0 o ya pasó, está "Finalizada"
    if (task.duration === 0 || now > taskDate + (task.duration * 60000)) {
        return "Finalizada";
    }
    return "Programada";
};

// 🗓️ COMPONENTE DEL ELEMENTO INDIVIDUAL
interface MeetingItemProps {
  task: Task;
}

const MeetingItem: React.FC<MeetingItemProps> = ({ task }) => {
  const status = getTaskStatus(task);
  const isCompleted = status === "Finalizada";

  return (
    <div
      className={`flex flex-col p-4 transition border rounded-xl shadow-md ${
        isCompleted
          ? 'border-gray-400 bg-gray-200 dark:bg-gray-700/50 opacity-75' 
          : 'border-blue-300 bg-white dark:bg-gray-100 dark:border-gray-700'
      } hover:shadow-lg`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className={`font-bold text-lg ${isCompleted ? 'line-through text-gray-600 dark:text-gray-500' : 'text-gray-900 dark:text-gray-900'}`}>
            {task.title}
        </p>
        <div className={`w-3 h-3 rounded-full ${task.color}`}></div>
      </div>

      <span className="text-sm text-gray-600 dark:text-gray-800">
        {task.start} <span className="font-bold">@ {task.time}</span> ({task.duration} min)
      </span>

      {/* ELIMINACIÓN DE BOTONES DE UNIRSE */}
      <div className="mt-3">
          <span className={`text-center text-sm font-medium ${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
              {isCompleted ? '✅ Tarea Finalizada' : '⏳ Tarea Programada'}
          </span>
      </div>
    </div>
  );
};


// 📚 COMPONENTE PRINCIPAL DE LA LISTA
interface ListaReunionesProps {
  tasks: Task[];
  activeMeetingId: string | undefined; // Mantenemos la prop pero no la usamos
  onScheduleClick: () => void; 
}

const ListaReuniones: React.FC<ListaReunionesProps> = ({ tasks, onScheduleClick }) => {
  return (
    // Se mantiene el modo oscuro
    <div className="flex-shrink-0 w-full p-4 transition-colors bg-white border border-gray-200 shadow-xl lg:w-80 dark:bg-gray-100 dark:border-gray-700 rounded-xl">
     <h2 className="flex items-center mb-4 text-2xl font-extrabold text-gray-900 dark:text-gray-900">
        Mis Reuniones
    </h2>

      <button 
        onClick={onScheduleClick}
        className="w-full py-2 mb-6 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        + Crear Nueva Reunión
      </button>

      <div className="flex flex-col gap-4">
        {tasks.map(t => (
          <MeetingItem
            key={t.id}
            task={t}
          />
        ))}
      </div>
    </div>
  );
};

export default ListaReuniones;