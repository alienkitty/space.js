export class Page {
    constructor({ path, title, details }) {
        this.path = path;
        this.title = title;
        this.details = details;

        if (this.title) {
            document.title = `${this.title} — Mars`;
        } else {
            document.title = 'Mars';
        }
    }
}
