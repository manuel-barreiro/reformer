import React, { useState, useEffect, useCallback, useTransition } from "react"
import { User } from "@prisma/client"
import { debounce } from "lodash"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { searchUsers } from "@/actions/manual-payment"

type UserSearchProps = {
  onSelectUser: (user: User) => void
}

export function UserSearch({ onSelectUser }: UserSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [isPending, startTransition] = useTransition()

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (term.length < 2) {
        setUsers([])
        return
      }

      startTransition(async () => {
        try {
          const searchResults = await searchUsers(term)
          setUsers(searchResults)
        } catch (error) {
          console.error("Error searching users:", error)
        }
      })
    }, 300),
    []
  )

  useEffect(() => {
    debouncedSearch(searchTerm)
  }, [searchTerm, debouncedSearch])

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput
        placeholder="Buscar usuario..."
        value={searchTerm}
        onValueChange={setSearchTerm}
      />
      <CommandEmpty>
        {isPending ? "Buscando..." : "No se encontraron usuarios."}
      </CommandEmpty>
      <CommandGroup>
        {users.map((user) => (
          <CommandItem
            key={user.id}
            onSelect={() => {
              onSelectUser(user)
              setSearchTerm("")
            }}
          >
            {user.name} {user.surname} ({user.email})
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  )
}
