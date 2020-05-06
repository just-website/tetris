import Controller from './controller';

class Interface {
    constructor(options) {
        this.controller = new Controller(options);
        if (!Interface._instance)
        {
            Interface._instance = this;
        }
        return Interface._instance;
    }
}

export default Interface;