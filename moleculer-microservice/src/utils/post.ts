import http from "http";

export class PostRequest {
	data: string;
	timeout: number;
	maxTimeout: number;

	constructor(
		ip: string,
		startTime: number,
		timeout?: number,
		maxTimeout?: number
	) {
		this.data = JSON.stringify({ ipAddress: ip, timestamp: startTime });
		this.timeout = timeout || 1000;
		this.maxTimeout = maxTimeout || 10000;
	}

	private _baseRequest(
		url: string,
		callback: (err?: Error) => void,
		tout?: number
	) {
		if (tout && tout > this.maxTimeout) {
			tout = this.maxTimeout;
		}
		const req = http.request(
			url,
			{
				headers: {
					"content-type": "application/json",
					"content-length": Buffer.byteLength(this.data),
				},
				method: "POST",
				timeout: tout || this.timeout,
			},
			// ignoring any returned data
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

	public _maxTimrout() {
		return this.maxTimeout;
	}

	/**
	 * Adjust timeout for each request accordingly
	 * 404 error if found more than 2 times stop trying
	 **/
	public post(url: string, maxTries: number = 1): Promise<void> {
		let tries: number = 0;
		let errorMessages: string[] = [];
		let lastTimeout = this._timeout();
		let self = this;
		let notFoundCount = 0;
		return new Promise((resolve, reject) => {
			const errorCallback = (err?: Error) => {
				if (err) {
					errorMessages.push(err.message);
					if (err.message.endsWith("timed out")) {
						lastTimeout = 2 * lastTimeout;
						req(lastTimeout);
					} else if (err.message.includes("Status code: 404")) {
						// we can skip trying because route may not exist
						notFoundCount++;
						if (notFoundCount > 2) {
							reject(new Error(`${url} is not available`));
							return;
						}
					} else {
						req(lastTimeout);
					}
				} else {
					resolve();
				}
			};
			function req(timeout: number) {
				tries += 1;
				if (tries > maxTries) {
					reject(
						new Error(
							`Max tries reached: ${maxTries}. Errors: ${errorMessages.join(
								","
							)}`
						)
					);
					return;
				}
				self._baseRequest(url, errorCallback, timeout);
			}
			req(lastTimeout);
		});
	}
}
