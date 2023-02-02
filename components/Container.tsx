import React from "react";
import { View, ViewProps } from "react-native";

interface ContainerProps extends ViewProps {
  verticalCenter?: boolean;
  horizontalCenter?: boolean;
  flexOne?: boolean;
  displayFlex?: boolean;
  row?: boolean;
}

function Container(props: ContainerProps) {
  return (
    <View
      {...props}
      style={[
        props.style,
        props.flexOne ? { flex: 1 } : undefined,
        props.displayFlex ? { display: "flex" } : undefined,
        props.verticalCenter ? { justifyContent: "center" } : undefined,
        props.horizontalCenter ? { alignItems: "center" } : undefined,
        props.row ? { flexDirection: "row" } : undefined,
      ]}
    >
      {props.children}
    </View>
  );
}

export default Container;
