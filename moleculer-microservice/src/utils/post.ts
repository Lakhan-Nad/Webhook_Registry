import http from "http";

export class PostRequest {
	data: string;
	timeout: number;

	constructor(ip: string, startTime: number, timeout?: number) {
		this.data = JSON.stringify({ ipAddress: ip, timestamp: startTime });
		this.timeout = timeout || 1000;
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
				timeout: this.timeout,
			},
			(res: http.IncomingMessage) => {
				if (!res.statusCode.toString().startsWith("2")) {
					callback(new Error(`Status code: ${res.statusCode}`));
				} else {
					callback();
				}
			}
		);
		const timeoutHandler = () => {
			req.destroy(
				new Error(`Request to ${req.socket.address} timed out`)
			);
		};
		const errorHandler = (e: Error) => {
			callback(e);
			req.off("error", errorHandler);
			req.off("timeout", timeoutHandler);
		};
		req.on("error", errorHandler);
		req.on("timeout", timeoutHandler);
		req.write(this.data);
		req.end();
	}

	public _timeout() {
		return this.timeout;
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
