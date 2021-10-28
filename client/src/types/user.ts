export type User = {
  role: 'user'
  phone: string
  name: string
} | {
  role: 'admin'
  phone?: never
  name?: never
}