import React from "react";
import { useTheme } from "@aragon/ui";
import { Title1, Title2, Title3 } from "../../components/aragon";

export function About(props: any) {
  const theme = useTheme();

  return (
    <div
      style={{
        display: "flex",
        paddingTop: "2%",
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        color: `${theme.surfaceContentSecondary}`,
      }}
    >
      <Title1 style={{ color: theme.surfaceContent, padding: 20 }}>
        {" "}
        About Pizzino{" "}
      </Title1>
      <div style={{ padding: 20, maxWidth: 650, textAlign: "center" }}>
        Pizzino is an interface for user to browse contents permanently stored
        on Ethereum.
        <br />
      </div>

      <Title2 style={{ color: theme.surfaceContent, paddingTop: 20 }}>
        {" "}
        What does "Pizzino" mean?{" "}
      </Title2>

      <div style={{ padding: 20, maxWidth: 650, textAlign: "center" }}>
        Pizzino is an Italian word, meaning "small piece of paper", refers to
        small slips of paper that the Sicilian Mafia uses for secret
        communications.
        <br />
        <br />
        Now with the technology of blockchain, we can communicate with no middle
        man, encrypted or publicly, distinctively or anonymously, somehow just
        like the old-time mafias, but cooler in a geeky way.
      </div>

      <Title3 style={{ color: theme.surfaceContent, paddingTop: 20 }}>
        {" "}
        Show Me the Code{" "}
      </Title3>
      <div style={{ padding: 20, maxWidth: 650, textAlign: "right" }}>
        <a href="https://github.com/antoncoding/pizzino">
          {" "}
          @antoncoding/pizzino{" "}
        </a>
      </div>

      <Title3 style={{ color: theme.surfaceContent, paddingTop: 20 }}>
        {" "}
        Powered By{" "}
      </Title3>
      <div style={{ padding: 20, maxWidth: 650, textAlign: "left" }}>
        * Infura
        <br />
        * Etherscan
        <br />* AragonUI
      </div>
    </div>
  );
}
