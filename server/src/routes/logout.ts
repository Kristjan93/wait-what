import { Request, Response } from 'express'


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const logout = (req: Request, res: Response) => {
  return res.clearCookie('jwt').send('logged out')
}
