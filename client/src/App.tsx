import React from 'react';
import Provider from './Provider';
import AppRoot from './components/Routes/AppRoot';

const App: React.FC = () => {
  return (
    <Provider>
      <AppRoot />
    </Provider>
  );
}

export default App;
