import { FloatingContext } from "../../contexts/FloatingContext";
import useFloating, { FloatingOptions } from "../../hooks/useFloating";

function Floating({
	children,
	...restOptions
}: {
	children: React.ReactNode;
} & FloatingOptions) {
	const floating = useFloating({ ...restOptions });
	return <FloatingContext.Provider value={floating}>{children}</FloatingContext.Provider>;
}

export default Floating;
