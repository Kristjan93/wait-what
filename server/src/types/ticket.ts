export type TicketStatus = 'active' | 'done' | 'canceled'
export interface Ticket {
  id: string
  queueNumber: number
  createdAt: Date
  name: string
  phone: string
  status: TicketStatus
}