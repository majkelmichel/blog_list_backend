const logger = require('./logger');

const requestLogger = (request, response, next) => {
	logger.info('Method:', request.method);
	logger.info('Path:  ', request.path);
	logger.info('Body:  ', request.body);
	logger.info('---');
	next();
};

const errorHandler = (err, req, res, next) => {
	logger.error(err.message);

	if (err.name === 'ValidationError') {
		return res.status(400).json({ error: err.message });
	} else if (err.name === 'JsonWebTokenError') {
		return res.status(401).json({
			error: 'token missing or invalid',
		});
	}
};

module.exports = {
	requestLogger,
	errorHandler,
};