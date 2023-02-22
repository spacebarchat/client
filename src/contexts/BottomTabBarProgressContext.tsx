import * as React from "react";
import { Animated } from "react-native";

export default React.createContext({
  progress: new Animated.Value(0),
  setProgress: (progress: number) => {},
});
