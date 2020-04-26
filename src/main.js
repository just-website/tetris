import Model from './Model';

class Interface {
    constructor(options) {
        this.model = new Model({
            size: options.size,
        });
        if (!Interface._instance)
        {
            Interface._instance = this;
        }
        return Interface._instance;
    }
}

export default Interface;