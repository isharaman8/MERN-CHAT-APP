const { StatusCodes } = require("http-status-codes");

const { NOT_FOUND, OK, INTERNAL_SERVER_ERROR } = StatusCodes;

const notFound = (req, res, next) => {
	const error = new Error(`Not Found - ${req.originalUrl}`);
	res.status(NOT_FOUND);
	next(error);
};

const errorHandler = (err, req, res, next) => {
	const statusCode =
		res.statusCode === OK ? INTERNAL_SERVER_ERROR : res.statusCode;
	res.status(statusCode);
	res.json({
		message: err.message,
		stack: process.env.NODE_ENV === "production" ? null : err.stack,
	});
};

module.exports = { notFound, errorHandler };
