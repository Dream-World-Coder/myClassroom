// import { TrendingUp } from "lucide-react";
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
        <Card
            className={`border-none ${isDarkMode ? "bg-[#111]" : "bg-white"}`}
        >
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
