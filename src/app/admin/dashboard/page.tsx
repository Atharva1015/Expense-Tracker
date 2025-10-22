"use client"
import * as React from "react"
import { useState, useEffect } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
  TableCaption,
} from "@/components/ui/table"
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Users } from "lucide-react"
import { ArrowUpDown, CalendarIcon, MoreHorizontal, SlidersHorizontal } from "lucide-react"
import { format, toZonedTime } from 'date-fns-tz'
import { headers } from "next/headers"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { ChartArea } from "../components/custom/Chart-Area"
import { ExpensePieChart } from "@/app/user/components/custom/Pie-Chart"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"




export default function Page() {
  const timeZone = 'Asia/Kolkata';
  type User = {
    id: number,
    name: "",
    email: ""
  }
  interface AdminDashboardResponse {
    totalExpensesChart: ExpenseChartData[],
    totalCategoriesChart: ExpenseCategoryData[];
    userExpenseSummary: UserExpenseSummary[];
    grandTotalAmount: number;
    totalUsers: number;
    totalCategories: number;
    avgPerDay: number;

  }

  interface ExpenseChartData {
    date: string;
    amount: number;
  }
  interface ExpenseCategoryData {
    category: string;
    amount: number;
  }

  interface UserExpenseSummary {
    username: string;
    name: string;
    totalAmount: number;
    totalExpenses: number;
    categoriesUsed: number;
  }

  // Get user's
  const [users, setUsers] = useState<User[]>([])
  useEffect(() => {
    const getData = async () => {
      try {

        const response = await axios.get("http://localhost:8080/api/admin/users", {
          withCredentials: true
        });


        const data = response.data;
        setUsers(data)
        console.log("Here: - " + data)


      } catch (error) {
        console.log("Some error occured!!", error)
      }
    }
    getData();
  }, [])

  // Delete Users
  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/admin/delete/${id}`, {
        data: { id },
        withCredentials: true
      });
      if (response.status === 200 || response.status === 201) {
        toast.success("User Deleted successfully!", {
          style: {
            "backgroundColor": "#D5F5E3",
            "color": "black",
            "border": "none"
          },
          duration: 1000
        });
        setUsers(prev => prev.filter(user => user.id !== id));
      }

    } catch (error) {
      toast.error("Some error occured!", {
        style: {
          "backgroundColor": "#c1121f",
          "color": "black",
          "border": "none"
        },
        duration: 1500
      });
      console.log("Error occured while deleting an admin!!", error)
    }

  }

  const [userChartData, setUserChartData] = useState([]);
  const [adminDashboardData, setAdminDashboardData] = useState<AdminDashboardResponse>();
  const [days, setDays] = useState("30");
  const [selectedRange, setSelectedRange] = useState("30");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchUserChartData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/admin/expenses/dashboard?days=${days}`, { withCredentials: true })

        console.log("Admin API response:", response.data);
        setAdminDashboardData(response.data);

      } catch (error) {
        console.error("Error fetching user chart data:", error);
      }
    }
    fetchUserChartData();
  }, [days])

  const columns: ColumnDef<User>[] = [

    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <div className="w-fit">
            <Button className="w-fit text-center" variant={'ghost'}
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >ID
              <ArrowUpDown />

            </Button>
          </div>
        )
      }
    },
    {
      accessorKey: "name",
      header: () => <div>Name</div>,
      cell: ({ row }) => <div>{row.getValue("name")}</div>
    },
    {
      accessorKey: "email",
      header: () => <div>Email</div>,
      cell: ({ row }) => <div>{row.getValue("email")}</div>
    },
    {
      accessorKey: "role",
      header: () => <div>Role</div>,
      cell: ({ row }) => <div>{row.getValue("role")}</div>
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <div className="w-fit text-center">
            <Button className="w-fit"
              variant={'ghost'}
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >createdAt</Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const rawDate = row.getValue("date") as string | number | Date;

        const dateObj = new Date(rawDate);
        const isValidDate = dateObj instanceof Date && !isNaN(dateObj.getTime());

        if (!isValidDate) {
          console.warn("Invalid date found:", rawDate, "Row:", row.original);
          return <div className="font-medium text-center">N/A</div>;
        }

        const dateCreated = toZonedTime(dateObj, timeZone);
        const formattedDate = format(dateCreated, "yyyy-MM-dd", { timeZone });
        return <div className="font-medium text-center">{formattedDate}</div>;
      }
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const row_data = row.original;

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:cursor-pointer">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />



                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-red-600 cursor-pointer"
                  onClick={() => handleDelete(row_data.id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>



          </>
        );
      },
    }

  ];

  const chartData = adminDashboardData?.totalExpensesChart || [];

  const transformedChartData = chartData.map(item => ({
    date: item.date,
    amount: item.amount,
    formattedDate: item.date  // Add the optional formattedDate field
  }));

  if (transformedChartData.length == 1) {
    const firstDate = new Date(transformedChartData[0].date)
    const baselineDate = new Date(firstDate)
    baselineDate.setDate(baselineDate.getDate() - 1)

    transformedChartData.unshift({
      date: baselineDate.toISOString(),
      amount: 0,
      formattedDate: baselineDate.toISOString()
    })

  }

  const piechartData = adminDashboardData?.totalCategoriesChart || [];


  console.log("Transformed Data: - " + adminDashboardData?.totalCategoriesChart)
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });







  return (
    <main className="flex-1 w-fullflex-1 h-fit items-center justify-center max-md:px-[3.5vw]">
      <div className="grid gap-6 w-full md:grid-cols-3">
        {/* Area chart: take 2/3 width on md+ */}
        <div className="md:col-span-2">
          <ChartArea
            data={transformedChartData}
            days={days}
            setDays={setDays}
            color="hsl(142, 76%, 36%)" />
        </div>
        <ExpensePieChart
          data={piechartData}  // This is adminDashboardData.totalCategoriesChart
          title={`Platform Categories - Last ${selectedRange} Days`}
          description="Where all users' money went"
        />

        {/* Summary Cards */}
        

        {/* Pie chart: 1/3 width on md+ */}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-start items-start w-full max-w-6xl ml-7 mt-2  px-4">          
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-red-500 font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{adminDashboardData?.grandTotalAmount?.toLocaleString()}
            </div>
          </CardContent>
        </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-500 font-medium">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-orange-400 font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {adminDashboardData?.totalCategories}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 font-medium">Avg per Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{Math.round(adminDashboardData?.avgPerDay || 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
      <div className="w-full h-full px-[2.5vw] mt-2 flex flex-col items-center justify-center gap-2">
        <Table>
          <TableCaption>List of userssss!!</TableCaption>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}

          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 p-2 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  )
}