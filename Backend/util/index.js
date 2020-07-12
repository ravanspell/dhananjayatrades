


class Util {
    static currantDate() {
        const dateObj = new Date();
        const date = dateObj.getDate();
        const month = dateObj.getMonth();
        const year = dateObj.getFullYear();
        return `${year}-${month}-${date}`;
    }
}
