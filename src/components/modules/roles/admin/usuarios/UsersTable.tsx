"use client"
import React, { useState, useCallback, useMemo } from "react"
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
import { User, Role, PurchasedPackage } from "@prisma/client"
import { UserDetailModal } from "./UserDetailModal"
import {
  updatePackage,
  getUserPackages,
  updateUser,
  UpdatePackageInput,
} from "@/actions/users"
import { PackagesModal } from "./PackagesModal"

interface UsersTableProps {
  initialUsers: User[]
}

interface ExtendedPurchasedPackage extends PurchasedPackage {
  classPackage: {
    name: string
    classCount: number
    durationMonths: number
  }
  payment: {
    total: number
    status: string
    dateCreated: Date
  } | null
}

export function UsersTable({ initialUsers }: { initialUsers: User[] }) {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [globalFilter, setGlobalFilter] = useState("")
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all")
  const [isPackagesModalOpen, setIsPackagesModalOpen] = useState(false)
  const [selectedUserPackages, setSelectedUserPackages] = useState<
    ExtendedPurchasedPackage[]
  >([])

  // Capitalize and sort users by name initially
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
      .sort((a, b) => {
        const nameA = `${a.name} ${a.surname || ""}`.trim().toLowerCase()
        const nameB = `${b.name} ${b.surname || ""}`.trim().toLowerCase()
        return nameA.localeCompare(nameB)
      })
  }

  const [data, setData] = useState<User[]>(capitalizeAndSortUsers(initialUsers))

  const handleOpenPackagesModal = useCallback(async (user: User) => {
    // Fetch user's packages with classPackage info
    const packages = await getUserPackages(user.id)
    setSelectedUser(user)
    setSelectedUserPackages(packages)
    setIsPackagesModalOpen(true)
  }, [])

  const handleOpenDetailModal = useCallback((user: User) => {
    setSelectedUser(user)
    setIsDetailModalOpen(true)
  }, [])

  const columns = useMemo(
    () =>
      createColumns(
        handleOpenDetailModal,
        handleOpenPackagesModal, // Add this
        roleFilter,
        setRoleFilter
      ),
    [handleOpenDetailModal, handleOpenPackagesModal, roleFilter]
  )

  const handleUpdatePackage = async (
    packageId: string,
    packageData: UpdatePackageInput
  ) => {
    try {
      const updatedPackage = await updatePackage(packageId, packageData)
      setSelectedUserPackages((prev) =>
        prev.map((pkg) =>
          pkg.id === packageId ? { ...pkg, ...updatedPackage } : pkg
        )
      )
    } catch (error) {
      console.error("Failed to update package:", error)
      throw error
    }
  }

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
      sorting: [{ id: "name", desc: false }], // Add default sorting
    },
  })

  const handleUpdateUser = async (userId: string, userData: Partial<User>) => {
    try {
      const capitalizedData = {
        ...userData,
        name: userData.name
          ? userData.name.charAt(0).toUpperCase() +
            userData.name.slice(1).toLowerCase()
          : userData.name,
        surname: userData.surname
          ? userData.surname.charAt(0).toUpperCase() +
            userData.surname.slice(1).toLowerCase()
          : userData.surname,
      }

      const updatedUser = await updateUser(userId, {
        name: capitalizedData.name!,
        role: userData.role!,
        surname: capitalizedData.surname,
        phone: userData.phone,
      })

      setData((prevData) => {
        const newData = prevData.map((user) =>
          user.id === userId ? { ...user, ...updatedUser } : user
        )
        return capitalizeAndSortUsers(newData)
      })
      setIsDetailModalOpen(false)
    } catch (error) {
      console.error("Failed to update user:", error)
      throw error
    }
  }

  return (
    <div className="h-auto min-h-[86dvh] w-full space-y-4 lg:min-h-0 lg:pl-10">
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
              className="w-full rounded-lg border border-rust/50 bg-pearlVariant pl-10 font-semibold text-grey_pebble/60 shadow-md lg:w-80"
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
      {selectedUser && (
        <>
          <UserDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            user={selectedUser}
            onUpdateUser={handleUpdateUser}
          />
          <PackagesModal
            isOpen={isPackagesModalOpen}
            onClose={() => setIsPackagesModalOpen(false)}
            user={selectedUser}
            packages={selectedUserPackages}
            onUpdatePackage={handleUpdatePackage}
          />
        </>
      )}
    </div>
  )
}
