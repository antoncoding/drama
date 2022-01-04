import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { Main, Bar, TextInput, IconSearch } from "@aragon/ui";
import { Account } from "./pages/Account";
import { Home } from "./pages/Home";

function App() {
  return (
    <Router>
      <Bar
        primary={<div> Decoder </div>}
        secondary={
          <TextInput
            wide={true}
            adornmentPosition="end"
            adornment={<IconSearch />}
          />
        }
      />
      <Main>
        <Switch>
          <Route path="/account/:address">
            <Account />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Main>
    </Router>
  );
}

export default App;
