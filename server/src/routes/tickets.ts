import { Request, Response } from 'express'
import { Server } from 'socket.io'
import { ticketsFactory } from '../data/tickets'
import { User } from '../types/user'


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ticketsPost = (io: Server) => (req: Request, res: Response) => {
  const user = res.locals.decoded.user as User

  // Admin cant take a ticket
  if(user.role === 'admin') {
    return res.status(400).send('Admin can not perform this action')
  }

  // Check if user already has a ticket
  const { name, phone } = user
  if(ticketsFactory.getActiveByPhone(phone)) {
    return res.status(409).send('User already has a ticket')
  }

  // Add ticket
  const ticket = ticketsFactory.add({ phone, name })

  // Broadcast change to clients
  // TODO: dont broadcast to this user.
  io.emit('tickets', { tickets: ticketsFactory.get() })
  console.log(ticket)
  return res.json({ 
    ticket
  })
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ticketsGet = (req: Request<{ id: string }>, res: Response) => {
  const { ticket } = ticketsFactory.getById(req.params.id)
  if(!ticket) {
    return res.status(404).send('not found')
  }

  return res.json(ticket)
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ticketsPutCancel = (io: Server) => (req: Request<{ id: string }>, res: Response) => {
  const { phone } = res.locals.decoded.user as User
  const { id } = req.params

  const { ticket, index } = ticketsFactory.getById(id)
  // Not found
  if (!ticket) {
    return res.status(404).end()
  }
  // Already canceled
  if(ticket.status === 'canceled') {
    return res.status(404).send('already canceled')
  }
  // Not the current users ticket
  if(ticket.phone !== phone) {
    return res.status(403).send('Forbidden')
  }

  ticketsFactory.update({
    ...ticket,
    status: 'canceled'
  })

  const tickets = ticketsFactory.get()

  // TODO: Base cases...
  // broadcast change to clients
  io.emit('tickets', { tickets })

  return res.json(ticket)
}
