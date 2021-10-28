import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../../types/user'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type VerifyToken = (req: Request, res: Response, next: NextFunction) => any
export const auth: VerifyToken = (req, res, next) => {
  if(!process.env.TOKEN_KEY) {
    throw new Error('missing process.env.TOKEN_KEY')
  }

  const token = req.cookies.jwt
  if (!token) {
    return res.status(401).send('Unauthorized')
  }

  try {
    res.locals.decoded = jwt.verify(token, process.env.TOKEN_KEY)
  }
  catch (err) {
    return res.status(401).send('Unauthorized')
  }
  return next()
}

export const adminAuth: VerifyToken = (req, res, next) => {
  if(!process.env.TOKEN_KEY) {
    throw new Error('missing process.env.TOKEN_KEY')
  }

  const token = req.cookies.jwt
  if (!token) {
    return res.status(401).send('Unauthorized')
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY)
    res.locals.decoded = decoded
    if(typeof decoded === 'string') {
      return res.status(401).send('Unauthorized')
    }
    if(decoded.user.role !== 'admin') {
      return res.status(403).send('Forbidden')
    }
  }
  catch (err) {
    return res.status(401).send('Unauthorized')
  }
  return next()
}