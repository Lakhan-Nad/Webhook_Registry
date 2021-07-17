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
					.then((res: any) =>
						resolve({ tries, success: true, result: res })
					)
					.catch((err: any) => {
						errors.push(err);
						if (delay === 0) {
							retry();
						} else {
							setTimeout(retry, delay);
						}
					});
			} else {
				reject({
					tries: maxTries,
					errors,
					success: false,
				});
			}
		};
		retry();
	});

export default retryPromise;
