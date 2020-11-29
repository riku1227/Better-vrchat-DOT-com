class DOM {
    static getByClass(className) {
        return document.getElementsByClassName(className);
    }

    static getById(id) {
        return document.getElementById(id);
    }

    static createDiv() {
        return document.createElement("div");
    }

    static createSpan() {
        return document.createElement("span");
    }

    static createA() {
        return document.createElement("a");
    }

    static createP() {
        return document.createElement("p");
    }

    static createButton() {
        return document.createElement("button");
    }

    static createImg() {
        return document.createElement("img");
    }

    static createElement(tagName) {
        return document.createElement(tagName);
    }

    static addClassList(element, classList) {
        for(let i = 0; i < classList.length; i++) {
            element.classList.add(classList[i]);
        }
    }
}