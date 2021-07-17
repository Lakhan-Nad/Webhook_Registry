import http from "http";

export class PostRequest {
	data: string;

	constructor(ip: string, startTime: number) {
		this.data = JSON.stringify({ ipAddress: ip, timestamp: startTime });
	}

	private _baseRequest(url: string, callback: (err?: Error) => void) {
		const req = http.request(
			url,
			{
				headers: {
					"content-type": "application/json",
					"content-length": Buffer.byteLength(this.data),
				},
				method: "POST",
			},
			(res: http.IncomingMessage) => {
				if (!res.statusCode.toString().startsWith("2")) {
					callback(new Error(`Status code: ${res.statusCode}`));
				} else {
					callback();
				}
			}
		);
		const errorHandler = (e: Error) => {
			callback(e);
			req.off("error", errorHandler);
		};
		req.on("error", errorHandler);
		req.write(this.data);
		req.end();
	}

	public post(url: string) {
		return (): Promise<void> =>
			new Promise((resolve, reject) => {
				this._baseRequest(url, (err?: Error) => {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				});
			});
	}
}
