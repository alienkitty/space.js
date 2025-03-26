export class Data {
    static init({ pages }) {
        this.pages = pages;

        this.map = new Map();

        this.pages.forEach(page => {
            this.map.set(page.path, page);
        });
    }

    // Public methods

    static get(path) {
        return this.map.get(path);
    }
}
