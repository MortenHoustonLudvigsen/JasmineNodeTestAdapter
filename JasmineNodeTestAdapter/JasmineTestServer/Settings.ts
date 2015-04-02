import Specs = require('../TestServer/Specs');

interface Settings {
    BasePath: string;
    Helpers: string[];
    Specs: string[];
    Watch: string[];
    Traits: (string|Specs.Trait)[];
    Extensions: string;
}

export = Settings; 