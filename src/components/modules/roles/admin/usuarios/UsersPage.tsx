"use client"

import React, { useState, useMemo } from "react"
import { User, Role } from "@prisma/client"
import { createColumns } from "./columns"
import { ReformerTable } from "@/components/ui/table/ReformerTable"

interface UsersPageProps {
  initialUsers: User[]
}

export function UsersPage({ initialUsers }: UsersPageProps) {
  // Corrected prop type usage
  // Role filter state remains, as it's custom logic for this table
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all")
  // Global filter state is now handled internally by ReformerTable

  // Data processing remains the same
  const capitalizeAndSortUsers = (users: User[]) => {
    return users
      .map((user) => ({
        ...user,
        name: user.name
          ? user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase()
          : "", // Handle potential null/undefined name
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

  // Keep the processed data state
  const [processedData] = useState<User[]>(capitalizeAndSortUsers(initialUsers))

  // Columns definition remains the same, passing role filter state
  const columns = useMemo(
    () => createColumns(roleFilter, setRoleFilter),
    [roleFilter]
  )

  // Data filtering based on role remains the same
  const filteredData = useMemo(() => {
    return roleFilter === "all"
      ? processedData
      : processedData.filter((user) => user.role === roleFilter)
  }, [processedData, roleFilter])

  // Remove useReactTable hook call, ReformerTable handles it

  // Define the keys for the global search filter in ReformerTable
  const filterKeys: string[] = ["name", "surname", "email"]

  return (
    <>
      <ReformerTable
        columns={columns}
        data={filteredData} // Pass the role-filtered data
        filterKeys={filterKeys} // Pass the keys for global search
        searchPlaceholder="Buscar por nombre, apellido, email..."
        noResultsMessage="No se encontraron usuarios."
        initialPageSize={10} // Set desired initial page size
      >
        {/* Children: Title */}
        {/* Search input is now inside ReformerTable */}
        <h2 className="font-marcellus text-2xl font-bold uppercase">
          Usuarios
        </h2>
      </ReformerTable>
      {/* PaginationControls are now rendered inside ReformerTable */}
    </>
  )
}
