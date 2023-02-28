import React from 'react';
import {Pressable, PressableProps, View, ViewProps} from 'react-native';
import {Surface} from 'react-native-paper';

interface ContainerProps {
  verticalCenter?: boolean;
  horizontalCenter?: boolean;
  flex?: number;
  displayFlex?: boolean;
  row?: boolean;
  elevation?: 0 | 1 | 2 | 3 | 4 | 5 | undefined;
  element?:
    | string
    | React.ComponentClass<ViewProps, any>
    | React.FunctionComponent<ViewProps>
    | typeof Surface
    | typeof Pressable;
}

function Container(props: ContainerProps & ViewProps & PressableProps) {
  const Element = props.element ?? View;

  return (
    <Element
      {...props}
      style={[
        props.style,
        props.flex ? {flex: props.flex} : undefined,
        props.displayFlex ? {display: 'flex'} : undefined,
        props.verticalCenter ? {justifyContent: 'center'} : undefined,
        props.horizontalCenter ? {alignItems: 'center'} : undefined,
        props.row ? {flexDirection: 'row'} : undefined,
      ]}>
      {props.children}
    </Element>
  );
}

export default Container;
