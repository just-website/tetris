class View {
    constructor(options) {
        this.options = options;
        this.blockSize = options.size.block;
        this.rootElement = options.rootElement;
        this.nextFigureElement = options.nextFigure;
        this.scoreField = options.scoreField;
        this.levelField = options.levelField;
        this.modal = options.modal;
        this.modalsize = options.size.modal;
        this.fieldWidth = options.size.rows * this.blockSize;
        this.fieldHeight = options.size.columns * this.blockSize;
        this.fieldContext = this._setEmptyFieldContext();
        this.nextFigureContext = this._setEmptyFigureContext();
        this.modalContext = this._setEmptyModalContext();
        this.colors = {
            '1': '#FF851B',
            '2': '#FF4136',
            '3': '#B10DC9',
            '4': '#0074D9',
            '5': '#2ECC40',
            '6': '#FFDC00',
            '7': '#00CED1'
        }
    }

    bindMoveLeft(callback) {
        document.addEventListener('keydown', (event) => {
            if (event.keyCode == '37') {
                callback();
            }
        })
    }

    bindResumeGame(callback) {
        document.addEventListener('keydown', (event) => {
            if (event.keyCode == '13') {
                callback();
            }
        })
    }

    bindMoveRight(callback) {
        document.addEventListener('keydown', (event) => {
            if (event.keyCode == '39') {
                callback();
            }
        })
    }

    bindMoveDown(callback) {
        document.addEventListener('keydown', (event) => {
            if (event.keyCode == '40') {
                callback();
            }
        })
    }

    bindKeyupDownButton(callback) {
        document.addEventListener('keyup', (event) => {
            if (event.keyCode == '40') {
                callback();
            }
        })
    }

    bindRotateRight(callback) {
        document.addEventListener('keydown', (event) => {
            if (event.keyCode == '38') {
                callback();
            }
        })
    }

    render({field}, context = this.fieldContext) {
        context.clearRect(0, 0, this.fieldWidth, this.fieldHeight);
        field.forEach( (row, rowIndex) => {
            row.forEach((block, blockIndex) => {
                if(block) {
                    this._renderBlock({x: blockIndex, y: rowIndex, type: block}, context);
                }
            });
        });
    }

    updateTotalScore(totalScore) {
        this.scoreField.innerHTML = totalScore;
    }

    updateLevel(level) {
        this.levelField.innerHTML = level;
    }

    renderNextFigure(nextFigure) {
        this.render({field: nextFigure}, this.nextFigureContext);
    }

    _renderBlock({x, y, type}, context) {
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.strokeRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
        context.fillStyle = this.colors[type];
        context.fillRect(x * this.blockSize + 1, y * this.blockSize + 1, this.blockSize - 2, this.blockSize - 2);
        context.stroke();
    }

    _setEmptyFieldContext() {
        this.rootElement.querySelector('#field').innerHTML = `
            <canvas width="${this.fieldWidth}" height="${this.fieldHeight}"></canvas>
            
        `;
        const fieldElement = document.getElementById('field').querySelector('canvas');
        return fieldElement.getContext('2d');
    }

    _setEmptyFigureContext() {
        this.nextFigureElement.innerHTML = `
            <canvas width="${this.blockSize * 5}" height="${this.blockSize * 5}"></canvas>
            
        `;
        const figureElement = this.nextFigureElement.querySelector('canvas');
        return figureElement.getContext('2d');
    }

    _setEmptyModalContext() {
        const modalElement = this.modal.querySelector('canvas');
        const modalContext =  modalElement.getContext('2d');
        
        return modalContext;
    }

    renderStateModal(state, data) {
        switch (state) {
            case 'active': {
                if (this.modalContext.interval) {
                    clearInterval(this.modalContext.interval)
                }
                this.modalContext.clearRect(0, 0, this.modalsize.x, this.modalsize.y);
                this.modal.style.display = 'none';
                break;
            }
                
            case 'ready': {
                let isText = true;
                const textLine1 = 'Press ENTER';
                const textLine2 = 'to start the game';
                this.modal.style.display = 'flex';
                this.modalContext.font = '16px "Press Start 2P"';
                this.modalContext.fillStyle = "white"
                
                this.modalContext.interval = setInterval( () => {
                    if (isText) {
                        this.modalContext.fillText(textLine1, this._calcPadding(300, textLine1, this.modalContext), 50);
                        this.modalContext.fillText(textLine2, this._calcPadding(300, textLine2, this.modalContext), 75);
                    } else {
                        this.modalContext.clearRect(0, 0, this.modalsize.x, this.modalsize.y)
                    }
                    isText =! isText;
                }, 1000)
                break;
            }

            case 'game over': { 
                let isText = true;
                const textLine1 = 'GAME OVER';
                const textLine2 = 'Your total score:';
                const textLine3 = data.totalScore || '0';
                const textLine4 = 'Press ENTER';
                const textLine5 = 'to start the game';
                this.modal.style.display = 'flex';
                this.modalContext.font = '16px "Press Start 2P"';
                this.modalContext.fillStyle = "white";
                this.modalContext.fillText(textLine1, this._calcPadding(300, textLine1, this.modalContext), 50);
                this.modalContext.fillText(textLine2, this._calcPadding(300, textLine2, this.modalContext), 75);
                this.modalContext.fillText(textLine3, this._calcPadding(300, textLine3, this.modalContext), 110);

                this.modalContext.interval = setInterval( () => {
                    if (isText) {
                        this.modalContext.fillText(textLine4, this._calcPadding(300, textLine4, this.modalContext), 145);
                        this.modalContext.fillText(textLine5, this._calcPadding(300, textLine5, this.modalContext), 170);
                    } else {
                        this.modalContext.clearRect(0, 125, this.modalsize.x, this.modalsize.y)
                    }
                    isText =! isText;
                }, 1000)
                break;
            }
        }
    }

    _calcPadding(width, text, context) {
        const textWidth = context.measureText(text).width;
        return (width - textWidth) / 2;
    }
}

export default View;