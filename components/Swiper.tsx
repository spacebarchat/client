import React from "react";
import { Animated, useWindowDimensions, ViewProps } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Container from "./Container";

interface FooterProps {
  progress: Animated.AnimatedInterpolation<string | number>;
}

function Footer(props: FooterProps & ViewProps) {
  return (
    <Animated.View
      {...props}
      style={[
        props.style,
        {
          transform: [{ translateY: props.progress }],
        },
      ]}
    >
      {props.children}
    </Animated.View>
  );
}

interface SwiperProps {
  leftChildren?: React.ReactNode;
  leftProps?: ViewProps;
  rightChildren?: React.ReactNode;
  rightProps?: ViewProps;
  children: React.ReactNode;
  footerChildren?: React.ReactNode;
  footerProps?: FooterProps & ViewProps;
  containerStyle?: ViewProps["style"];
}

function Swiper({
  leftChildren,
  leftProps,
  rightChildren,
  rightProps,
  children,
  footerProps,
  footerChildren,
  containerStyle,
}: SwiperProps) {
  const { width, height } = useWindowDimensions();
  const [footerProgress, setFooterProgress] = React.useState(
    new Animated.Value(0)
  );

  const bringUpActionSheet = () => {
    Animated.timing(footerProgress, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const closeDownBottomSheet = () => {
    Animated.timing(footerProgress, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const bottomSheetIntropolate = footerProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height],
  });

  const renderLeftAction = (
    _: Animated.AnimatedInterpolation<string | number>,
    dragX: Animated.AnimatedInterpolation<string | number>
  ) => {
    const w = (width * 85) / 100; // 85% of the device width

    const trans = dragX.interpolate({
      inputRange: [0, w],
      outputRange: [0, 0],
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return (
      <Animated.View
        {...leftProps}
        style={[
          leftProps?.style,
          {
            display: "flex",
            flex: 1,
            flexDirection: "row",
            maxWidth: w,
            marginRight: 5,
            transform: [{ translateX: trans }],
          },
        ]}
      >
        {leftChildren}
      </Animated.View>
    );
  };

  const renderRightAction = (
    _: Animated.AnimatedInterpolation<string | number>,
    dragX: Animated.AnimatedInterpolation<string | number>
  ) => {
    const w = (width * 85) / 100; // 85% of the device width

    const trans = dragX.interpolate({
      inputRange: [0, w],
      outputRange: [0, 0],
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return (
      <Animated.View
        {...rightProps}
        style={[
          rightProps?.style,
          {
            display: "flex",
            flex: 1,
            flexDirection: "row",
            maxWidth: w,
            marginRight: 5,
            transform: [{ translateX: trans }],
          },
        ]}
      >
        {rightChildren}
      </Animated.View>
    );
  };

  return (
    <Container isSafe style={containerStyle}>
      <Swipeable
        renderLeftActions={leftChildren ? renderLeftAction : undefined}
        renderRightActions={rightChildren ? renderRightAction : undefined}
        overshootRight={false}
        overshootLeft={false}
        onSwipeableLeftWillOpen={bringUpActionSheet}
        onActivated={closeDownBottomSheet}
        childrenContainerStyle={{ height: "100%" }}
      >
        {children}
      </Swipeable>
      {footerChildren ? (
        <Footer
          {...footerProps}
          progress={bottomSheetIntropolate}
          children={footerChildren}
        />
      ) : null}
    </Container>
  );
}

export default Swiper;
