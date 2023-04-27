import { Navigate } from "react-router-dom";
import { useAppStore } from "../../stores/AppStore";

interface Props {
	component: React.FC;
}

export const UnauthenticatedGuard = ({ component }: Props) => {
	const app = useAppStore();

	if (app.token) {
		return <Navigate to="/app" replace />;
	}

	const Component = component;
	return <Component />;
};
