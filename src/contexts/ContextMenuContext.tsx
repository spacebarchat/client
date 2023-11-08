import React from "react";
import { IContextMenuItem } from "../components/ContextMenuItem";

interface Props {
	position: { x: number; y: number };
	items: { label: string; onClick: React.MouseEventHandler<HTMLDivElement> }[];
	style?: React.CSSProperties;
}

const useValue = () => {
	const [visible, setVisible] = React.useState(false);
	const [position, setPosition] = React.useState({ x: 0, y: 0 });
	const [items, setItems] = React.useState<IContextMenuItem[]>([]);
	const [style, setStyle] = React.useState<Props["style"]>({});

	const open = (props: Props) => {
		setPosition(props.position);
		setItems(props.items);
		setStyle(props.style);
		setVisible(true);
	};

	const open2 = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, items: IContextMenuItem[]) => {
		e.preventDefault();
		e.stopPropagation();
		setPosition({ x: e.pageX, y: e.pageY });
		setItems(items);
		setVisible(true);
	};

	return {
		open,
		open2,
		close: () => setVisible(false),
		visible,
		position,
		items,
		style,
	};
};

export const ContextMenuContext = React.createContext({} as ReturnType<typeof useValue>);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ContextMenuContextProvider: React.FC<any> = (props) => {
	return <ContextMenuContext.Provider value={useValue()}>{props.children}</ContextMenuContext.Provider>;
};
