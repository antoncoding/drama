import React from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import { Main, Bar, TextInput, IconSearch, LinkBase } from "@aragon/ui";
import { Account } from "./pages/Account";
import { Home } from "./pages/Home";
import { Title3 } from "./components/aragon";

function SubApp() {
  const history = useHistory();
  return (
    <div>
      <Bar
        primary={
          <LinkBase onClick={() => history.push("/")}>
            <Title3> Pizzino </Title3>
          </LinkBase>
        }
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
    </div>
  );
}

function App() {
  return (
    <Router>
      <SubApp />
    </Router>
  );
}

export default App;
