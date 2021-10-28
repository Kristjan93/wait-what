import { Ticket } from '../types/ticket'
import { v4 as uuidv4 } from 'uuid'
import { QueueStatus } from '../types/queue'

export const INITIAL_DATA_PASSWORD_ADMIN = 'admin'
export const INITIAL_DATA_QUEUE_STATUS:QueueStatus = { current: 1, next: 4 }
export const INITIAL_DATA_TICKETS: Ticket[] = [
  {
    id: uuidv4(),
    createdAt: new Date(),
    queueNumber: 1,
    name: 'Þorbergur Þorsteinsson',
    phone: '2222222',
    status: 'canceled'
  },
  {
    id: uuidv4(),
    createdAt: new Date(),
    queueNumber: 2,
    name: 'Kristján Patrekur Þorsteinsson',
    phone: '7777777',
    status: 'active'
  },
  {
    id: uuidv4(),
    createdAt: new Date(),
    queueNumber: 3,
    name: 'Sólillja Svava Þorsteinsdóttir',
    phone: '3333333',
    status: 'active'
  }
]