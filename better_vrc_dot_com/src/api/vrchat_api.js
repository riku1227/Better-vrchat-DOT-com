class VRChatAPI {
    static getWorldInstanceByID (worldId, instanceId) {
        return new Promise((callback) => {
            const request = new XMLHttpRequest();
            request.open("GET", `https://vrchat.com/api/1/worlds/${worldId}/${instanceId}`, true);
            request.onload = function () {
                callback(this);
            }
            request.send();
        });
    }

    static getAvatar(avatarId) {
        return new Promise((callback) => {
            const request = new XMLHttpRequest();
            request.open("GET", `https://vrchat.com/api/1/avatars/${avatarId}`);
            request.onload = function () {
                callback(this);
            }
            request.send();
        });
    }

    static getFavoriteAvatars(tags) {
        return new Promise((callback) => {
            const request = new XMLHttpRequest();
            request.open("GET", `https://vrchat.com/api/1/avatars/favorites?n=25&tags=${tags}`);
            request.onload = function() {
                callback(this);
            }
            request.send();
        });
    }

    static getFavoriteAvatarIDs(tags) {
        return new Promise((callback) => {
            const request = new XMLHttpRequest();
            request.open("GET", `https://vrchat.com/api/1/favorites?n=25&tags=${tags}`);
            request.onload = function() {
                callback(this);
            }
            request.send();
        });
    }

    static postInviteToME(worldId, instanceId) {
        const request = new XMLHttpRequest();
        request.open("POST", `https://vrchat.com/api/1/instances/${worldId}:${instanceId}/invite`);
        request.send();
    }

    static putSetAvatar(avatarId) {
        const request = new XMLHttpRequest();
        request.open("PUT", `https://vrchat.com/api/1/avatars/${avatarId}/select`);
        request.send();
    }

    static addFavoriteAvatar(avatarId, tags) {
        return new Promise((callback) => {
            const request = new XMLHttpRequest();
            request.open("POST", "https://vrchat.com/api/1/favorites");
            request.onload = function() {
                callback(this);
            }
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            request.send(`type=avatar&favoriteId=${avatarId}&tags=${tags}`);
        });
    }

    static deleteFavorite(favoriteId) {
        return new Promise((callback) => {
            const request = new XMLHttpRequest();
            request.open("DELETE", `https://vrchat.com/api/1/favorites/${favoriteId}`);
            request.onload = function() {
                callback(this);
            }
            request.send();
        });
    }
}