declare type testFn<T> = (current: T) => boolean;
declare type testFnAsync<T> = (current: T) => Promise<boolean>;
export declare function goldwash<T extends object>(initial: T, testFn: testFn<T>): Partial<T>;
export declare function goldwashAsync<T extends object>(initial: T, testFn: testFnAsync<T>): Promise<Partial<T>>;
export declare function centrifuge<T extends object>(initial: T, testFn: testFn<T>): [T, Partial<T>];
export declare function centrifugeAsync<T extends object>(initial: T, testFn: testFnAsync<T>): Promise<[T, Partial<T>]>;
export {};
