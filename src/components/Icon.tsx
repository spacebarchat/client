import * as Icons from "@mdi/js";
import { Icon as MdiIcon } from "@mdi/react";
import { IconProps as IconBaseProps } from "@mdi/react/dist/IconProps";

export type IconType = keyof typeof Icons;

export interface IconProps extends Omit<IconBaseProps, "path"> {
	icon: IconType;
}

function Icon(props: IconProps) {
	const path = Icons[props.icon];
	if (!path) throw new Error(`Invalid icon name ${props.icon}`);

	const { icon, ...propSpread } = props;
	return <MdiIcon {...propSpread} path={path} />;
}

export default Icon;
