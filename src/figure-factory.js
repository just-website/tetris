class FigureFactory {
    constructor() {
        this.figures = [
            [
                ['1', '1', '1'],
                [null, '1', null],
                [null, null, null]
            ],
            [
                ['2', null, null],
                ['2', '2', '2'],
                [null, null, null]
            ],
            [
                [null, null, '3'],
                ['3', '3', '3'],
                [null, null, null]
            ],
            [
                ['4', '4', null],
                [null, '4', '4'],
                [null, null, null]
            ],
            [
                [null, '5', '5'],
                ['5', '5', null],
                [null, null, null]
            ],
            [
                [null, null, null,null],
                ['6', '6', '6', '6'],
                [null, null, null,null],
                [null, null, null,null]
            ],
            [
                ['7', '7'],
                ['7', '7']
            ]
        ]
    }

    createRandomFigure() {
        function randomInteger(min, max) {
            const random = min + Math.random() * (max + 1 - min);
            return Math.floor(random);
          }
        const randomFigure = this.figures[randomInteger(0, this.figures.length - 1)];
        return [...randomFigure.map( row => [...row])];
    }

}

export default FigureFactory;