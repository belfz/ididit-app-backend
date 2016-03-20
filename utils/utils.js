var crypto = require("crypto");

module.exports = {
	encryptPassword: function(pass){
		var sha256 = crypto.createHash("sha256");
		sha256.update(pass, "utf8");
		return sha256.digest("base64");
	}
};
