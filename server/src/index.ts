// import { createAdapter } from '@socket.io/redis-adapter'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
// import { createClient } from 'redis'
import { Server } from 'socket.io'
import { ticketsFactory } from './data/tickets'
import { adminAuth, auth } from './middleware/express/auth'
import { auth as authIO } from './middleware/socketIO/auth'
import { adminLogin, base, login, logout } from './routes'
import { ticketsGet, ticketsPost, ticketsPutCancel } from './routes/tickets'
import { User } from './types/user'

dotenv.config()

const app = express()
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}))
app.use(cookieParser())
app.use(express.json())

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
})

// const pubClient = createClient({ host: 'localhost', port: 6379 })
// const subClient = pubClient.duplicate()
// io.adapter(createAdapter(pubClient, subClient))

// Express Admin
app.get('/me', (req, res) => {
  return res.send('Kristjan')
})
app.post('/admin/login', adminLogin)

app.post('/admin/tickets/next', adminAuth, (req, res) => {
  const next = ticketsFactory.getActiveNext()

  if(!next) {
    return res.status(400).send('no next ticket')
  }

  const updated = ticketsFactory.update({ ...next, status: 'done' })
  
  io.emit('tickets', { tickets: ticketsFactory.get() })
  return res.json({ tickets: ticketsFactory.get() })
})

app.post('/admin/tickets/:id/status', adminAuth, (req, res) => {
  const { id } = req.params
  const { status } = req.body
  if(
    status !== 'active' 
    && status !== 'done' 
    && status !== 'canceled'
  ) {
    return res.status(400).send('invalid status')
  }

  const { ticket } = ticketsFactory.getById(id)

  ticketsFactory.update({
    ...ticket,
    status,
  })

  io.emit('tickets', { tickets: ticketsFactory.get() })

  return res.json({ tickets: ticketsFactory.get() })
})

// Express User
app.get('/', auth, base)
app.get('/tickets/:id', ticketsGet)
app.post('/logout', auth, logout)
app.post('/login', login)
app.post('/tickets', auth, ticketsPost(io))
/**
 * Marks a ticket as canceled
 * @returns the deleted ticket
 */
app.put('/tickets/:id/canceled', auth, ticketsPutCancel(io))


io.use(authIO) // auth middleware
io.on('connection', (socket) => {
  const user = socket.data.decoded.user as User
  const userTicket = ticketsFactory.getActiveByPhone(user.phone as string)
  const tickets = ticketsFactory.get()
  const response = {
    tickets,
    userTicket,
    user,
  }
  socket.emit('initialize', response)
})

io.on('disconnect', () => {
  console.log('socket.io connection disconnected')
})


const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`wait-what is running now running on port: ${port}`)
})
