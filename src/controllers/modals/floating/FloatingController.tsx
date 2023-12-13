import { UseFloatingData, useInteractions } from "@floating-ui/react";
import { motion } from "framer-motion";
import { action, computed, makeObservable, observable } from "mobx";
import UserProfilePopout from "../../../components/floating/UserProfilePopout";
import GuildMember from "../../../stores/objects/GuildMember";
import User from "../../../stores/objects/User";

function randomUUID() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		// eslint-disable-next-line no-bitwise
		const r = (Math.random() * 16) | 0;
		// eslint-disable-next-line no-bitwise, no-mixed-operators
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Components = Record<string, React.FC<any>>;

export type FloatingElement = {
	type: string;
	data: UseFloatingData & ReturnType<typeof useInteractions>;
	open: boolean;
	props: {
		user: User;
		member?: GuildMember;
	};
};

class FloatingController {
	elements: (FloatingElement & { key: string })[] = [];
	components: Components;

	constructor(components: Components) {
		this.components = components;
		makeObservable(this, {
			elements: observable,
			add: action,
			remove: action,
			rendered: computed,
		});
	}

	add(element: FloatingElement) {
		console.log(`Add was called with `, element);
		const key = randomUUID();
		this.elements = [...this.elements, { ...element, key }];
		return key;
	}

	remove(key: string) {
		console.log(`Remove was called with `, key);
		this.elements = this.elements.filter((element) => element.key !== key);
	}

	get rendered() {
		return (
			<>
				{this.elements.map((element, index) => {
					const Component = this.components[element.type];
					return (
						element.open && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.1, easing: [0.87, 0, 0.13, 1] }}
								style={element.data.floatingStyles}
								key={index}
								{...element.data.getFloatingProps()}
							>
								<div
									ref={element.data.refs.setFloating}
									style={{
										position: element.data.strategy,
										top: `${element.data.y ?? 0}px`,
										left: `${element.data.x ?? 0}px`,
										zIndex: 10000,
									}}
								>
									<Component {...element.props} />
								</div>
							</motion.div>
						)
					);
				})}
			</>
		);
	}
}

export const floatingController = new FloatingController({
	userPopout: UserProfilePopout,
});
