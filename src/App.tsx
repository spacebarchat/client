import { observer } from "mobx-react-lite";
import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { AuthenticationGuard } from "./components/AuthenticationGuard";
import LoadingPage from "./pages/LoadingPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFound";
import RegistrationPage from "./pages/RegistrationPage";
import RootPage from "./pages/RootPage";
import { useAppStore } from "./stores/AppStore";

function App() {
  const app = useAppStore();
  const navigate = useNavigate();
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const token = secureLocalStorage.getItem("token");
    if (token) {
      app.api.loginWithToken(token as string).then(() => {
        setLoading(false);
      });
    } else {
      // set timeout to prevent flashing
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, []);

  // handles token changes
  React.useEffect(() => {
    if (!app.api.token && !isLoading) {
      console.log("TOKEN REMOVED");
      // remove token
      secureLocalStorage.removeItem("token");
      // navigate to login page if token is removed
      navigate("/login", { replace: true });
    }

    if (app.api.token) {
      console.log("TOKEN ADDED");
      // save token
      secureLocalStorage.setItem("token", app.api.token);
      // navigate to root page if token is added
      navigate("/", { replace: true });
    }
  }, [app.api.token, isLoading]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <Routes>
      <Route
        index
        path="/"
        element={<AuthenticationGuard component={RootPage} />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default observer(App);
