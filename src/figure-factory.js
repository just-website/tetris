class FigureFactory {
    constructor() {
        this.figures = [
            [
                [1, 0, 0],
                [1, 0, 0],
                [1, 1, 0]
            ],
            [
                [1, 1, 1],
                [0, 1, 0],
                [0, 0, 0]
            ],
            [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0]
            ],
            [
                [1, 1, 0],
                [1, 1, 0],
                [0, 0, 0]
            ]
        ]
    }
    createRandomFigure() {
        function randomInteger(min, max) {
            const random = min + Math.random() * (max + 1 - min);
            return Math.floor(random);
          }
        const randomFigure = this.figures[randomInteger(0, this.figures.length - 1)];
        return [...randomFigure];
    }

}

export default FigureFactory;