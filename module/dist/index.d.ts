export declare function run(apiKey: string, modelKey: string, modelInputs?: object, strategy?: object): Promise<object>;
export declare function start(apiKey: string, modelKey: string, modelInputs?: object, strategy?: object): Promise<string>;
export declare function feedback(apiKey: string, callID: string, feedback?: object): Promise<object>;
export declare function check(apiKey: string, callID: string): Promise<object>;
