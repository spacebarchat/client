export function relativeTime(timestamp: Date | number) {
	const msPerMinute = 60 * 1000;
	const msPerHour = msPerMinute * 60;
	const msPerDay = msPerHour * 24;
	const msPerWeek = msPerDay * 7;
	const msPerMonth = msPerDay * 30;
	const msPerYear = msPerDay * 365;

	// @ts-ignore
	const elapsed = Date.now() - new Date(timestamp);

	// @ts-ignore
	const rtf = new Intl.RelativeTimeFormat({ numeric: "auto" });

	if (elapsed < msPerMinute) {
		return rtf.format(-Math.floor(elapsed / 1000), "seconds");
	} else if (elapsed < msPerHour) {
		return rtf.format(-Math.floor(elapsed / msPerMinute), "minutes");
	} else if (elapsed < msPerDay) {
		return rtf.format(-Math.floor(elapsed / msPerHour), "hours");
	} else if (elapsed < msPerWeek) {
		return rtf.format(-Math.floor(elapsed / msPerDay), "days");
	} else {
		return new Date(timestamp).toLocaleDateString();
	}
}
