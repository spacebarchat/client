import loadable from "@loadable/component";
import { IconBaseProps } from "react-icons";

export interface IconProps extends IconBaseProps {
	iconName: string;
}

function Icon(props: IconProps) {
	const lib = props.iconName
		.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
		.split(" ")[0]
		.toLocaleLowerCase();

	const ElementIcon = loadable(() => import(`react-icons/${lib}/index.js`), {
		resolveComponent: (el: JSX.Element) => {
			if (!el[props.iconName as keyof JSX.Element])
				throw new Error(
					`Invalid icon name ${props.iconName} for font lib ${lib}`,
				);
			return el[props.iconName as keyof JSX.Element];
		},
	});

	const { iconName, ...propSpread } = props;
	return <ElementIcon {...propSpread} />;
}

export default Icon;
