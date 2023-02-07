import React from "react";
import { View, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ContainerProps extends ViewProps {
  verticalCenter?: boolean;
  horizontalCenter?: boolean;
  flexOne?: boolean;
  displayFlex?: boolean;
  row?: boolean;
  safe?: boolean;
}

function Container(props: ContainerProps) {
  const Element = props.safe ? SafeAreaView : View;
  return (
    <Element
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
    </Element>
  );
}

export default Container;
