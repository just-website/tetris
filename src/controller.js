import Model from './Model';
import View from './view';

class Controller {
    constructor(options) {
        this.model = new Model({
            size: options.size,
        });
        this.view = new View(options);

        this.view.bindResumeGame(() => {
            this.model.gameState = 'active';
        })

        this.view.bindMoveLeft(() => {
            this.model.moveActiveFigure('left');
        })
        
        this.view.bindMoveRight(() => {
            this.model.moveActiveFigure('right')
        })
        
        this.view.bindMoveDown(() => {
            this.model.clearDownInterval();
            this.model.moveActiveFigure('down');
        })
        
        this.view.bindRotateRight(() => {
            this.model.rotateActiveFigure('right');
        })
        
        this.view.bindKeyupDownButton(() => {
            this.model.startMoveDownInterval();
        })
        
        this.model.bindFieldUpdate( (field) => {
            this.view.render(field);
        })
        
        this.model.bindTotalScoreUpdate( (score) => {
            this.view.updateTotalScore(score);
        })
        
        this.model.bindLevelUpdate( (level) => {
            this.view.updateLevel(level);
        })
        
        this.model.bindNextFigureUpdate( (figure) => {
            this.view.renderNextFigure(figure);
        })
        
        this.model.bindGameStateUpdate( (state, data = {}) => {
            this.view.renderStateModal(state, data);
        })
    }
}

export default Controller;