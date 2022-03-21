const { connect } = require("mongoose");

module.exports = (mongoURI) => {
	return connect(mongoURI);
};
