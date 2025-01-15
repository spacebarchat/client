import { observer } from "mobx-react-lite";
import { bannerController } from "./BannerController";

export default observer(() => {
	return <>{bannerController.rendered}</>;
});
