import React from "react";
import { useTheme } from "@aragon/ui";

import { Title2 } from "../../components/aragon";

export function Home(props: any) {
  const theme = useTheme();

  return (
    <div
      style={{
        paddingTop: "1%",
        color: `${theme.surfaceContentSecondary}`,
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
      <Title2> Welcome to Pizzino 🎫 </Title2>
    </div>
  );
}
