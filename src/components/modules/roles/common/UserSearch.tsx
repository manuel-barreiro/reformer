"use client"
import React, { useState, useEffect, useCallback, useTransition } from "react"
import { User } from "@prisma/client"
import { debounce } from "lodash"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command"
import { searchUsers } from "@/actions/manual-payment"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

type UserSearchProps = {
  onSelectUser: (user: User | null) => void
  selectedUser: User | null
}

export function UserSearch({ onSelectUser, selectedUser }: UserSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

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
          setUsers([])
          setError("Error searching users")
        }
      })
    }, 300),
    []
  )

  useEffect(() => {
    setError(null)
    debouncedSearch(searchTerm)
  }, [searchTerm, debouncedSearch])

  const handleSelectUser = (user: User) => {
    onSelectUser(user)
    setSearchTerm("")
    setIsOpen(false)
  }

  const handleRemoveUser = () => {
    onSelectUser(null)
    setSearchTerm("")
  }

  return (
    <div className="relative border-rust/50 bg-pearlVariant font-semibold text-grey_pebble/60">
      {selectedUser ? (
        <div className="flex items-center justify-between rounded-md border border-rust p-2">
          <span className="font-marcellus">
            {selectedUser.name} {selectedUser.surname || ""} [
            {selectedUser.email}]
          </span>
          <Button variant="ghost" size="sm" onClick={handleRemoveUser}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Command className="rounded-lg border border-rust/50 bg-pearlVariant font-semibold text-grey_pebble/60 shadow-md">
          <CommandInput
            placeholder="Buscar usuario..."
            className="placeholder:!text-grey_pebble/60"
            value={searchTerm}
            onValueChange={(value) => {
              setSearchTerm(value || "")
              setIsOpen(true)
            }}
          />
          {isOpen && (
            <CommandList className="border-rust/50 bg-pearlVariant font-semibold text-grey_pebble/60">
              <CommandEmpty>
                {error
                  ? error
                  : isPending
                    ? "Buscando..."
                    : "No se encontraron usuarios."}
              </CommandEmpty>
              <CommandGroup>
                {users.map((user) => (
                  <CommandItem
                    className="cursor-pointer border-b border-rust/50 bg-pearlVariant font-semibold text-grey_pebble/70 hover:!bg-pearlVariant3 hover:!text-grey_pebble"
                    value={`${user.email}|${user.name}|${user.surname}`}
                    key={user.id}
                    onSelect={() => handleSelectUser(user)}
                  >
                    {user.name} {user.surname || ""} ({user.email})
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      )}
    </div>
  )
}
