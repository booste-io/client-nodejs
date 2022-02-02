export declare function runMain(apiKey: string, modelKey: string, modelInputs?: object, strategy?: object): Promise<object>;
export declare function startMain(apiKey: string, modelKey: string, modelInputs?: object, strategy?: object): Promise<string>;
export declare function feedback(apiKey: string, callID: string, feedback?: object): Promise<object>;
export declare function checkMain(apiKey: string, callID: string): Promise<object>;
