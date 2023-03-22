export class VRChatAPI {
    static getWorldInstanceByID(worldId: string, instanceId: string): Promise<XMLHttpRequest> {
        return new Promise((callback) => {
            const request = new XMLHttpRequest();
            request.open("GET", `https://vrchat.com/api/1/worlds/${worldId}/${instanceId}`, true);
            request.onload = function () {
                callback(this);
            };
            request.send();
        });
    }

    static getAvatar(avatarId: string): Promise<XMLHttpRequest> {
        return new Promise((callback) => {
            const request = new XMLHttpRequest();
            request.open("GET", `https://vrchat.com/api/1/avatars/${avatarId}`);
            request.onload = function () {
                callback(this);
            };
            request.send();
        });
    }

    static getFavoriteAvatars(tags: string): Promise<XMLHttpRequest> {
        return new Promise((callback) => {
            const request = new XMLHttpRequest();
            request.open("GET", `https://vrchat.com/api/1/avatars/favorites?n=25&tags=${tags}`);
            request.onload = function () {
                callback(this);
            };
            request.send();
        });
    }

    static getFavoriteAvatarIDs(tags: string): Promise<XMLHttpRequest> {
        return new Promise((callback) => {
            const request = new XMLHttpRequest();
            request.open("GET", `https://vrchat.com/api/1/favorites?n=25&tags=${tags}`);
            request.onload = function () {
                callback(this);
            };
            request.send();
        });
    }

    static postInviteToME(worldId: string, instanceId: string): void {
        const request = new XMLHttpRequest();
        request.open("POST", `https://vrchat.com/api/1/instances/${worldId}:${instanceId}/invite`);
        request.send();
    }

    static putSetAvatar(avatarId: string): void {
        const request = new XMLHttpRequest();
        request.open("PUT", `https://vrchat.com/api/1/avatars/${avatarId}/select`);
        request.send();
    }

    static addFavoriteAvatar(avatarId: string, tags: string): Promise<XMLHttpRequest> {
        return new Promise((callback) => {
            const request = new XMLHttpRequest();
            request.open("POST", "https://vrchat.com/api/1/favorites");
            request.onload = function () {
                callback(this);
            };
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            request.send(`type=avatar&favoriteId=${avatarId}&tags=${tags}`);
        });
    }

    static deleteFavorite(favoriteId: string): Promise<XMLHttpRequest> {
        return new Promise((callback) => {
            const request = new XMLHttpRequest();
            request.open("DELETE", `https://vrchat.com/api/1/favorites/${favoriteId}`);
            request.onload = function () {
                callback(this);
            };
            request.send();
        });
    }
}