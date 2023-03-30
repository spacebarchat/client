import React from 'react';
import {Platform, StyleSheet, useWindowDimensions} from 'react-native';
import {useTheme} from 'react-native-paper';
import {CustomTheme} from '../../types';
import Container from '../Container';
import ContextMenuItem, {IContextMenuItem} from './ContextMenuItem';

interface Props {
  open: (props: Props) => void;
  close: () => void;
  visible: boolean;
  position: {
    x: number;
    y: number;
  };
  items: IContextMenuItem[];
}

function ContextMenu({position, close, items}: Props) {
  const {height} = useWindowDimensions();
  const theme = useTheme<CustomTheme>();

  // Close the context menu when the user clicks outside of it
  React.useEffect(() => {
    if (!Platform.isWeb) {
      return;
    }

    const listener = () => {
      close();
    };

    // @ts-expect-error - this is web-only
    document.addEventListener('click', listener);
    return () => {
      // @ts-expect-error - this is web-only
      document.removeEventListener('click', listener);
    };
  }, []);

  return (
    <Container
      onBlur={close}
      style={[
        styles.container,
        {
          maxHeight: height - 32,
          top: position.y,
          left: position.x,
          backgroundColor: theme.colors.palette.background40,
        },
      ]}>
      {items.map((item, index) => {
        return (
          <ContextMenuItem
            key={index}
            item={item}
            close={close}
            index={index}
          />
        );
      })}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    minWidth: 188,
    maxWidth: 320,
    borderRadius: 4,
    zIndex: 4,
    padding: 10,
  },
});

export default ContextMenu;
