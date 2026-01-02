import React from 'react';
import {
  Calendar,
  BookOpen,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

/* ===== DATA MOCK ===== */

const upcomingEvents = [
  {
    id: 1,
    title: 'Robot Fest',
    description: 'Feria de tecnología',
    date: '14 Dic 2025',
    time: '10:00 am'
  },
  {
    id: 2,
    title: 'Webinar Minecraft',
    description: 'Nuevas herramientas educativas',
    date: '21 Dic 2025',
    time: '11:00 am'
  }
];

const todayClasses = [
  {
    id: 1,
    subject: 'Programación',
    hour: '08:00 - 09:30',
    teacher: 'Ing. Carlos Pérez',
    status: 'En curso',
    color: 'bg-blue-100 text-blue-700'
  },
  {
    id: 2,
    subject: 'Matemáticas',
    hour: '10:00 - 11:30',
    teacher: 'Lic. Ana Gómez',
    status: 'Próxima',
    color: 'bg-emerald-100 text-emerald-700'
  }
];

const kpis = [
  {
    label: 'Promedio',
    value: '4.2',
    icon: TrendingUp,
    color: 'text-indigo-600'
  },
  {
    label: 'Asistencia',
    value: '92%',
    icon: CheckCircle,
    color: 'text-emerald-600'
  },
  {
    label: 'Materias',
    value: '6',
    icon: BookOpen,
    color: 'text-blue-600'
  },
  {
    label: 'Pendientes',
    value: '3',
    icon: AlertTriangle,
    color: 'text-orange-500'
  }
];

const tasks = [
  {
    id: 1,
    title: 'Tarea Programación',
    subject: 'Programación',
    date: '20 Sep'
  },
  {
    id: 2,
    title: 'Parcial Matemáticas',
    subject: 'Matemáticas',
    date: '23 Sep'
  }
];

const subjects = [
  {
    id: 1,
    name: 'Programación',
    teacher: 'Carlos Pérez',
    avg: 4.5,
    progress: 80,
    status: 'Bien'
  },
  {
    id: 2,
    name: 'Matemáticas',
    teacher: 'Ana Gómez',
    avg: 3.6,
    progress: 60,
    status: 'Puede mejorar'
  },
  {
    id: 3,
    name: 'Física',
    teacher: 'Juan López',
    avg: 2.9,
    progress: 40,
    status: 'En riesgo'
  }
];

/* ===== COMPONENT ===== */

const EstudiantesDashboard = () => {
  return (
    <div className="space-y-6">

      {/* ===== HEADER ===== */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            ¡Hola, Juan! 👋
          </h2>
          <p className="text-gray-500 text-sm">
            Grado 10° A · {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-100 text-emerald-700 font-semibold">
          🟢 Al día
        </div>
      </div>

      {/* ===== GRID PRINCIPAL ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ===== CLASES DE HOY ===== */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">📚 Clases de hoy</h3>

          {todayClasses.map(cls => (
            <div
              key={cls.id}
              className={`rounded-xl p-4 ${cls.color}`}
            >
              <h4 className="font-semibold">{cls.subject}</h4>
              <p className="text-sm">{cls.teacher}</p>

              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {cls.hour}
                </span>
                <span className="font-medium">{cls.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ===== KPIs ===== */}
        <div className="grid grid-cols-2 gap-4">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center"
              >
                <Icon className={`w-8 h-8 mb-2 ${kpi.color}`} />
                <span className="text-2xl font-bold">{kpi.value}</span>
                <span className="text-sm text-gray-500">{kpi.label}</span>
              </div>
            );
          })}
        </div>

        {/* ===== COLUMNA DERECHA ===== */}
        <div className="space-y-6">

          {/* ===== PENDIENTES ===== */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <h3 className="font-semibold">Pendientes</h3>
            </div>

            <div className="space-y-3">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className="border rounded-lg p-3 text-sm"
                >
                  <p className="font-medium">{task.title}</p>
                  <div className="flex justify-between text-gray-500">
                    <span>{task.subject}</span>
                    <span>{task.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== UPCOMING EVENTS ===== */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">🎉 Próximos eventos</h3>
              <span className="text-sm text-indigo-500 cursor-pointer hover:underline">
                Ver todos
              </span>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map(event => (
                <div
                  key={event.id}
                  className="flex gap-3 items-start"
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-sm">
                    {event.date.split(' ')[0]}
                  </div>

                  <div className="text-sm">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-gray-500">{event.description}</p>
                    <span className="text-xs text-gray-400">
                      {event.date} · {event.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ===== MIS ASIGNATURAS ===== */}
      <div>
        <h3 className="font-semibold text-lg mb-4">📘 Mis asignaturas</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subjects.map(subject => (
            <div
              key={subject.id}
              className="bg-white rounded-xl shadow p-4"
            >
              <h4 className="font-semibold">{subject.name}</h4>
              <p className="text-sm text-gray-500 mb-2">
                {subject.teacher}
              </p>

              <div className="flex justify-between text-sm mb-2">
                <span>Promedio</span>
                <span className="font-semibold">{subject.avg}</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full"
                  style={{ width: `${subject.progress}%` }}
                />
              </div>

              <span
                className={`text-xs font-medium ${
                  subject.status === 'Bien'
                    ? 'text-emerald-600'
                    : subject.status === 'Puede mejorar'
                    ? 'text-orange-500'
                    : 'text-red-600'
                }`}
              >
                {subject.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default EstudiantesDashboard;
