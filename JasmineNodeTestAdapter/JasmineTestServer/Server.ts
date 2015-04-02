import path = require('path');
import TestServer = require('../TestServer/TestServer');
import JsonConnection = require('../TestServer/JsonConnection');
import Specs = require('../TestServer/Specs');
import JasmineLogger = require('./JasmineLogger');
import Settings = require('./Settings');


class Server extends TestServer {
    constructor(name: string, settings: Settings) {
        super(name);

        if (settings.Traits) {
            var traits = settings.Traits.map(trait => typeof trait === 'string' ? { name: trait } : trait);
            this.loadExtensions({ getTraits: (spec, server) => traits });
        }

        if (settings.Extensions) {
            try {
                this.loadExtensions(path.resolve(settings.Extensions));
            } catch (e) {
                this.logger.error('Failed to load extensions from ' + settings.Extensions + ': ' + e.message);
            }
        }

        this.once('listening',() => this.logger.info('Started - port:', this.address.port));
        this.start();
    }

    logger = JasmineLogger('Jasmine Server');

    onError(error: any, connection: JsonConnection) {
        this.logger.error(error);
    }

    testRunStarted(): void {
        this.logger.info('Test run start');
        super.testRunStarted();
    }

    testRunCompleted(specs: Specs.Spec[]): void {
        this.logger.info('Test run complete');
        super.testRunCompleted(specs);
    }
}

export = Server;
