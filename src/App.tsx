import React, { useMemo } from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory,
  useLocation,
} from "react-router-dom";
import { Main, Bar, ToastHub, ButtonBase } from "@aragon/ui";
import { Account } from "./pages/Account";
import { Transaction } from "./pages/Transaction";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Body2, Title3 } from "./components/aragon";
import { SearchInput } from "./components/SearchInput";
import { VerticalAlignWrapper } from "./components/Wrapper/VerticalAlignWrapper";

function SubApp() {
  const history = useHistory();

  const location = useLocation();

  const isHomePage = useMemo(() => location.pathname === "/", [location]);

  return (
    <div>
      <Bar>
        <VerticalAlignWrapper style={{ display: "flex", padding: 10 }}>
          <div>
            <ButtonBase onClick={() => history.push("/")}>
              <Title3> Pizzino </Title3>
            </ButtonBase>
          </div>

          {!isHomePage && (
            <div style={{ marginLeft: "auto", minWidth: "500px" }}>
              <SearchInput />
            </div>
          )}
          {
            <div style={{ marginLeft: "auto", paddingRight: 18 }}>
              <ButtonBase onClick={() => history.push("/about")}>
                <Body2> Learn more </Body2>
              </ButtonBase>
            </div>
          }
        </VerticalAlignWrapper>
      </Bar>
      <Main>
        <Switch>
          <Route path="/account/:address">
            <Account />
          </Route>
          <Route path="/tx/:hash">
            <Transaction />
          </Route>
          <Route path="/about">
            <About />
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
      <ToastHub>
        <SubApp />
      </ToastHub>
    </Router>
  );
}

export default App;
