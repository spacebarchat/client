import { observer } from "mobx-react-lite";
import { bannerController } from ".";

export default observer(() => {
	return <>{bannerController.rendered}</>;
});
