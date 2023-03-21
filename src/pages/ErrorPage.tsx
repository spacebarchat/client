import Container from "../components/Container";
import Text from "../components/Text";

interface Props {
  error: Error;
}

function ErrorPage({ error }: Props) {
  return (
    <Container>
      <Text>Oops, Something went wrong!</Text>
      <pre>{error.message}</pre>
    </Container>
  );
}

export default ErrorPage;
