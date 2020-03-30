export class Game {
    public title: string;
    public id: number;
    public description: string;
    public gameSource: string;
    public imagePath: string;
    public price: number;
    public currency: string;

    constructor(
        id: number,
        title: string,
        imagePath: string,
        desc: string,
        gameSource: string,
        price?: number,
        currency?: string) {
            this.id = id;
            this.title = title;
            this.imagePath = imagePath;
            this.description = desc;
            this.price = price;
            this.currency = currency;
            this.gameSource = gameSource;
    }
}
