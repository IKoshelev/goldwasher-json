declare type testFn<T> = (current: T) => boolean;
export declare function goldwash<T extends object>(initial: T, testFn: testFn<T>): T;
export {};
