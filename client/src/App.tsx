import React from 'react';
import deepPurple from '@material-ui/core/colors/deepPurple';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, createMuiTheme, StylesProvider } from '@material-ui/core/styles';
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import {
  AuthContext,
  ProfileContext,
  NotificationContext,
  ServiceContext
} from './contexts';
import { defaultServices } from './contexts/ServiceContext';
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
    notificationState,
    notificationActions,
  } = useAppState();

  return (
    <Router>
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <StyledThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
              <ServiceContext.Provider value={defaultServices}>
                <AuthContext.Provider value={{ userState, actions: userActions }}>
                  <ProfileContext.Provider value={{ profileState, actions: profileActions }}>
                    <NotificationContext.Provider value={{ notificationState, actions: notificationActions }}>
                      <AppRoot />
                    </NotificationContext.Provider>
                  </ProfileContext.Provider>
                </AuthContext.Provider>
              </ServiceContext.Provider>
            </SnackbarProvider>
          </StyledThemeProvider>
        </ThemeProvider>
      </StylesProvider>
    </Router>
  );
}

export default App;
