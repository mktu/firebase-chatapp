import React from 'react';
import deepPurple from '@material-ui/core/colors/deepPurple';
import { ThemeProvider, createMuiTheme, StylesProvider } from '@material-ui/core/styles';
import styled, {
  ThemeProvider as StyledThemeProvider
} from "styled-components";
import AuthContext from './contexts/AuthContext';
import ProfileContext from './contexts/ProfileContext';
import useAppState from './hooks/useAppState';
import Root from './components/Root';

const theme = createMuiTheme({
  palette: {
    primary: deepPurple,
  },
});


const App: React.FC = () => {

  const { userState, profileState, userActions, profileActions } = useAppState();
  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>
          <AuthContext.Provider value={{ userState, actions: userActions }}>
            <ProfileContext.Provider value={{ profileState, actions: profileActions }}>
              <Root />
            </ProfileContext.Provider>
          </AuthContext.Provider>
        </StyledThemeProvider>
      </ThemeProvider>
    </StylesProvider>
  );
}

export default App;
