import React from "react";
import { Dimensions, StyleSheet, View, ViewProps } from "react-native";

const { width, height } = Dimensions.get("window");

const Row = ({ children, numRows }: ViewProps & { numRows: number }) => (
  <View style={styles.row}>
    {React.Children.map(children, (child) => {
      return React.cloneElement(child as any, {
        style: {
          flex: numRows,
          ...(child as any)?.props?.style,
        },
      });
    })}
  </View>
);

const Column = ({ children, style }: ViewProps) => {
  console.log(style);
  return <View style={[style, styles.column]}>{children}</View>;
};

function Grid({ children }: ViewProps) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 4,
    marginHorizontal: "auto",
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  column: {
    width: width / 4 - 20,
    height: height / 4,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
});

Grid.Row = Row;
Grid.Column = Column;

export default Grid;
