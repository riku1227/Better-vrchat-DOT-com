class Util {
    static getQueriesFromStr(urlStr) {
        const queryMap = new Map();
        if(urlStr.indexOf("?") == -1) {
            return queryMap;
        }

        const urlSplit = urlStr.split("?")[1].split("&");
        for(let i = 0; i < urlSplit.length; i++) {
            if(urlSplit[i].indexOf("=") != -1) {
                const valueKey = urlSplit[i].split("=");
                queryMap[valueKey[0]] = valueKey[1];
            }
        }

        return queryMap;
    }

    static getTimeOnLogFormat() {
        const nowDate = new Date();
        return `[${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}]`;
    }

    static readFileAsText(file) {
        return new Promise((callback) => {
            const fileReader = new FileReader();
            fileReader.readAsText(file);
            fileReader.onload = function () {
                callback(fileReader.result);
            }
        });
    }
}