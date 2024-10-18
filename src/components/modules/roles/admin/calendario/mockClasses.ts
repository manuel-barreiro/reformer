export enum ClassCategory {
  YOGA = "YOGA",
  PILATES = "PILATES",
}

export enum ClassType {
  VINYASA = "VINYASA",
  HATHA = "HATHA",
  BALANCE = "BALANCE",
  STRENGTH_CORE = "STRENGTH_CORE",
  LOWER_BODY = "LOWER_BODY",
  FULL_BODY = "FULL_BODY",
}

export interface Class {
  id: string
  category: ClassCategory
  type: ClassType
  date: Date
  startTime: Date
  endTime: Date
  instructor: string
  maxCapacity: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  bookings: Booking[]
}

export interface Booking {
  id: string
  classId: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export const mockClasses: Class[] = [
  {
    id: "1",
    category: ClassCategory.YOGA,
    type: ClassType.VINYASA,
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    instructor: "John Doe",
    maxCapacity: 20,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    bookings: [],
  },
  {
    id: "2",
    category: ClassCategory.PILATES,
    type: ClassType.STRENGTH_CORE,
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    instructor: "Jane Smith",
    maxCapacity: 15,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    bookings: [],
  },
]
