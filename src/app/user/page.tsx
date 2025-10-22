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


export default function Page() {
    const timeZone = 'Asia/Kolkata';
    type User = {
        id: null,
        name: "",
        email: ""
    }
    // Get user's
    const [users, setUsers] = useState<User[]>([])
    useEffect(() => {
        const getData = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                const response = await axios.get('http://localhost:8080/api/admin/users', {
  withCredentials: true
});
                const data = response.data;
                setUsers(data)

            } catch (error) {
                console.log("Some error occured!!", error)
            }
        }
        getData();
    }, [])

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
            header: () => { <div>Name</div> },
            cell: ({ row }) => <div>{row.getValue("name")}</div>
        },
        {
            accessorKey: "email",
            header: () => <div>Email</div>,
            cell: ({ row }) => <div>{row.getValue("email")}</div>
        },
        {
            accessorKey: "createdAt",
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
                const rawDate = row.getValue("createdAt") as string | number | Date;
                console.log("Raw createdAt:", rawDate);

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
        }

    ];



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

            <div className="w-full h-full px-[2.5vw] flex flex-col items-center justify-center gap-2">
                <Table>
                    <TableCaption>List of users!!</TableCaption>
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