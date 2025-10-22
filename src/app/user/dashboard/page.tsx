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
import axios, { AxiosResponse } from "axios"

import { ArrowUpDown, Calendar, CalendarIcon, Edit, Eye, FileText, IndianRupee, MoreHorizontal, MoreVertical, Plus, SlidersHorizontal, Trash2 } from "lucide-react"
import { format, toZonedTime } from 'date-fns-tz'
import { ChartArea } from "../components/custom/Chart-Area"
import { Input } from "@/components/ui/input"
import { DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Form, FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import z, { number } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { add, formatDate } from "date-fns"
import { ExpensePieChart } from "../components/custom/Pie-Chart"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
const ExpenseSchema = z.object({
  title: z.string().min(1, {
    message: "Expense title is required"
  }),
  category: z.string().min(1, {
    message: "Please select a category 🙂!"
  }),
  note: z.string(),
  amount: z.string(),
  createdAt: z.string(),
});


export default function Page() {
  const timeZone = 'Asia/Kolkata';
  type Expense = {
    id: number,
    category: "",
    title: "",
    note: "",
    amount: "",
    createdAt: ""
  }

  // const expenseForm = useForm<z.infer<typeof ExpenseSchema>>({
  //   resolver: zodResolver(ExpenseSchema),
  //   defaultValues: {
  //     title: "",
  //     category: "",
  //     note: "",
  //     amount: "",
  //     createdAt:"",
  //   },
  // });
    const [expenseForm, setExpenseForm] = useState({
    
      title: "",
      category: "",
      note: "",
      amount: "",
    },)

  type CategoryData = { category: string; amount: number };
  type ChartData = { date: string; amount: number };

  interface DashboardDto {
    categoryData: CategoryData[];
    chartData: ChartData[];
    totalAmount: number;
    totalCategories: number;
    avgPerDay: number;
  }

  // Get user's
  const [expenses, setexpenses] = useState<Expense[]>([])
  const [viewMode, setViewMode] = useState('cards');
  const [open, setOpen] = React.useState<boolean>(false);

  // To get all data
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user/myExpenses", {
          withCredentials: true
        })
        const data = response.data;
        setexpenses(data)

      } catch (error) {
        console.log("Some error occured!!", error)
      }
    }
    getData();
  }, [])
  const [total, setTotal] = useState(0)
  // To get total amount!!!
  useEffect(() => {
    const getTotal = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user/getTotal", { withCredentials: true })
        const data = response.data;
        setTotal(data)
      } catch (error) {
        console.log("Some error occured!!", error)

      }
    }
    getTotal();
  }, [])

  // Delete Expense
  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/user/deleteExpense/${id}`, {
        data: { id },
        withCredentials: true
      });
      if (response.status === 200 || response.status === 201) {
        toast.success("Expense Deleted successfully!", {
          style: {
            "backgroundColor": "#D5F5E3",
            "color": "black",
            "border": "none"
          },
          duration: 1000
        });
        setexpenses(prev => prev.filter(expense => expense.id !== id));
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
  const [showModal, setShowModal] = useState(false);

  // To add new expense!
  const handleAdd = async () => {
    try {
      const response: AxiosResponse = await axios.post("http://localhost:8080/api/user/createExpense", expenseForm, { withCredentials: true });

      console.log("After adding the expense: - " + response.status)
      setOpen(false)
      if (response.status === 201 || response.status === 200) {
        toast.success("Expense Created Successfully!",
          {
            style: {
              "backgroundColor": "#D5F5E3",
              "color": "black",
              "border": "none"
            },
            duration: 1000
          });

        setTimeout(() => {
          window.location.reload()
        }, 500);
      }

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          toast.error(data.error || "Missing Expense fields!", {
            style: {
              "backgroundColor": "#FADBD8",
              "color": "black",
              "border": "none"
            },
            duration: 2500
          })
          setTimeout(() => {
            window.location.reload();
          }, 2500);
        }
        else {
          toast.error(data.error || "Internal server error", {
            style: {
              "backgroundColor": "#FADBD8",
              "color": "black",
              "border": "none"
            },
            duration: 2500
          });
          setTimeout(() => {
            window.location.reload();
          }, 2500);
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.", {
          invert: false,
          duration: 2500
        });
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      }
    }
  }

  // To fetch data based on dates!
  const [userChartData, setUserChartData] = useState([]);
  const [days, setDays] = useState("30");
  useEffect(() => {

    const fetchUserChartData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/expenses/dashboard?days=${days}`, { withCredentials: true })
        setUserChartData(
          (() => {
            const chart = response.data.chartData.map((d: any) => ({
              date: new Date(d.date).toISOString(),
              amount: Number(d.amount)
            }))

            // If less than 2 points, pad with a baseline
            if (chart.length === 1) {
              const firstDate = new Date(chart[0].date)
              // Add a baseline a day earlier (or start-of-period)
              const baselineDate = new Date(firstDate)
              baselineDate.setDate(baselineDate.getDate() - 1)

              chart.unshift({
                date: baselineDate.toISOString(),
                amount: 0
              })
            }

            if (chart.length === 0) {
              const today = new Date()
              const start = new Date()
              start.setDate(today.getDate() - Number(days) + 1)

              chart.push(
                { date: start.toISOString(), amount: 0 },
                { date: today.toISOString(), amount: 0 }
              )
            }

            return chart
          })()
        );
        console.log("Fetched Data", response.data)
      } catch (error) {
        console.error("Error fetching user chart data:", error);
      }
    }
    fetchUserChartData();
  }, [days])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  type CategoryStyle = {
    icon: string;
    color: string;
  };

  const categoryConfig: Record<string, CategoryStyle> = {
    Food: { icon: '🍔', color: 'bg-green-100 text-green-700 border-green-300' },
    Travel: { icon: '🚗', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    Rent: { icon: '🏠', color: 'bg-purple-100 text-purple-700 border-purple-300' },
    Shopping: { icon: '🛍️', color: 'bg-pink-100 text-pink-700 border-pink-300' },
    Entertainment: { icon: '🎬', color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
    Utilities: { icon: '💡', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    Healthcare: { icon: '💊', color: 'bg-red-100 text-red-700 border-red-300' },
    Education: { icon: '🎓', color: 'bg-orange-100 text-orange-700 border-orange-300' },
    Electronics: { icon: '💻', color: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
    default: { icon: '💰', color: 'bg-gray-100 text-gray-700 border-gray-300' }
  };

  const getCategoryStyle = (category: string) => {
    return categoryConfig[category] || categoryConfig.default;
  };
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user/expenses/category",
          { withCredentials: true })
        console.log(response.data)
        setCategoryData(response.data)
      } catch (error) {
        console.error("Error fetching categorical data:", error);

      }
    }
    fetchData();
  }, [])


  const handleEdit = (id: number) => {
    console.log('Edit expense:', id);
    // Add your edit logic here
  };

  const handleViewDetails = (id: number) => {
    console.log('View details:', id);
    // Add your view details logic here
  };







  const defaultCategories = Object.keys(categoryConfig).filter((cat) => cat !== "default")
  const [isOther, setIsOther] = useState(false)

  return (

    <div className="min-h-screen ">




      <main className="flex-1 w-fullflex-1 h-fit items-center justify-center max-md:px-[3.5vw]">



        <div className="grid gap-6 w-full md:grid-cols-3">
          {/* Area chart */}

          <div className="md:col-span-2">

            <ChartArea
              data={userChartData}
              days={days}
              setDays={setDays}              
              title="My Daily Expenses"
              description="Your spending pattern over time"
              color="var(--chart-2)"
            />
          </div>

          {/* Pie chart*/}
          <div className="md:col-span-1">
            <ExpensePieChart
              data={categoryData}
              title="Spending Categories"
              description="Where your money goes"
            />
          </div>
        </div>



        <div className="w-full h-full px-[2.5vw] flex flex-col items-center justify-center gap-2">

          <div className="w-full space-y-4 p-4">
            {/* Header with view toggle */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">My Expenses</h2>
                <p className="">Total: ₹{total.toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                >
                  Cards
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
              </div>
            </div>

            {/* Cards View */}
            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {expenses.map((expense) => {
                  const categoryStyle = getCategoryStyle(expense.category);
                  return (
                    <Card
                      key={expense.id}
                      className="hover:shadow-lg transition-shadow duration-200 border-l-4"
                      style={{ borderLeftColor: categoryStyle.color.split(' ')[1] }}
                    >
                      <CardContent className="p-4">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{categoryStyle.icon}</span>
                            <div>
                              <h3 className="font-semibold text-lg">{expense.title}</h3>
                              <Badge variant="outline" className={`${categoryStyle.color} border`}>
                                {expense.category}
                              </Badge>
                            </div>
                          </div>

                          {/* Actions Menu */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(expense.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(expense.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(expense.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Amount */}
                        <div className="flex items-center gap-1 mb-3">
                          <IndianRupee className="h-5 w-5 " />
                          <span className="text-2xl font-bold">
                            {expense.amount.toLocaleString()}
                          </span>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-2 text-sm  mb-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(expense.createdAt)}
                        </div>

                        {/* Note */}
                        {expense.note && (
                          <div className="flex items-start gap-2 text-sm p-2 rounded mt-2">
                            <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{expense.note}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Compact List View */}
            {viewMode === 'list' && (
              <div className="space-y-2">
                {expenses.map((expense) => {
                  const categoryStyle = getCategoryStyle(expense.category);
                  return (
                    <Card key={expense.id} className="hover:bg-gray-700 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <span className="text-2xl">{categoryStyle.icon}</span>
                            <div className="flex-1">
                              <h3 className="font-semibold">{expense.title}</h3>
                              <div className="flex items-center gap-2 text-sm ">
                                <Badge variant="outline" className={`${categoryStyle.color} border text-xs`}>
                                  {expense.category}
                                </Badge>
                                <span>•</span>
                                <span>{formatDate(expense.createdAt)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-xl font-bold">₹{expense.amount.toLocaleString()}</div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(expense.id)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(expense.id)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(expense.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {expenses.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💸</div>
                <h3 className="text-xl font-semibold mb-2">No expenses yet</h3>
                <p className="text-gray-600 mb-4">Start tracking your expenses by adding one!</p>
                <Button>Add Expense</Button>
              </div>
            )}

            {/* 3. FLOATING ACTION BUTTON (FAB) - Always visible */}
            <button
              onClick={() => setShowModal(true)}
              className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl hover:shadow-3xl transition-all hover:scale-110 z-50 flex items-center justify-center group"
              aria-label="Add expense"
            >
              <Plus className="h-7 w-7 group-hover:rotate-90 transition-transform duration-300" />

              <span className="absolute right-full mr-3 bg-gray-900 text-white text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Add Expense
              </span>
            </button>

            {/* 4. ADD EXPENSE MODAL */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Add New Expense</DialogTitle>
                  <DialogDescription>
                    Track your spending by adding expense details below
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                      <Input
                      value={expenseForm.amount}
                      onChange={(e)=>{setExpenseForm({...expenseForm, amount:e.target.value})}}
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        className="pl-8 text-lg"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={expenseForm.title}
                      onChange={(e)=>setExpenseForm({...expenseForm, title:e.target.value})}
                      placeholder="e.g., Groceries, Uber ride"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={expenseForm.category} 
                    onValueChange={(value)=>setExpenseForm({...expenseForm, category:value})}
                    >
                      <SelectTrigger className="w-full p-2 border rounded-md">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Food">🍔 Food</SelectItem>
                          <SelectItem value="Travel">🚗 Travel</SelectItem>
                          <SelectItem value="Shopping">🛍️ Shopping</SelectItem>
                          <SelectItem value="Entertainment">🎬 Entertainment</SelectItem>
                          <SelectItem value="Utilities">💡 Utilities</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note">Note (Optional)</Label>
                    <textarea
                      id="note"
                      value={expenseForm.note}
                      onChange={(e)=>{setExpenseForm({...expenseForm, note:e.target.value})}}
                      placeholder="Add any additional details..."
                      className="w-full p-2 border rounded-md min-h-[80px]"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={handleAdd}
                    >

                      Add Expense
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Keyboard Shortcut Hint */}
            <div className="fixed bottom-6 left-6 text-sm text-gray-500 hidden lg:block">
              Press <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl</kbd> + <kbd className="px-2 py-1 bg-gray-200 rounded">N</kbd> to add expense
            </div>
          </div>
        </div>

      </main>

    </div>

  )
}