import FigureFactory from './figure-factory';

class Model {
    constructor(options) {
		this.figureFactory = new FigureFactory();
		this.fieldSize = options.size;
		this.options = options;
        this.level = 1;
		this._score = 0;
		this._gameState = 'ready';
        this.field = [];
		this.nextFigure = [];
		this.activeFigure = [];
	}

	set score(value) {
		this._score = value;
		if (this.score > this.level * 1000) {
			this.level = Math.floor(this.score / 1000) + 1;
			this.onLevelUpdate(this.level);
			this.startMoveDownInterval();
		}
	}

	get score() {
		return this._score;
	}

	set gameState(value) {
		if (this.gameState === 'game over' || this.gameState === 'ready') {
			this.restartGame();
		}
		this._gameState = value;
		this.onGameStatepdate(value, {totalScore: this.score});
		if (this.gameState === 'active') {
			this.clearDownInterval();
			this.startMoveDownInterval();
		} else {
			this.clearDownInterval();
		}
	}

	get gameState() {
		return this._gameState;
	}
	
	bindFieldUpdate(callback) {
		this.onFieldUpdate = callback;	
	}
	
	bindTotalScoreUpdate(callback) {
		this.onTotalScoreUpdate = callback;	
	}
	
	bindLevelUpdate(callback) {
		this.onLevelUpdate = callback;	
	}
	
	bindGameStateUpdate(callback) {
		this.onGameStatepdate = callback;	
		this.onGameStatepdate(this.gameState)
	}
	
	bindNextFigureUpdate(callback) {
		this.onNextFigure = callback;	
	}

	restartGame() {
		this.level = 1;
		this._score = 0;
		this._gameState = 'ready';
        this.field = this._createEmptyField({
			x: this.fieldSize.rows || 10, 
			y: this.fieldSize.columns || 20
		});
		this.nextFigure = this._createFigure();
		this.activeFigure = this._createFigure();
		this.onNextFigure(this.nextFigure.blocks);
		this.onTotalScoreUpdate(this.score);
		this.onLevelUpdate(this.level);
	}

	startMoveDownInterval() {
		if (this.gameState !== 'active') {
			return;
		}
		this.onFieldUpdate(this.getDataState())
		if (this.moveDownInterval) {
			clearInterval(this.moveDownInterval);
		}
		const speed = 1000 - this.level * 50;
		this.moveDownInterval = setInterval( () => {
			this.moveActiveFigure('down');
		}, speed > 50 ? speed : 50);
	}

	clearDownInterval() {
		if (this.moveDownInterval) {
			clearInterval(this.moveDownInterval);
		}
	}

	nextMove() {
		this.activeFigure = {...this.nextFigure};
		this.nextFigure = this._createFigure();
		this.onNextFigure(this.nextFigure.blocks);
		if (this._hasCollision(this.activeFigure)) {
			this.gameState = 'game over';
		}
		
	}

	rotateActiveFigure(direction) {
		if (this.gameState !== 'active') {
			return;
		}
		let temp = {...this.activeFigure};
		switch (direction) {
			case 'left':
				temp.blocks = temp.blocks.map( (row, indexRow) => {
					return row.map( (block, indexBlock) => {
						return temp.blocks[indexBlock][indexRow];
					})
				}).reverse();
				if (!this._hasCollision(temp)) {
					this.activeFigure = temp;
				}
				break;
			case 'right':
				temp.blocks = temp.blocks.map( (row, indexRow) => {
					return row.map( (block, indexBlock) => {
						return temp.blocks[indexBlock][indexRow];
					}).reverse();
				});
				if (!this._hasCollision(temp)) {
					this.activeFigure = temp;
				}
				break;
		}
		this.onFieldUpdate(this.getDataState());
	}
	
	moveActiveFigure(direction) {
		if (this.gameState !== 'active') {
			return;
		}
		let temp;
		switch (direction) {
			case 'right':
				temp = {...this.activeFigure, x: this.activeFigure.x + 1};
				if (!this._hasCollision(temp)) {
					this.activeFigure = temp;
					this.activeFigure;
				}
				break;

			case 'left':
				temp = {...this.activeFigure, x: this.activeFigure.x - 1};
				if (!this._hasCollision(temp)) {
					this.activeFigure = temp;
				}
				break;

			case 'down':
				temp = {...this.activeFigure, y: this.activeFigure.y + 1};
				if (!this._hasCollision(temp)) {
					this.activeFigure = temp;
				} else {
					this._fixate(this.field, this.activeFigure);
					this._clearFullRows();
					this.nextMove();
				}
				break;
		}
		this.onFieldUpdate(this.getDataState());
	}

	getDataState() {
		const fieldCopy = {
			field: this.field.map( row => row.map( element => element))
		};
		this._fixate(fieldCopy.field, this.activeFigure);
		return fieldCopy;
	}

	isEmptyField({x, y}) {
		return !!(this.field[y] && (this.field[y][x] === null));
	}

	_hasCollision({x, y, blocks: figure}) {
		for (let row = 0; row < figure.length; row++) {
			let isCollision = figure[row].some((value, index) => {
				return value && !this.isEmptyField({x: x + index , y: y + row});
			});
			if (isCollision) {
				return true;
			}
		}
		return false;
	}

	_createEmptyRow = (length) => {
		return new Array(length).fill(null);
	}

    _createEmptyField({x, y}) {
        return [...Array(y)].map(() => this._createEmptyRow(x));
	}

	_fixate(field, figure) {
		const {x, y, blocks} = figure;
		blocks.forEach( (row, rowIndex) => {
			row.forEach( (element, elementIndex) => {
				if (element) {
					field[rowIndex + y][elementIndex + x] = element;
				}
			})
		})
	}
	
	_createFigure() {
		const field_width = this.options.size.rows;
		const figure_blocks = this.figureFactory.createRandomFigure();
		const figure = {
            x: Math.floor(field_width / 2) - Math.floor(figure_blocks.length / 2),
            y: 0,
            blocks: figure_blocks
		}
		return figure;
	}

	_isRowFull(row) {
		return row.every( block => block);
	}

	_clearFullRows() {
		let lineCouneter = 0;
		this.field = this.field.filter( row => {
			if (this._isRowFull(row)) {
				lineCouneter += 1;
				return false;
			} else {
				return row;
			}
		});
		for(let i = 0; i < lineCouneter; i++) {
			const emptyRow = this._createEmptyRow(this.fieldSize.rows);
			this.field.unshift(emptyRow);
		}
		this.score += this._calcScore(lineCouneter);
		this.onTotalScoreUpdate(this.score);
	}

	_calcScore(lines) {
		const pointsPerLine = 50;
		const levelCoeff = this.level / 10 + 0.9;
		const result = Math.floor(pointsPerLine * (lines * lines) * levelCoeff);
		return result;
	}
}

export default Model;