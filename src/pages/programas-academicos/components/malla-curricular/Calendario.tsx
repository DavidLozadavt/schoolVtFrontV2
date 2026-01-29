import { Calendar } from "lucide-react";

export const Calendario = () => {
  const daysOfWeek = ["lu", "ma", "mi", "ju", "vi", "sá", "do"];
  const assignedDays: Record<number, number> = {
    3: 2,
    7: 1,
    10: 3,
    15: 1,
    22: 2,
  };

  const daysInMonth = 31;
  const startOffset = 3;

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="p-6 space-y-6 bg-white border rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Calendar size={18} className="text-green-600" /> Calendario de Asignaciones
          </h3>
        </div>
      </div>

      <div className="font-medium text-center">enero 2026</div>

      <div className="grid grid-cols-7 text-sm text-center text-gray-500">
        {daysOfWeek.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 text-center gap-y-6">
        {cells.map((day, i) => (
          <div key={i} className="flex flex-col items-center justify-center h-14">
            {day !== null && (
              <>
                <span className="text-sm font-medium">{day}</span>
                {assignedDays[day] && (
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: assignedDays[day] }).map((_, idx) => (
                      <span key={idx} className="w-2 h-2 bg-green-500 rounded-full" />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}