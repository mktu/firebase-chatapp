import React from 'react';
import deepPurple from '@material-ui/core/colors/deepPurple';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import AuthContext from './contexts/AuthContext';
import ProfileContext from './contexts/ProfileContext';
import useAppState from './hooks/useAppState';
import Root from './components/Root';

const App: React.FC = () => {
  const theme = createMuiTheme({
    palette: {
      primary: deepPurple,
    },
  });
  const {userState,profileState,userActions,profileActions} = useAppState();
  return (
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={{ userState, actions: userActions }}>
        <ProfileContext.Provider value={{ profileState, actions: profileActions }}>
          <Root />
        </ProfileContext.Provider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
