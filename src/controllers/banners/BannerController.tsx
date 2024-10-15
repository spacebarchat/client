import IconButton from "@components/IconButton";
import { OfflineBanner } from "@components/banners";
import { AnimatePresence, motion } from "framer-motion";
import { action, computed, makeObservable, observable } from "mobx";
import styled from "styled-components";
import { Banner } from "./types";

const Container = styled(motion.div)`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const CloseWrapper = styled(IconButton)`
	position: absolute;
	right: 1%;
`;

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

/**
 * Handles layering and displaying banners to the user.
 */
class BannerController<T extends Banner> {
	stack: T[] = [];
	components: Components;

	constructor(components: Components) {
		this.components = components;

		makeObservable(this, {
			stack: observable,
			push: action,
			pop: action,
			remove: action,
			rendered: computed,
			isVisible: computed,
		});

		this.close = this.close.bind(this);
		this.closeAll = this.closeAll.bind(this);
	}

	/**
	 * Display a new banner on the stack
	 * @param banner banner data
	 */
	push(banner: T, key?: string) {
		if (key && this.stack.find((x) => x.key === key)) {
			console.warn(`Banner with key '${key}' already exists on the stack!`);
			return;
		}

		this.stack = [
			...this.stack,
			{
				...banner,
				key: key ?? randomUUID(),
			},
		];
	}

	/**
	 * Remove the top banner from the screen
	 */
	pop() {
		this.stack = this.stack.map((entry, index) => (index === this.stack.length - 1 ? entry : entry));
	}

	/**
	 * Close the top banner
	 */
	close() {
		this.pop();
	}

	/**
	 * Close all banners on the stack
	 */
	closeAll() {
		this.stack = [];
	}

	/**
	 * Remove the keyed banner from the stack
	 */
	remove(key: string) {
		this.stack = this.stack.filter((x) => x.key !== key);
	}

	/**
	 * Render banners
	 */
	get rendered() {
		return (
			<>
				{this.stack.map((banner) => {
					const Component = this.components[banner.type];
					if (!Component) return null;
					return (
						<AnimatePresence>
							<Container
								variants={{
									show: {
										// slide down
										y: 0,
										transition: {
											delayChildren: 0.3,
											staggerChildren: 0.2,
										},
									},
									hide: {
										// slide up
										y: "-100%",
										transition: {
											delayChildren: 0.3,
											staggerChildren: 0.2,
										},
									},
								}}
								initial="hide"
								animate="show"
								exit="hide"
								onAnimationComplete={() => {
									console.debug("animation complete");
								}}
								//style={bannerContext.content.style}
							>
								<Component {...banner} onClose={() => this.remove(banner.key!)} />
								{/* {!bannerContext.content.forced && (
									<CloseWrapper
										onClick={() => {
											bannerContext.close();
										}}
									>
										<Icon icon="mdiClose" color="var(--text)" size="24px" />
									</CloseWrapper>
								)} */}
							</Container>
						</AnimatePresence>
					);
				})}
			</>
		);
	}

	/**
	 * Whether a banner is currently visible
	 */
	get isVisible() {
		return this.stack.length > 0;
	}
}

export const bannerController = new BannerController({
	offline: OfflineBanner,
});
