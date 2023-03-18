import React from 'react';

interface Props {
  position: {x: number; y: number};
  items: {label: string; onPress: () => void}[];
}

const useValue = () => {
  const [visible, setVisible] = React.useState(false);
  const [position, setPosition] = React.useState({x: 0, y: 0});
  const [items, setItems] = React.useState<Props['items']>([]);

  const open = (props: Props) => {
    setPosition(props.position);
    setItems(props.items);
    setVisible(true);
  };

  return {
    open,
    close: () => setVisible(false),
    visible,
    position,
    items,
  };
};

export const ContextMenuContext = React.createContext(
  {} as ReturnType<typeof useValue>,
);

export const ContextMenuContextProvider: React.FC<any> = props => {
  return (
    <ContextMenuContext.Provider value={useValue()}>
      {props.children}
    </ContextMenuContext.Provider>
  );
};
