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

// export interface ClassPackage {
//   id: string
//   name: string
//   description: string
//   classCount: number
//   price: number
//   duration: number
//   isActive: boolean
//   createdAt: Date
//   updatedAt: Date
// }

// export const mockClassPackages: ClassPackage[] = [
//   {
//     id: "ckv1q9z0a0000z0a0z0a0z0a1",
//     name: "X1 CLASE",
//     description: "X1 clase de yoga y/o pilates.",
//     classCount: 1,
//     price: 18000,
//     duration: 1,
//     isActive: true,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: "ckv1q9z0a0000z0a0z0a0z0a0",
//     name: "X4 CLASES",
//     description: "X4 clases combinables de yoga y/o pilates.",
//     classCount: 4,
//     price: 60000,
//     duration: 1,
//     isActive: true,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: "ckv1q9z0a0001z0a0z0a0z0a0",
//     name: "X8 CLASES",
//     description: "X8 clases combinables de yoga y/o pilates.",
//     classCount: 8,
//     price: 112000,
//     duration: 1,
//     isActive: true,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: "ckv1q9z0a0002z0a0z0a0z0a0",
//     name: "X12 CLASES",
//     description: "X12 clases combinables de yoga y/o pilates.",
//     classCount: 12,
//     price: 144000,
//     duration: 1,
//     isActive: true,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
// ]
