export type Package = {
  id: number
  activity: string
  classQuantity: number
  purchaseDate: string
  amount: number
}

export const mockPackages = [
  {
    id: 1,
    activity: "PILATES",
    classQuantity: 4,
    purchaseDate: "2021-09-01",
    amount: 48000,
  },
  {
    id: 2,
    activity: "YOGA",
    classQuantity: 4,
    purchaseDate: "2021-09-01",
    amount: 48000,
  },
]
