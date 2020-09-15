import {Result} from "./types";

export default class Results {

    static loadFromDb(db: any): Map<string, Result> {
        const r: Map<string, Result> = new Map();

        for (const resultsKey of Object.keys(db)) {
            const result = Results.loadSingleFromDb(resultsKey, db[resultsKey]);
            if (result) r.set(resultsKey, result);
        }

        return r;
    }

    private static loadSingleFromDb(resultsKey: string, data: any): Result | null {
        // FIXME: validation
        return data;
    }

}
