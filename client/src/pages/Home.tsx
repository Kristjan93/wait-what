import { Box, Button, Clock, Heading, Spinner, Text, Tip } from 'grommet'
import { Clock as ClockIcon, Phone, Ticket as TicketIcon, Trash, User } from 'grommet-icons'
import React, { useRef, useState } from 'react'
import { __api__ } from '../constants/endpoint'
import { ContextAuthorized, useAppState } from '../providers/appProvider'
import { ResponseAdd } from '../types/responses'
import { jsxConditions } from '../utils/jsxConditions'

export const Home: React.FC = () => {
  const { state, dispatch } = useAppState() as ContextAuthorized
  
  const [handlingTakeTicket, setHandlingTakeTicket] = useState(false)
  const refHandlingTakeTicket = useRef(false) // Prevent button press spam
  const handleTicketTake = async () => {
    if(refHandlingTakeTicket.current) { return }
    refHandlingTakeTicket.current = true
    setHandlingTakeTicket(true)

    const response = await fetch(`${__api__}/tickets`, { 
      method: 'POST',
      credentials: 'include'
    })
    if(response.ok) {
      const {
        ticket
      } = await response.json() as ResponseAdd
      dispatch({ type: 'USER_TICKET', value: { userTicket: ticket } })
    }
    else {
      const text = await response.text()
      console.log(text)
    }

    refHandlingTakeTicket.current = false
    setHandlingTakeTicket(false)
  }

  const handleTicketCancel = async () => {
    if(!state.userTicket) { return }

    const { id } = state.userTicket
    const response = await fetch(`${__api__}/tickets/${id}/canceled`, {
      method: 'PUT',
      credentials: 'include'
    })
    if(response.ok) {
      // const json = await response.json()
      await response.json()
      dispatch({ type: 'USER_TICKET', value: { userTicket: undefined } })
    }
    else {
      // TODO
      console.error('error')
      console.log(response)
    }
  }

  const ticketsSorted = state.tickets.sort( (a,b) => a.queueNumber - b.queueNumber)

  return state.userTicket ? (
    <>
      <Box 
        pad="medium" 
        direction="row" 
        justify="center" 
        align="center" 
        style={{ position: 'relative' }}
        animation={['fadeIn', 'slideDown']}
      >
        <Button 
          margin="small"
          hoverIndicator="background"
          icon={<Trash size="large" />} 
          onClick={handleTicketCancel} 
          style={{ 
            position: 'absolute', 
            right: 0, 
            top: 0, 
            zIndex: 100, 
            borderRadius: '100%' 
          }}
        />

        <TicketIcon style={{ width: 'min(560px, 50vw)', height: '100%' }}  />
        <Box 
          height="100%" 
          width="100%" 
          style={{ position: 'absolute', background: 'rgba(255,255,255,0.4)' }} 
          round='large'
        />

        <Box 
          style={{ position: 'absolute' }} 
          gap="small"
          fill
          pad="medium"
          direction="row"
          align="center"
        >
          <Box flex gap="small">
            <Box 
              pad="small"
              round="small"
              elevation="small"
              background="rgba(255,255,255,0.8)"
            >
              <Heading margin="none">
                Ticket
              </Heading>
            </Box>

            <Box 
              pad="small"
              round="small"
              elevation="small"
              background="rgba(255,255,255,0.8)"
              direction="row"
              align="center"
              gap="small"
            >
              <User />
              <Text size="large">{state.user?.name}</Text>
            </Box>

            <Box 
              pad="small"
              round="small"
              elevation="small"
              background="rgba(255,255,255,0.8)"
              direction="row"
              align="center"
              gap="small"
            >
              <Phone />
              <Text size="large">{state.user?.phone}</Text>
            </Box>

            <Box 
              pad="small"
              round="small"
              elevation="small"
              background="rgba(255,255,255,0.8)"
              direction="row"
              align="center"
              gap="small"
            >
              <ClockIcon />
              <Clock 
                type="digital" 
                time={state.userTicket.createdAt.toString()} 
                run={false}
              />
            </Box>
          </Box>

          <Box flex justify="center" align="center">
            <Box background="brand" round="full" pad="medium">
              <Text size="6xl">#{state.userTicket.queueNumber}</Text>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box 
        direction="row"
        wrap
        gap="small"
        justify="start"
        width="large"
        pad={{ right: 'medium', left: 'medium' }}
      >
        {ticketsSorted.map((ticket, index) => (
          <Tip 
            key={ticket.id}
            content={ticket.status === 'canceled' 
              ? 'Canceled'
              : <Clock type="digital" run={false} time={ticket.createdAt.toString()} />
            }
          >
            <Box 
              round="full"
              justify="center"
              align="center"
              height="50px"
              width="50px"
              margin={{ bottom: 'small' }}
              background={jsxConditions([
                ticket.id === state.userTicket?.id && 'brand',
                ticket.status === 'canceled' && 'status-warning',
                'light-3',
              ])}
            >
              <Text>#{ticket.queueNumber}</Text>
            </Box>
          </Tip>
        ))}
      </Box>
    </>
    ) : (
    <Box 
      pad="medium" 
      direction="row" 
      animation={['fadeIn', 'slideUp']}
    >
      <Button
        primary 
        label="Get a ticket" 
        onClick={handleTicketTake}
        size="large"
        icon={handlingTakeTicket ? <Spinner /> : <TicketIcon />} 
      />
    </Box>
  )
}