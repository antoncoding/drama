import React from "react";
import { useTheme } from "@aragon/ui";
import { Title1 } from "../../components/aragon";
import { SearchInput } from "../../components/SearchInput";

export function Home(props: any) {
  const theme = useTheme();

  return (
    <div
      style={{
        display: "flex",
        paddingTop: "1%",
        alignItems: "center",
        justifyContent: "center",
        color: `${theme.surfaceContentSecondary}`,
      }}
    >
      <div
        style={{
          minWidth: 400,
          padding: 20,
        }}
      >
        {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
        <Title1> Welcome to Pizzino 🎫 </Title1>
        <br></br>
        See what people are talking about on-chain.
        <br />
        <SearchInput />
        <br />
        <br />
        <br />
        <br />
        <img
          alt="cute"
          src={require("../../imgs/home.jpg")}
          style={{ width: 600, opacity: 0.75, borderRadius: 4 }}
        />
      </div>
    </div>
  );
}
