import { Box, Tip, Clock, Text, List, Menu, Button } from 'grommet'
import { More } from 'grommet-icons'
import React, { useState } from 'react'
import { __api__ } from '../constants/endpoint'
import { ContextAuthorized, useAppState } from '../providers/appProvider'
import { ResponseAdminStatus, ResponseTicketsNext } from '../types/responses'
import { TicketStatus } from '../types/ticket'
import { jsxConditions } from '../utils/jsxConditions'

export const AdminControls: React.FC = () => {
  const { state, dispatch } = useAppState() as ContextAuthorized
  const [error, setError] = useState<string | null>(null)

  const handleChangeStatus = async (id: string, status: TicketStatus) => {
    setError(null)
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
      setError('Failed to update ticket status')
    }
  }

  const handleNext = async () => {
    setError(null)
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
      setError('No tickets in queue')
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
          {error && (
            <Box pad={{ top: 'small' }}>
              <Text color="status-error">{error}</Text>
            </Box>
          )}
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

        {ticketsSorted.map((ticket) => (
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
