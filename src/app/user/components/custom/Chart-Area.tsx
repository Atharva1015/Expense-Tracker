import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

interface ChartDataPoint {
  date: string;
  amount: number;
  // formattedDate?: string; // For display purposes
}

interface ChartAreaProps {
  data: ChartDataPoint[];
  title?: string;
  days: string;
  setDays: React.Dispatch<React.SetStateAction<string>>;
  description?: string;
  dataKey?: string;
  xAxisKey?: string;
  color?: string;
  height?: string;
}

export function ChartArea({ 
  data,
  days,
  setDays,  
  title = "Expenses Over Time",
  description = "Your spending pattern analysis", 
  dataKey = "amount",
  xAxisKey = "date",
  color = "var(--chart-3)",
  height = "400px"
}: ChartAreaProps) {
  
  const chartConfig = {
    [dataKey]: {
      label: "Amount",
      color: color,
    },
  }
  // const [days, setDays] = useState("30");

  return (
    <section className="px-[2.5vw]">
      <Card className={`flex gap-3 w-full mx-auto`} style={{ height }}>
        <CardHeader className="relative">
          <CardTitle className="max-md:text-center">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
                  <Select value={days} onValueChange={setDays}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="60">Last 60 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
        </CardHeader>
        <CardContent className="px-10 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer className="aspect-auto h-[250px] w-full" config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={xAxisKey}
                tickLine={false}
                axisLine={false}
                tickMargin={7}
                tickFormatter={(value) => {
                  // Format date for display (e.g., "2024-01-15" -> "Jan 15")
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent 
                  indicator="dot" 
                  formatter={(value) => [`₹${value}`, "Amount"]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    });
                  }}
                />}
              />
              <Area
                dataKey={dataKey}
                type="monotone"
                fill={`var(--color-${dataKey})`}
                fillOpacity={0.4}
                stroke={`var(--color-${dataKey})`}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  )
}