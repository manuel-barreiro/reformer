export interface Reservation {
  id: number
  activity: string
  description?: string
  date: string
  time: string
  isActive: boolean
}

export const mockReservations: Reservation[] = [
  {
    id: 1,
    activity: "YOGA",
    description: "Hatcha",
    date: "09/09/2024",
    time: "10:00",
    isActive: true,
  },
  {
    id: 2,
    activity: "PILATES",
    description: "Lower Body Burn",
    date: "09/09/2024",
    time: "11:00",
    isActive: true,
  },
  {
    id: 3,
    activity: "YOGA",
    description: "Vinyasa",
    date: "09/09/2024",
    time: "12:00",
    isActive: false,
  },
  {
    id: 4,
    activity: "PILATES",
    description: "Power Strength Core",
    date: "09/09/2024",
    time: "13:00",
    isActive: true,
  },
  {
    id: 5,
    activity: "YOGA",
    description: "Hatcha",
    date: "09/09/2024",
    time: "14:00",
    isActive: true,
  },
  {
    id: 6,
    activity: "PILATES",
    description: "Lower Body Burn",
    date: "09/09/2024",
    time: "15:00",
    isActive: true,
  },
  {
    id: 7,
    activity: "YOGA",
    description: "Vinyasa",
    date: "09/09/2024",
    time: "16:00",
    isActive: false,
  },
]
