import { observer } from "mobx-react-lite";
import Container from "../components/Container";
import { useAppStore } from "../stores/AppStore";
import LoadingPage from "./LoadingPage";

function RootPage() {
  const app = useAppStore();

  if (!app.ready) {
    return <LoadingPage />;
  }

  return <Container>RootPage</Container>;
}

export default observer(RootPage);
