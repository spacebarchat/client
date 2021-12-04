import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { autorun, extendObservable, observe, runInAction, toJS, trace } from "mobx";

export function initData(obj: any) {
	const name = obj.constructor.name;

	AsyncStorageLib.getItem(name).then((x) => {
		runInAction(() => {
			try {
				const data = JSON.parse(x as string);
				for (const key in data) {
					// obj[key] = data[key];
					// console.log("set", key, "to", data[key], "on", obj);
				}
			} catch (error) {
				console.error(error, x);
			}

			autorun(() => {
				// console.log("auto run", name, toJS(obj));
				// AsyncStorageLib.setItem(name, JSON.stringify(toJS(obj)));
			});
		});
	});
}
