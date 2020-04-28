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
				if (this._canMove('right')) {
					this._currentFigure.x += 1;
				}
				break;

			case 'left':
				if (this._canMove('left')) {
					this._currentFigure.x -= 1;
				}
				break;

			case 'down':
				if (this._canMove('down')) {
					this._currentFigure.y += 1;
				}
				break;
		
			default:
				break;
		}
	}

	isEmptyField({x, y}) {
		return !!(this.field[y] && (this.field[y][x] === 0));
	}

	_canMove(direction) {
		const {x: currentX, y: currentY, blocks: figure} = this._currentFigure;
		switch(direction) {
			case 'right':
				for (let row = 0; row < figure.length; row++) {
					let hasCollision = figure[row].some((value, index) => {
						return value && !this.isEmptyField({x: currentX + index + 1, y: currentY})
					});
					if (hasCollision) {
						return false
					}
				}
				return true;

			case 'left':
				for (let row = 0; row < figure.length; row++) {
					let hasCollision = figure[row].some((value, index) => {
						return value && !this.isEmptyField({x: currentX + index - 1, y: currentY})
					});
					if (hasCollision) {
						return false;
					}
				}
				return true;

			case 'down':
				for (let row = figure.length - 1; row >= 0; row--) {
					let hasCollision = figure[row].some((value, index) => {
						return value && !this.isEmptyField({x: currentX + index, y: currentY + row + 1})
					});
					if (hasCollision) {
						return false;
					}
				}
				return true;

			default:
				break;
		}
	}

    _createEmptyField({x, y}) {
        const createEmptyRow = (length) => {
            return new Array(length).fill(0);
        }
        return [...Array(y)].map(() => createEmptyRow(x));
	}
	
	_drawFigure() {
		const {x, y, blocks} = this._currentFigure;
		blocks.forEach( (row, rowIndex) => {
			row.forEach( (element, elementIndex) => {
				if (element) {
					this.field[rowIndex + y][elementIndex + x] = '1';
				}
			})
		})
	}

}

export default Model;