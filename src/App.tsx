import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { Main, Bar, TextInput, IconSearch } from '@aragon/ui'
import { Account } from './pages/Account'
import { Home } from './pages/Home'

function App() {
  return (
    <div>
      <Bar
        primary={<div > Decoder </div>}
        secondary={
          <TextInput 
            wide={true} 
            adornmentPosition="end"
            adornment={<IconSearch/>}
        />}
      />
      <Main>

        <BrowserRouter>
          <Routes>
            <Route
              path="/account/:address"
              element={<Account />}
            />
            <Route
              path="/"
              element={<Home />}
            />
          </Routes>
        </BrowserRouter>
      </Main>
    </div>
  );
}

export default App;
