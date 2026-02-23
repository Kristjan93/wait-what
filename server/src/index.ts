import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { ticketsFactory } from './data/tickets'
import { adminAuth, auth } from './middleware/express/auth'
import { adminLogin, base, login, logout } from './routes'
import { ticketsGet, ticketsPost, ticketsPutCancel } from './routes/tickets'
import { User } from './types/user'
import jwt from 'jsonwebtoken'

dotenv.config()

const origin = process.env.CORS_ORIGIN || 'http://localhost:5173'
const app = express()
app.use(cors({
  credentials: true,
  origin
}))
app.use(cookieParser())
app.use(express.json())

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin,
    methods: ['GET', 'POST'],
    credentials: true,
  }
})

// Express Admin
app.post('/admin/login', adminLogin)

app.post('/admin/tickets/next', adminAuth, (req, res) => {
  const next = ticketsFactory.getActiveNext()

  if(!next) {
    return res.status(400).send('no next ticket')
  }

  ticketsFactory.update({ ...next, status: 'done' })

  io.emit('tickets', { tickets: ticketsFactory.get() })
  return res.json({ tickets: ticketsFactory.get() })
})

app.post('/admin/tickets/:id/status', adminAuth, (req: express.Request<{ id: string }>, res) => {
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
app.post('/login', login)
app.get('/', auth, base)
app.get('/tickets/:id', auth, ticketsGet)
app.post('/logout', auth, logout)
app.post('/tickets', auth, ticketsPost(io))
app.put('/tickets/:id/canceled', auth, ticketsPutCancel(io))

io.use((socket, next) => {
  if(!process.env.TOKEN_KEY) {
    throw new Error('missing process.env.TOKEN_KEY')
  }

  const token = socket.handshake.auth.token
  if (!token) {
    return next(new Error('Unauthorized'))
  }

  try {
    socket.data.decoded = jwt.verify(token, process.env.TOKEN_KEY)
  }
  catch (err) {
    return next(new Error('Unauthorized'))
  }

  next()
})

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

  socket.on('disconnect', () => {
    // client disconnected
  })
})

const port = process.env.PORT || 4000
server.listen(port, () => {
  console.log(`wait-what is running on port: ${port}`)
})
