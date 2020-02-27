import React from 'react';
import {StatusBar} from 'react-native';

import './config/ReactotronConfig';

import Routes from './routes';

export default function App() {
  return (
    <>
      {/* Configura a parte onde fica o horario, bateria, etc */}
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <Routes />
    </>
  );
}
