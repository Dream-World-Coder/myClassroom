// import {
//   format,
//   eachDayOfInterval,
//   startOfWeek,
//   endOfWeek,
//   endOfToday,
//   addDays,
// } from "date-fns";

// const getColor = (count: number): string => {
//   if (count >= 5) return "bg-green-600";
//   if (count >= 3) return "bg-green-400";
//   if (count >= 1) return "bg-green-200";
//   return "bg-gray-200";
// };

// // Generate full date range from first to last
// const generateDateGrid = (startDate: Date, endDate: Date) => {
//   const start = startOfWeek(startDate, { weekStartsOn: 0 });
//   const end = endOfWeek(endDate, { weekStartsOn: 0 });
//   const totalDays = eachDayOfInterval({ start, end });
//   return totalDays;
// };

// export const StreakHeatmap = ({ data, weeks = 17 }) => {
//   const today = endOfToday();
//   const startDate = addDays(today, -weeks * 7);
//   const dateGrid = generateDateGrid(startDate, today);

//   // Convert data array to Map for faster lookup
//   const dataMap = new Map();
//   data.forEach(({ date, count }) => {
//     dataMap.set(date, count);
//   });

//   // Organize by weeks (columns)
//   const columns = Array.from({ length: weeks }, (_, weekIndex) => {
//     return Array.from({ length: 7 }, (_, dayIndex) => {
//       const date = addDays(
//         startOfWeek(addDays(startDate, weekIndex * 7)),
//         dayIndex,
//       );
//       const dateStr = format(date, "yyyy-MM-dd");
//       const count = dataMap.get(dateStr) || 0;
//       return {
//         date: dateStr,
//         count,
//       };
//     });
//   });

//   return (
//     <div className="overflow-x-auto p-4">
//       <div className="flex gap-1">
//         {columns.map((week, i) => (
//           <div key={i} className="flex flex-col gap-1">
//             {week.map((day, j) => (
//               <div
//                 key={j}
//                 title={`${day.date} — ${day.count} contributions`}
//                 className={`w-4 h-4 rounded-sm ${getColor(day.count)}`}
//               ></div>
//             ))}
//           </div>
//         ))}
//       </div>
//       <div className="text-xs text-gray-600 mt-2">
//         Streak over past {weeks} weeks
//       </div>
//     </div>
//   );
// };
