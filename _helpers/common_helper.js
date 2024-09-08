export const handleError = (res, error) => {
	return res.status(400).json({ error: `Something went wrong: ${error}` });
};
