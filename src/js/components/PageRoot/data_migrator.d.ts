declare class DataMigrator {
    constructor(ref: firebase.database.Reference);
    migrate(): void;
}

export default DataMigrator;
