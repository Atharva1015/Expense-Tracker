// components/ExpensePieChart.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Label, Legend, Pie, PieChart, Sector } from "recharts"
import { useMemo, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
interface ExpenseCategoryData {
  category: string;
  amount: number;
}

interface ExpensePieChartProps {
  data: ExpenseCategoryData[];
  title?: string;
  description?: string;
  height?: string;
}

// Color palette for different categories
const COLORS = [
  "#8b5cf6", // Purple
  "#f97316",  // Orange
  "#ef4444", // Red
  "#3b82f6", // Blue  
  "#f59e0b", // Yellow
  "#06b6d4", // Cyan
  "#84cc16", // Lime,
];

export function ExpensePieChart({
  data,
  title = "Expense Categories",
  description = "Breakdown of your spending by category",
  height = "400px"
}: ExpensePieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  // Create chart config dynamically based on data
  const chartConfig = data.reduce((config, item, index) => {
    config[item.category.toLowerCase()] = {
      label: item.category,
      color: COLORS[index % COLORS.length]
    };
    return config;
  }, {} as any);

  // // Transform data for the chart (add colors)
  // const chartData = data.map((item, index) => ({
  //   ...item,
  //   fill: COLORS[index % COLORS.length]
  // }));

  const [activeCategory, setActiveCategory] = useState<string>("all")
  // Unique category names for dropdown
  const categoryOptions = useMemo(
    () => Array.from(new Set(data.map(d => d.category))),
    [data]
  )
  // Add color to each slice
  const chartData = data.map((item, i) => ({
    ...item,
    fill: COLORS[i % COLORS.length],
  }))

  // Filter to the selected category if chosen
  const filteredData =
    activeCategory === "all"
      ? chartData
      : chartData.filter(d => d.category === activeCategory)


  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
  // const [activeMonth, setActiveMonth] = useState(desktopData[0].month)


  return (
    <section className="w-fit max-md:px-0">
      <Card className={`flex flex-col max-w-md w-sm gap-3 mx-auto overflow-hidden`} style={{ height }}>
        <CardHeader className="flex flex-row items-center justify-between">
          {/* <CardTitle className="max-md:text-center">{title}</CardTitle> */}
          <CardDescription>{description}</CardDescription>
          <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
          {/* Dynamic dropdown */}
          <Select
            value={activeCategory}
            onValueChange={val => setActiveCategory(val)}
          >
            <SelectTrigger className="h-8 w-[150px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categoryOptions.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        </CardHeader>
        <CardContent className="flex flex-1 justify-center pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[300px]"
          >

            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={filteredData}
                dataKey="amount"
                nameKey="category"
                innerRadius={60}
                strokeWidth={5}
                activeShape={(props: any) => {
                  const { outerRadius = 0 } = props
                  return (
                    <g>
                      <Sector {...props} outerRadius={outerRadius + 10} />
                      <Sector
                        {...props}
                        outerRadius={outerRadius + 25}
                        innerRadius={outerRadius + 12}
                      />
                    </g>
                  )
                }}
              >
                <Label
                  content={({ viewBox }) =>
                    viewBox && "cx" in viewBox && "cy" in viewBox ? (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {filteredData.reduce((s, d) => s + d.amount, 0)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 20}
                          className="fill-muted-foreground text-sm"
                        >
                          ₹ spent
                        </tspan>
                      </text>
                    ) : null
                  }
                />
              </Pie>
              <Legend />

            </PieChart>
          </ChartContainer>

          {/* Legend */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mt-2 w-full px-2">
            {chartData.map((item, index) => (
              <div key={item.category} className="">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm font-medium">{item.category}</span>
                <span className="text-sm text-muted-foreground ml-auto">
                  ₹{item.amount}
                </span>
              </div>
            ))}
          </div> */}
        </CardContent>
      </Card>
    </section>
  )
}