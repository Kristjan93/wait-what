import React, { createContext, useReducer } from "react"
import { Ticket } from "../types/ticket"
import { User } from "../types/user"

type Action =
  | { type: 'UNAUTHORIZED' }
  | {
    type: 'TICKETS'; 
    value: { tickets: Ticket[] }
  }
  | {
    type: 'USER_TICKET'; 
    value: { userTicket: Ticket | undefined }
  }
  | { type: 'STATE_UPDATE', value: StateAuthorized }

type Dispatch = (action: Action) => void

type StateAuthorized = {
  user: User
  tickets: Ticket[]
  userTicket?: Ticket
}

type StateUnauthorized = {
  user: undefined
  tickets?: never
  userTicket?: never
  queueStatus?: never
}

export type AppState = StateAuthorized | StateUnauthorized

export type Context = { state: AppState, dispatch: Dispatch }
const AppContext = createContext<Context | undefined>(undefined)

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'UNAUTHORIZED': {
      return { user: undefined }
    }
    case 'TICKETS': {
      return { ...state as StateAuthorized, ...action.value }
    }
    case 'USER_TICKET': {
      return { ...state as StateAuthorized, ...action.value }
    }
    case 'STATE_UPDATE': {
      return { ...state as StateAuthorized, ...action.value }
    }
    default:
      return state
    }
}


export const AppProvider: React.FC = ({ 
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, { user: undefined })

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export type ContextAuthorized = { state: StateAuthorized, dispatch: Dispatch }
export const useAppState = () => {
  const context = React.useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppState must be used within a AppProvider')
  }
  return context
}
