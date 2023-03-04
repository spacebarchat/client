import React from 'react';
import {
  FlatList,
  Modal,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {Surface, Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CustomTheme} from '../types';
import Container from './Container';

export interface DropdownItem {
  label: string;
  value: string;
}

interface Props {
  label: string;
  data: DropdownItem[];
  onSelect: (item: DropdownItem) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

function Dropdown({label, data, onSelect, containerStyle}: Props) {
  const theme = useTheme<CustomTheme>();
  const DropdownButton = React.useRef<TouchableOpacity>(null);
  const [visible, setVisible] = React.useState(false);
  const [selected, setSelected] = React.useState<(typeof data)[0]>();
  const [dropdownTop, setDropdownTop] = React.useState(0);
  const [dropdownLeft, setDropdownLeft] = React.useState(0);
  const [dropdownWidth, setDropdownWidth] = React.useState(0);

  const toggleDropdown = (): void => {
    visible ? setVisible(false) : openDropdown();
  };

  const openDropdown = (): void => {
    DropdownButton.current?.measure((_fx, _fy, w, h, px, py) => {
      setDropdownTop(py + h);
      setDropdownLeft(px);
      setDropdownWidth(w);
    });
    setVisible(true);
  };

  const onItemPress = (item: any) => {
    setSelected(item);
    onSelect(item);
    setVisible(false);
  };

  const renderItem = ({item}: any) => (
    <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderDropdown = () => {
    return (
      <Modal visible={visible} transparent animationType="none">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}>
          <Container
            element={Surface}
            elevation={2}
            style={[
              styles.dropdown,
              {
                top: dropdownTop,
                left: dropdownLeft,
                width: dropdownWidth,
                backgroundColor: theme.colors.palette.backgroundSecondary70,
              },
            ]}>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </Container>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <TouchableOpacity
      ref={DropdownButton}
      style={[
        styles.button,
        {backgroundColor: theme.colors.surfaceVariant},
        containerStyle,
      ]}
      onPress={toggleDropdown}>
      {renderDropdown()}
      <Text style={styles.buttonText}>
        {(selected && selected.label) || label}
      </Text>
      <Icon
        style={styles.icon}
        color={theme.colors.whiteBlack}
        name="chevron-down"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 1,
    flex: 1,
    padding: 10,
    width: '100%',
    borderRadius: 5,
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
  },
  icon: {
    marginRight: 10,
  },
  dropdown: {
    position: 'absolute',
    height: 200,
  },
  overlay: {
    width: '100%',
    height: '100%',
  },
  item: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});

export default Dropdown;
