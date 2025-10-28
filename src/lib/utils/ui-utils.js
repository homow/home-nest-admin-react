import {clsx} from "clsx";
import {twMerge} from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

class EscapeStack {
    constructor() {
        this.stack = []
        this.handler = this.handler.bind(this);
        window.addEventListener("keydown", this.handler);
        console.log(this.stack)
    }

    handler = event => {
        if (event.key === "Escape" && this.stack.length > 0) {
            const last = this.stack.pop();
            if (last) last()
        }
    }

    push(callback) {
        console.log(callback)
        if (typeof callback === "function") {
            this.stack.push(callback);
        }
    }

    remove(callback) {
        this.stack = this.stack.filter(fn => fn !== callback);
    }

    clear() {
        this.stack = [];
    }

    destroy() {
        window.removeEventListener("keydown", this.handler);
        this.clear();
    }
}

const escapeStack = new EscapeStack()
export {cn, escapeStack};
