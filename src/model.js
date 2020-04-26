import FigureFactory from './figure-factory';

class Model {
    constructor(params) {
		this.figureFactory = new FigureFactory();
		this.fieldSize = params.size;
        this.level = 0;
        this.score = 0;
        this.field = this._createEmptyField({x: params.size.x, y: params.size.y})
        this._currentFigure = {
            x: 0,
            y: 0,
            blocks: this.figureFactory.createRandomFigure()
        }
	}
	
	moveCurrentFigure(direction) {
		switch (direction) {
			case 'right':
				const rightSideCord = this._getSideCord('right');
				const fieldLength = this.field[0].length - 1;
				if ((this._currentFigure.x + rightSideCord) < fieldLength) {
					this._currentFigure.x += 1;
				}
				break;

			case 'left':
				const leftSideCord = this._getSideCord('left');
				if (this._currentFigure.x - leftSideCord > 0) {
					this._currentFigure.x -= 1;
				}
				break;

			case 'down':
				const bottomSideCord = this._getSideCord('bottom');
				const fieldHeight = this.field.length - 1;
				if ((this._currentFigure.y + bottomSideCord) < fieldHeight) {
					this._currentFigure.y += 1;
				}
				break;
		
			default:
				break;
		}
	}

	_getSideCord(position) {
		let sideCord = 0;
		let bottomCord = 0;
		this._currentFigure.blocks.forEach( (row, index) => {
			for (let i = 0; i < row.length; i++) {
				if (row[i]) {
					sideCord = row[i];
					bottomCord = index;
					if (position === 'left') {
						return sideCord;
					}
				}
			}
		})
		return position === 'bottom' ? bottomCord : sideCord;
	}

    _createEmptyField({x, y}) {
        const createEmptyRow = (length) => {
            return new Array(length).fill(0);
        }

        return new Array(y).fill(createEmptyRow(x));
    }

}

export default Model;