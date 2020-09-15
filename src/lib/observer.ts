export type Callback<T> = (value: T) => void;

export type CallbackRemover = () => void;

export class Observable<T> {

    private observers: Set<Callback<T>>;
    private value: T;

    constructor(initialValue: T) {
        this.observers = new Set();
        this.value = initialValue;
    }

    public setValue(newValue: T) {
        this.value = newValue;

        for (const cb of new Set(this.observers)) {
            cb(newValue);
        }
    }

    public getValue(): T {
        return this.value;
    }

    public observe(callback: Callback<T>): CallbackRemover {
        if (this.observers.has(callback)) return () => {};

        this.observers.add(callback);
        callback(this.value);

        return () => {
            this.observers.delete(callback);
        };
    }

}
