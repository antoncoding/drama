import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { Main, Bar } from '@aragon/ui'
import { Account } from './pages/Account'
import { Home } from './pages/Home'

function App() {
  return (
    <div>
      <Bar
        // primary={<BackButton />}
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
