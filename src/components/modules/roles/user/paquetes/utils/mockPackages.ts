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
  {
    id: 4,
    classQuantity: 6,
    activity: "YOGA",
    amount: 15000,
    isActive: true,
  },
  {
    id: 5,
    classQuantity: 10,
    activity: "PILATES",
    amount: 20000,
    isActive: false,
  },
  {
    id: 6,
    classQuantity: 15,
    activity: "YOGA",
    amount: 30000,
    isActive: false,
  },
  // {
  //   id: 7,
  //   classQuantity: 20,
  //   activity: "PILATES",
  //   amount: 35000,
  //   isActive: true,
  // },
  // {
  //   id: 8,
  //   classQuantity: 25,
  //   activity: "YOGA",
  //   amount: 40000,
  //   isActive: true,
  // },
  // {
  //   id: 9,
  //   classQuantity: 30,
  //   activity: "PILATES",
  //   amount: 45000,
  //   isActive: true,
  // },
  // {
  //   id: 10,
  //   classQuantity: 35,
  //   activity: "YOGA",
  //   amount: 50000,
  //   isActive: true,
  // },
  // {
  //   id: 11,
  //   classQuantity: 40,
  //   activity: "PILATES",
  //   amount: 55000,
  //   isActive: true,
  // },
  // {
  //   id: 12,
  //   classQuantity: 45,
  //   activity: "YOGA",
  //   amount: 60000,
  //   isActive: true,
  // },
  // {
  //   id: 13,
  //   classQuantity: 50,
  //   activity: "PILATES",
  //   amount: 65000,
  //   isActive: true,
  // },
  // Add more mock packages as needed
]
