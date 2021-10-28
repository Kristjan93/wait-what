import { Box, Tip, Clock, Text, List, Menu, Button } from 'grommet'
import { More } from 'grommet-icons'
import React from 'react'
import { __api__ } from '../constants/endpoint'
import { ContextAuthorized, useAppState } from '../providers/appProvider'
import { ResponseAdminStatus, ResponseTicketsNext } from '../types/responses'
import { TicketStatus } from '../types/ticket'
import { jsxConditions } from '../utils/jsxConditions'

export const AdminControls: React.FC = () => {
  const { state, dispatch } = useAppState() as ContextAuthorized

  const handleChangeStatus = async (id: string, status: TicketStatus) => {
    const response = await fetch(`${__api__}/admin/tickets/${id}/status`, { 
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    })
    if(response.ok) {
      const { tickets } = await response.json() as ResponseAdminStatus
      dispatch({ type: 'TICKETS', value: { tickets } })
    }
    else {
      console.error('error')
      console.log(response)
      // TODO: handle error
    }
  }

  const handleNext = async () => {
    const response = await fetch(`${__api__}/admin/tickets/next`, { 
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    if(response.ok) {
      const { tickets } = await response.json() as ResponseTicketsNext
      dispatch({ type: 'TICKETS', value: { tickets } })
    }
    else {
      console.error('error')
      console.log(response)
      // TODO: handle error
    }
  }

  const ticketsSorted = state.tickets.sort( (a,b) => a.queueNumber - b.queueNumber)

  return (
    <Box 
        direction="row"
        wrap
        gap="small"
        justify="start"
        width="large"
        pad={{ right: 'medium', left: 'medium' }}
      >
        <Box fill="horizontal" pad={{ bottom: 'medium' }}>
          <Button secondary label="Next!" onClick={handleNext} />
        </Box>

        <Box fill="horizontal">
          <List
            primaryKey={(item) => <Text key={`p-${item.id}`}>{item.queueNumber} : {item.name}</Text>}
            secondaryKey={(item) => <Text key={`s-${item.id}`}>{item.phone} - {item.status}</Text>}
            data={state.tickets}
            action={(item, index) => (
              <Menu
                key={item.id}
                icon={<More />}
                hoverIndicator
                items={[
                  { label: 'done', onClick: () => handleChangeStatus(item.id, 'done') },
                  { label: 'canceled', onClick: () => handleChangeStatus(item.id, 'canceled') },
                  { label: 'active', onClick: () => handleChangeStatus(item.id, 'active') },
                ]}
              />
            )}
          />
        </Box>

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
  )
}