"use client"
import React, { useState, useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { createColumns } from "./columns"
import { PaginationControls } from "./PaginationControls"
import { User, Role } from "@prisma/client"

interface UsersTableProps {
  initialUsers: User[]
}

export function UsersTable({ initialUsers }: { initialUsers: User[] }) {
  const [globalFilter, setGlobalFilter] = useState("")
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all")

  const capitalizeAndSortUsers = (users: User[]) => {
    return users
      .map((user) => ({
        ...user,
        name:
          user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase(),
        surname: user.surname
          ? user.surname.charAt(0).toUpperCase() +
            user.surname.slice(1).toLowerCase()
          : user.surname,
      }))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  }

  const [data] = useState<User[]>(capitalizeAndSortUsers(initialUsers))

  const columns = useMemo(
    () => createColumns(roleFilter, setRoleFilter),
    [roleFilter]
  )

  const filteredData = useMemo(() => {
    return roleFilter === "all"
      ? data
      : data.filter((user) => user.role === roleFilter)
  }, [data, roleFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase()
      const user = row.original
      return (
        user.name.toLowerCase().includes(searchValue) ||
        (user.surname || "").toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue) ||
        (user.phone || "").toLowerCase().includes(searchValue)
      )
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
      sorting: [{ id: "name", desc: false }],
    },
  })

  return (
    <div className="h-auto min-h-[86dvh] w-full space-y-4 lg:min-h-0 lg:p-10">
      <div className="flex w-full flex-col items-start justify-between gap-3 lg:flex-row">
        <h2 className="font-marcellus text-2xl font-bold uppercase">
          Usuarios
        </h2>
        <div className="flex w-full items-center gap-2 lg:w-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full rounded-lg border border-rust/50 bg-pearlVariant pl-10 font-semibold text-grey_pebble/60 lg:w-80"
              placeholder="Buscar..."
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader className="sticky top-0 bg-pearlVariant3 font-dm_sans font-black text-midnight">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-center font-dm_sans text-sm font-semibold text-midnight"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="bg-pearlVariant text-sm text-tableContent">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b border-grey_pebble"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-center">
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
                    className="h-24 text-center"
                  >
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      <PaginationControls table={table} />
    </div>
  )
}
