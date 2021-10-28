import {
  Box, Grommet, ResponsiveContext, Spinner
} from 'grommet';
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router, Route, Switch
} from "react-router-dom";
import io from 'socket.io-client';
import { __api__ } from '../../constants/endpoint';
import { Admin } from '../../pages/Admin';
import { Home } from '../../pages/Home';
import { Login } from '../../pages/Login';
import { Logout } from '../../pages/Logout';
import { AppProvider, Context, useAppState } from '../../providers/appProvider';
import { UserRoute } from '../../routes/UserRoute';
import { IOResponseTickets, ResponseMain } from '../../types/responses';
import { SocketIOError } from '../../types/socketIO';

function App() {
  const { dispatch } = useAppState() as Context
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const socket = io(`${__api__}`, {
      withCredentials: true,
      autoConnect: false,

      //
      auth: {
        token: localStorage.getItem('token')
      }
    })
    socket.connect()

    socket.on('connect', () => {
      console.log('socket io connected')
    })

    // TODO: route to login
    socket.on("connect_error", (error) => {
      const message = error.message as SocketIOError
      if(message === 'Unauthorized') {
        dispatch({ type: 'UNAUTHORIZED' })
      }
      else {
        console.error('error:', error)
      }
      setLoading(false)
    });

    socket.on('tickets', (data) => {
      const { tickets } = data as IOResponseTickets
      dispatch({ type: 'TICKETS', value: { tickets } })
    })

    socket.on('initialize', (data) => {
      console.log('init')
      const {
        user,
        tickets,
        userTicket
      } = data as ResponseMain
      dispatch({ type: 'STATE_UPDATE', value: {
        tickets,
        userTicket,
        user
      }})
      setLoading(false)
    })

    return () => {
      socket.disconnect()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box 
      fill 
      background="accent-4"
      align="center"
      justify="center"
    >
      {loading ? (
        <Spinner size="xlarge" message="loading spinner" />
      ) : (
        <Switch>
          <UserRoute exact path="/">
            <Home />
          </UserRoute>
          <Route path="/admin">
            <Admin />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/logout">
            <Logout />
          </Route>
        </Switch>
      )}
    </Box>
  );
}

const WrappedApp = () => {
  return (
    <Router>
      <Grommet plain full>
        <ResponsiveContext.Consumer>
          {size => (
            <Box fill background="accent-4" align="center" justify="center">
              <AppProvider>
                <App />
              </AppProvider>
            </Box>
          )}
        </ResponsiveContext.Consumer>
      </Grommet>
    </Router>
  )
}

export default WrappedApp;
