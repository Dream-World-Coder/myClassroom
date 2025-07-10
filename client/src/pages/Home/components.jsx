import {
  format,
  parseISO,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfToday,
  addDays,
} from "date-fns";

const getColor = (count) => {
  if (count >= 5) return "bg-green-600";
  if (count >= 3) return "bg-green-400";
  if (count >= 1) return "bg-green-200";
  return "bg-gray-200";
};

// Generate full date range from first to last
const generateDateGrid = (startDate, endDate) => {
  const start = startOfWeek(startDate, { weekStartsOn: 0 });
  const end = endOfWeek(endDate, { weekStartsOn: 0 });
  const totalDays = eachDayOfInterval({ start, end });
  return totalDays;
};

export const StreakHeatmap = ({ data, weeks = 17 }) => {
  const today = endOfToday();
  const startDate = addDays(today, -weeks * 7);
  const dateGrid = generateDateGrid(startDate, today);

  // Convert data array to Map for faster lookup
  const dataMap = new Map();
  data.forEach(({ date, count }) => {
    dataMap.set(date, count);
  });

  // Organize by weeks (columns)
  const columns = Array.from({ length: weeks }, (_, weekIndex) => {
    return Array.from({ length: 7 }, (_, dayIndex) => {
      const date = addDays(
        startOfWeek(addDays(startDate, weekIndex * 7)),
        dayIndex,
      );
      const dateStr = format(date, "yyyy-MM-dd");
      const count = dataMap.get(dateStr) || 0;
      return {
        date: dateStr,
        count,
      };
    });
  });

  return (
    <div className="overflow-x-auto p-4">
      <div className="flex gap-1">
        {columns.map((week, i) => (
          <div key={i} className="flex flex-col gap-1">
            {week.map((day, j) => (
              <div
                key={j}
                title={`${day.date} — ${day.count} contributions`}
                className={`w-4 h-4 rounded-sm ${getColor(day.count)}`}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-600 mt-2">
        Streak over past {weeks} weeks
      </div>
    </div>
  );
};

/**
 *
 *
 * Graph.jsx
 *
 */
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Sample data for the videos watched graph
const lecturesData = [
  { day: "Sunday", lectures: 3 },
  { day: "Monday", lectures: 4 },
  { day: "Tuesday", lectures: 3 },
  { day: "Wednesday", lectures: 5 },
  { day: "Thursday", lectures: 2 },
  { day: "Friday", lectures: 6 },
  { day: "Saturday", lectures: 1 },
  // { day: "Sunday", lectures: 3 },
];

const chartConfig = {
  lectures: {
    label: "Lectures Watched",
    color: "hsl(var(--chart-2))",
  },
};

export function Graph({ isDarkMode = false }) {
  return (
    <Card className={`border-none ${isDarkMode ? "bg-[#111]" : "bg-white"}`}>
      <CardHeader>
        <CardTitle>Lectures Watched</CardTitle>
        <CardDescription className="font-light">
          Weekly Progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={lecturesData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="lectures"
              type="natural"
              stroke="var(--color-lectures)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-lectures)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 font-medium leading-none">
                    Trending up by 5.2% this month{" "}
                    <TrendingUp className="h-4 w-4" />
                </div> */}
        <div className="leading-none text-muted-foreground">
          lectures watched this week{" "}
        </div>
      </CardFooter>
    </Card>
  );
}
