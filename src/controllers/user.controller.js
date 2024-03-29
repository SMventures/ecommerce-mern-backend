const userService = require("../services/user.service");

const getUserProfile = async (req, res) => {
    try {
        const jwt = req.headers.authorization?.split(' ')[1];

        if (!jwt) {
            return res.status(404).send({ error: "Token not found" });
        }
        const user = await userService.getUserProfileByToken(jwt);

        return res.status(200).send(user);

    } catch (error) {
        console.log("Error from controller - ", error);
        return res.status(500).send({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        return res.status(200).send(users);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

const updateUserPersonalInfo = async (req, res) => {
    try {
        const userId = req.params.userId;
        const updatedInfo = req.body;

        const updatedUser = await updateUserPersonalInfo(userId, updatedInfo);
        return res.status(200).send(updatedUser);
    } catch (error) {
        console.log("Error from controller - ", error);
        return res.status(500).send({ error: error.message });
    }
};


module.exports = { getUserProfile, getAllUsers, updateUserPersonalInfo };
