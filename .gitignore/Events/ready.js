module.exports = async(client) => {

    client.user.setPresence({
        game: {
            name: "Bot Saberions V1"
        }
    })
};