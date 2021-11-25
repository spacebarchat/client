// handle rate limit

export default async function request(url: string, opts: RequestInit = {}) {
	if (!opts.headers) opts.headers = {};
	if (opts.body && typeof opts.body === "object") {
		opts.body = JSON.stringify(opts.body); // @ts-ignore
		opts.headers["content-type"] = "application/json";
		if (!opts.method) opts.method = "POST";
	}

	const response = await fetch(url, opts);

	const errorCode = response.status >= 400;
	const text = await response.text();
	try {
		const data = JSON.parse(text);
		if (data.error || errorCode) {
			throw data;
		}
		return data;
	} catch (error) {
		throw text;
	}
}
