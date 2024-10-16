import { User } from "@prisma/client"

export const getFullName = (user: User) => {
  return user.surname ? `${user.name} ${user.surname}` : user.name
}
