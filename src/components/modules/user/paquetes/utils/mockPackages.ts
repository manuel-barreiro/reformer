export interface Package {
  id: number
  classQuantity: number
  activity: string
  amount: number
  isActive: boolean
}

export const mockPackages: Package[] = [
  {
    id: 1,
    classQuantity: 4,
    activity: "YOGA",
    amount: 10000,
    isActive: true,
  },
  {
    id: 2,
    classQuantity: 8,
    activity: "PILATES",
    amount: 18000,
    isActive: true,
  },
  {
    id: 3,
    classQuantity: 12,
    activity: "YOGA",
    amount: 25000,
    isActive: false,
  },
  // Add more mock packages as needed
]
