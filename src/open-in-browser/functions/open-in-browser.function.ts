import { actions } from "../constants/actions.constant";
import { executeNodeScript } from "./execute-node-script.function";
import { getBrowserEnv } from "./get-browser-env.function";
import { startBrowserProcess } from "./start-browser-process.function";

export function openInBrowser(url) {
    const { action, value } = getBrowserEnv();
    switch (action) {
        case actions.NONE:
            // Special case: BROWSER="none" will prevent opening completely.
            return false;
        case actions.SCRIPT:
            return executeNodeScript(value, url);
        case actions.BROWSER:
            return startBrowserProcess(value, url);
        default:
            throw new Error("Not implemented.");
    }
}
