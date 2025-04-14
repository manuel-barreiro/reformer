import React, { useEffect } from "react"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react" // Import double chevrons

interface PaginationControlsProps {
  table: Table<any>
}

export function PaginationControls({ table }: PaginationControlsProps) {
  // Set default page size to 5 if it isn’t already set (matching table initial state)
  useEffect(() => {
    if (table.getState().pagination.pageSize !== 5) {
      // Check if initial page size needs setting, adjust if necessary
      // Or remove this useEffect if the table's initialState is sufficient
      // table.setPageSize(5); // Example: Set to 5 if needed
    }
  }, [table]) // Dependency array includes table

  return (
    // Adjusted padding and gap for better spacing
    <div className="flex flex-col items-center justify-between gap-4 px-2 py-4 text-midnight lg:flex-row lg:gap-0">
      {/* Rows per page and Page count - Grouped for better mobile layout */}
      <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center lg:w-auto lg:justify-start lg:gap-8">
        <div className="flex items-center space-x-2">
          <p className="whitespace-nowrap text-sm font-medium">
            Filas por página
          </p>
          <select
            className="border-input ring-offset-background focus-visible:ring-ring h-8 w-[70px] rounded-md border bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value))
            }}
          >
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-center text-sm font-medium">
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount() <= 0 ? 1 : table.getPageCount()}{" "}
          {/* Handle zero pages */}
        </div>
      </div>

      {/* Pagination Buttons */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex" // Kept hidden on mobile
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Ir a la primera página</span>
          <ChevronsLeft className="h-4 w-4" /> {/* Use double chevron icon */}
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Ir a la página anterior</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Ir a la página siguiente</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex" // Kept hidden on mobile
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Ir a la última página</span>
          <ChevronsRight className="h-4 w-4" /> {/* Use double chevron icon */}
        </Button>
      </div>
    </div>
  )
}
