import { Ticket } from "./ticket"
import { User } from "./user"

export type ResponseMain = {
  tickets: Ticket[]
  userTicket: Ticket
  user: User
}

export type ResponseAdd = {
  ticket: Ticket
}

export type ResponseTakeTicket = Ticket

export type ResponseLogin = {
  token: string
}

export type IOResponseTickets = {
  tickets: Ticket[]
}

export type ResponseAdminStatus = {
  tickets: Ticket[]
}

export type ResponseTicketsNext = {
  tickets: Ticket[]
}