import { Socket, Server } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'

type Auth = (socket: Socket, next: (err?: ExtendedError) => void) => void
export const auth:Auth = (socket, next) => {
  if(!process.env.TOKEN_KEY) {
    console.error('missing process.env.TOKEN_KEY')
    throw new Error('missing process.env.TOKEN_KEY')
  }

  const { jwt: token } = cookie.parse(socket.request.headers.cookie || '')
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
}