import validator from "validator";

// Validate url of only http and https
export const validateUrl = (url: string): boolean =>
	validator.isURL(url, {
		protocols: ["http", "https"],
	});

// Validate uuid v4
export const validateUuid = (uuid: string): boolean =>
	validator.isUUID(uuid, 4);
