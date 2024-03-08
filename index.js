import axios from "axios";

import { WireMockRestClient } from "wiremock-rest-client";

class WiremockClient extends WireMockRestClient {
    #wiremockBaseUrl = "";

    constructor(_wireMockBaseUrl, logLevel) {
        super(_wireMockBaseUrl, { logLevel });
        this.#wiremockBaseUrl = _wireMockBaseUrl;
    }

    // This method is going to wait for the wiremock server to be up and running
    async waitForIt() {
        const maxTime = 1 * 60 * 1000;
        const start = Date.now();

        while (Date.now() - start <= maxTime) {
            try {
                await axios.get(`${this.#wiremockBaseUrl}/__admin/mappings`);
                console.log(
                    `Mock server was available after ${
                        (Date.now() - start) / 1000
                    } seconds.\n`
                );
                return;
            } catch (err) {
                await new Promise(resolve => setTimeout(resolve, 2 * 1000));
            }
        }

        console.error(
            "Timeout: Mock server wasn't available within the specified time."
        );
    }

    async addMultipleStubs({ stubs }) {
        for (const stub of stubs) {
            await this.mappings.createMapping(stub);
        }
    }
}

module.exports = WiremockClient;
