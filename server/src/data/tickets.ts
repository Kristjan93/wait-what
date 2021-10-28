import { Ticket } from '../types/ticket'
import { v4 as uuidv4 } from 'uuid'

type TicketCreate = Omit<Ticket, 
| 'id' 
| 'createdAt' 
| 'queueNumber' 
| 'status'
>

const create = (initTickets: Ticket[]) => {
  let _tickets = initTickets

  const current = () => {
    if(_tickets.length === 0) { return 0 }
    return _tickets[_tickets.length - 1].queueNumber
  }

  return {
    get: () => _tickets,
    getActiveByPhone: (phone: string) => {
      const index = _tickets.findIndex(ticket => ticket.phone === phone && ticket.status === 'active')
      return _tickets[index]
    },
    getById: (id: string) => {
      const index = _tickets.findIndex(ticket => ticket.id === id)
      return { ticket: _tickets[index], index }
    },
    getActiveNext: () => {
      const next = _tickets.filter(t => t.status === 'active')[0]
      return next
    },
    add: (ticket: TicketCreate) => {
      const { name, phone } = ticket
      const newTicket: Ticket = {
        phone,
        name,
        id: uuidv4(),
        createdAt: new Date(),
        queueNumber: current() + 1,
        status: 'active',
      }
      _tickets.push(newTicket)
      return newTicket
    },
    update: (updated: Ticket) => {
      const index = _tickets.findIndex(t => t.id === updated.id)
      _tickets = [
        ..._tickets.slice(0, index),
        updated,
        ..._tickets.slice(index + 1)
      ]
      return updated
    }
  }
}

export const ticketsFactory = create([])