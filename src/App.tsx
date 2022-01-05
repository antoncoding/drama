import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { Main, Bar, TextInput, IconSearch } from "@aragon/ui";
import { Account } from "./pages/Account";
import { Home } from "./pages/Home";
import { Title3 } from "./components/aragon";

function App() {
  return (
    <Router>
      <Bar
        primary={<Title3> Pizzino </Title3>}
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
        <div style={{ paddingTop: "100px" }}></div>
      </Main>
    </Router>
  );
}

export default App;
