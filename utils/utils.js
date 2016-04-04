var crypto = require("crypto");

module.exports = {
	encryptPassword: function(pass){
		var sha256 = crypto.createHash("sha256");
		sha256.update(pass, "utf8");
		return sha256.digest("base64");
	},
    getAchievementUpdateData: function (data) {
        return ['title', 'content', 'done']
            .filter(field => data.hasOwnProperty(field))
            .reduce((updateData, nextField) => {
                updateData[nextField] = data[nextField];
                return updateData;
            }, {});
    }
};
