export type TicketStatus = 'active' | 'done' | 'canceled'

export type Ticket = {
  id: string
  queueNumber: number
  createdAt: Date
  name: string
  phone: string
  status: TicketStatus
}

export interface TicketResponse {
  user_ticket: Ticket
  tickets: Ticket[]
}