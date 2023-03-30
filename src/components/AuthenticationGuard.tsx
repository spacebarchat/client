import { Navigate } from "react-router-dom";
import { useAppStore } from "../stores/AppStore";

interface Props {
  component: React.FC;
}

export const AuthenticationGuard = ({ component }: Props) => {
  const app = useAppStore();

  if (!app.api.token) {
    return <Navigate to="/login" replace />;
  }

  const Component = component;
  return <Component />;
};
