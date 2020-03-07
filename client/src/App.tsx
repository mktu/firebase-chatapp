import React from 'react';
import deepPurple from '@material-ui/core/colors/deepPurple';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, createMuiTheme, StylesProvider } from '@material-ui/core/styles';
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import {
  AuthContext,
  ProfileContext,
  RoomContext,
  NotificationContext
} from './contexts';
import useAppState from './hooks/useAppState';
import AppRoot from './components/Routes/AppRoot';

const theme = createMuiTheme({
  palette: {
    primary: deepPurple,
  },
});
console.log(theme);

const App: React.FC = () => {

  const {
    userState,
    profileState,
    userActions,
    profileActions,
    roomState,
    roomActions,
    notificationState,
    notificationActions
  } = useAppState();

  return (
    <Router>
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <StyledThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
              <AuthContext.Provider value={{ userState, actions: userActions }}>
                <ProfileContext.Provider value={{ profileState, actions: profileActions }}>
                  <RoomContext.Provider value={{ roomState, actions: roomActions }}>
                    <NotificationContext.Provider value={{ notificationState, actions: notificationActions }}>
                      <AppRoot />
                    </NotificationContext.Provider>
                  </RoomContext.Provider>
                </ProfileContext.Provider>
              </AuthContext.Provider>
            </SnackbarProvider>
          </StyledThemeProvider>
        </ThemeProvider>
      </StylesProvider>
    </Router>
  );
}

export default App;
