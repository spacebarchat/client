import { useWindowSize } from "@uidotdev/usehooks";
import React from "react";
import { animated, config, useSpring } from "react-spring";
import { useDrag } from "react-use-gesture";

import styles from "./styles.module.css";

interface Props {
	leftChildren: React.ReactNode;
	rightChildren: React.ReactNode;
	children: React.ReactNode;
}

function SwipeableLayout({ leftChildren, children, rightChildren }: Props) {
	const size = useWindowSize();
	const [{ x }, api] = useSpring(() => ({
		x: 0,
	}));

	const open = (canceled: boolean) => {
		// when cancel is true, it means that the user passed the upwards threshold
		// so we change the spring config to create a nice wobbly effect
		api.start({ x: (size.width! * 80) / 100, immediate: false, config: canceled ? config.wobbly : config.stiff });
	};

	const close = (velocity = 0) => {
		api.start({ x: 0, immediate: false, config: { ...config.stiff, velocity } });
	};

	const bind = useDrag(
		({ last, velocity: v, direction: [dx], offset: [ox], cancel, canceled }) => {
			const maxWidth = size.width! * 0.5;
			console.debug("=-=-=-=-=-=-=-=-=-=-");
			console.debug(`X is: `, x.get());
			console.debug(`Max width is: `, maxWidth);
			console.debug(`Last`, last);
			console.debug(`Velocity is: `, v);
			console.debug(`Direction is: `, dx);
			console.debug(`Offset is: `, ox);

			// // on release, check if passed threshold to close, or reset to open pos
			// if (last) {
			// 	// if direction is < 0 (left), and offset is less than 50% of the screen width then close

			// 	ox < maxWidth && dx === -1 ? close(v) : open(canceled);
			// } else api.start({ x: ox });

			api.start({ x: ox });
		},
		{
			from: () => [x.get(), 0],
			filterTaps: true,
			bounds: { left: 0, right: (size.width! * 80) / 100 },
			rubberband: true,
			// initial: () => [x.get(), 0],
			axis: "x",
		},
	);

	// handle resize
	React.useEffect(() => {
		console.log("width change");
		if (x.get() > 0) {
			open(false);
		} else {
			close();
		}
	}, [size.width]);

	return (
		<animated.div {...bind()} className={styles.item}>
			{leftChildren}
			<animated.div className={styles.fg} style={{ x }}>
				{children}
			</animated.div>
		</animated.div>
	);
}

export default SwipeableLayout;
