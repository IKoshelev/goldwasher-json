declare type testFn<T> = (current: T) => boolean;
declare type testFnAsync<T> = (current: T) => Promise<boolean>;
export declare function goldwash<T extends object>(initial: T, testFn: testFn<T>): T;
export declare function goldwashAsync<T extends object>(initial: T, testFn: testFnAsync<T>): Promise<T>;
export {};
