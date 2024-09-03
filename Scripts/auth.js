export class DataKeeper {
    static _Data;
    constructor() {
        if (DataKeeper.instance) {
            return DataKeeper.instance;
        }
        DataKeeper.instance = this;
    }

    set Data(data) {
        this._Data = data;
    }

    static getInstance() {
        if (!DataKeeper.instance) {
            DataKeeper.instance = new DataKeeper();
        }
        return DataKeeper.instance;
    }

    get Data() {
        return this._Data;
    }

    showData(instance) {
        console.log(`Instance: ${instance}`);
        console.log(`Data: ${DataKeeper._Data}`);
    }
}

// let instance1 = DataKeeper.getInstance();
// DataKeeper.Data = 'Hassan';

// console.log("Instance 1:-");
// instance1.showData(instance1);

// console.log(`Instance 2:`);
// DataKeeper.Data = "Ali";
// let instance2 = DataKeeper.getInstance();
// instance2.showData(instance2);




// let instance3 = DataKeeper.getInstance();
// console.log(`Instance 3: ${instance3.Data}`);
