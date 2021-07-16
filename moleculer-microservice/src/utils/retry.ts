const retryPromise = (
	func: Function,
	maxTries: number = 1,
	delay: number = 0
) =>
	new Promise((resolve, reject) => {
		let tries = 0;
		const errors: any[] = [];
		const retry = () => {
			tries++;
			if (tries <= maxTries) {
				Promise.resolve(func())
					.then(resolve)
					.catch((err: any) => {
						errors.push(err);
						if (delay === 0) {
							retry();
						} else {
							setTimeout(retry, delay);
						}
					});
			} else {
				reject(
					new Error(
						`Retry count exceeded (${maxTries}): ${errors
							// eslint-disable-next-line arrow-parens
							.map((e) => e.message || "")
							.join("")}`
					)
				);
			}
		};
		retry();
	});

export default retryPromise;
