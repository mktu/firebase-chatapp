import React from 'react';
import deepPurple from '@material-ui/core/colors/deepPurple';
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, createMuiTheme, StylesProvider } from '@material-ui/core/styles';
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import AuthContext from './contexts/AuthContext';
import ProfileContext from './contexts/ProfileContext';
import RoomContext from './contexts/RoomContext';
import useAppState from './hooks/useAppState';
import AppRoot from './components/Routes/AppRoot';

const theme = createMuiTheme({
  palette: {
    primary: deepPurple,
  },
});
console.log(theme);

const App: React.FC = () => {

  const { userState, profileState, userActions, profileActions, roomState, roomActions } = useAppState();
  return (
    <Router>
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <StyledThemeProvider theme={theme}>
            <AuthContext.Provider value={{ userState, actions: userActions }}>
              <ProfileContext.Provider value={{ profileState, actions: profileActions }}>
                <RoomContext.Provider value={{ roomState, actions: roomActions }}>
                  <AppRoot />
                </RoomContext.Provider>
              </ProfileContext.Provider>
            </AuthContext.Provider>
          </StyledThemeProvider>
        </ThemeProvider>
      </StylesProvider>
    </Router>
  );
}

export default App;
