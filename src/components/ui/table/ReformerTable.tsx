"use client"

import React, { useState, useMemo } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { PaginationControls } from "./PaginationControls" // Assuming PaginationControls is in the same directory
import { Skeleton } from "@/components/ui/skeleton"
import { Search } from "lucide-react"

interface ReformerTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  // Change the type to accept any string array, allowing for dot notation paths
  filterKeys: string[]
  searchPlaceholder?: string
  isLoading?: boolean
  noResultsMessage?: string
  children?: React.ReactNode
  initialPageSize?: number
}

export function ReformerTable<TData, TValue>({
  columns,
  data,
  filterKeys, // Type is now string[]
  searchPlaceholder = "Buscar...",
  isLoading = false,
  noResultsMessage = "No se encontraron resultados.",
  children,
  initialPageSize = 10, // Default to 10 if not provided
}: ReformerTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")

  // Determine if the search bar should be shown
  const showSearchBar = filterKeys && filterKeys.length > 0

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      // Only filter if search bar is active and has value
      if (!showSearchBar || !filterValue) return true
      const search = filterValue.toLowerCase()
      // Now iterates over string[] filterKeys
      return filterKeys.some((key) => {
        let value = row.original as any
        const keys = String(key).split(".") // Split potential dot notation
        try {
          // Add try-catch for safety when accessing nested props
          for (const k of keys) {
            if (value === null || typeof value === "undefined") {
              value = null
              break
            }
            value = value[k]
          }
          return String(value).toLowerCase().includes(search)
        } catch (e) {
          // Handle cases where intermediate keys might not exist
          console.warn(`Error accessing key ${key} during filtering:`, e)
          return false
        }
      })
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
  })

  // ... rest of the component remains the same ...
  return (
    <div className="w-full space-y-4">
      {/* ... header section with children and search input ... */}
      <div className="flex w-full flex-col items-start justify-between gap-3 lg:flex-row">
        {children && <div className="w-full flex-grow">{children}</div>}
        {/* Conditionally render search bar */}
        {showSearchBar && (
          <div className="flex w-full items-center gap-2 lg:w-auto lg:flex-shrink-0">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full rounded-lg border border-rust/50 bg-pearlVariant pl-10 font-semibold text-grey_pebble/60 lg:w-80"
                placeholder={searchPlaceholder}
              />
            </div>
          </div>
        )}
      </div>

      {/* Table Area */}
      <div className="relative grid h-[55vh] w-full min-w-full grid-cols-1 overflow-auto rounded-md">
        <Table>
          {/* ... TableHeader ... */}
          <TableHeader className="sticky top-0 z-10 bg-pearlVariant3 font-dm_sans font-black text-midnight">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`px-3 py-2 text-center font-dm_sans text-xs font-semibold uppercase tracking-wider text-midnight ${
                      header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : ""
                    }`}
                    style={{ whiteSpace: "nowrap" }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {{
                      asc: " ▲",
                      desc: " ▼",
                    }[header.column.getIsSorted() as string] ?? null}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          {/* ... TableBody ... */}
          <TableBody className="bg-pearlVariant text-sm text-tableContent">
            {isLoading ? (
              Array.from({ length: initialPageSize }).map((_, index) => (
                <TableRow
                  key={`skeleton-${index}`}
                  className="border-b border-grey_pebble/20"
                >
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={`skeleton-cell-${index}-${colIndex}`}
                      className="p-3 text-center"
                    >
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-grey_pebble/20 hover:bg-pearlVariant3/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="p-3 text-center"
                      style={{ whiteSpace: "nowrap" }}
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
                  {noResultsMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && data.length > 0 && (
        <div className="border-t border-grey_pebble/20 bg-pearlVariant3/50">
          <PaginationControls table={table} />
        </div>
      )}
    </div>
  )
}
