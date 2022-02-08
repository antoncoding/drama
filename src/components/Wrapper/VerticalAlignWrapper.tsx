import React from "react";

export const VerticalAlignWrapper = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) => {
  return (
    <div
      style={{
        // all child vertical aligned
        display: "flex",
        alignItems: "center",

        ...style,
      }}
    >
      {children}
    </div>
  );
};
