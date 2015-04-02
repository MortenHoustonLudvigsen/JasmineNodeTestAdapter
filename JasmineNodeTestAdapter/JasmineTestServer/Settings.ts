import Specs = require('../TestServer/Specs');

interface Settings {
    BasePath: string;
    Helpers: string[];
    Specs: string[];
    Watch: string[];
    BatchInterval: number;
    Traits: (string|Specs.Trait)[];
    Extensions?: string;
}

export = Settings; 