"use client"

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  getSortedRowModel,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { PaginationControls } from "@/components/modules/roles/admin/usuarios/PaginationControls"
import { ArrowDown, ArrowUp } from "lucide-react"

interface ReusableTableProps<T extends object> {
  data: T[]
  columns: ColumnDef<T>[]
}

export function ReusableTable<T extends object>({
  data,
  columns,
}: ReusableTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  return (
    <div className="flex flex-col rounded-md border">
      <div className="relative w-full overflow-hidden">
        <ScrollArea className="h-[400px] w-full">
          <div className="min-w-full">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-pearlVariant3 font-dm_sans font-black text-midnight">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className={`whitespace-nowrap text-center font-dm_sans text-sm font-semibold text-midnight ${
                          header.column.getCanSort() ? "cursor-pointer" : ""
                        }`}
                        onClick={
                          header.column.getCanSort()
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                      >
                        {header.isPlaceholder ? null : (
                          <>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() ? (
                              header.column.getIsSorted() === "asc" ? (
                                <ArrowUp size={16} className="ml-1 inline" />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <ArrowDown size={16} className="ml-1 inline" />
                              ) : (
                                ""
                              )
                            ) : null}
                          </>
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
                        <TableCell
                          key={cell.id}
                          className="whitespace-nowrap text-center"
                        >
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
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="border-t border-grey_pebble/20 bg-pearlVariant3/50">
        <PaginationControls table={table} />
      </div>
    </div>
  )
}
