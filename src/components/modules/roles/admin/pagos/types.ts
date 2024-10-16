export interface Payment {
  id: string
  paymentId: string
  packageType: string
  dateCreated: Date
  dateLastUpdated: Date
  moneyReleaseDate?: Date
  description?: string
  total: number
  status: string
  statusDetail?: string
  paymentTypeId: string
  userId: string
  user: {
    name: string
  }
  createdAt: Date
  updatedAt: Date
}
