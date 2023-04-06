import RouterController from "../controllers/RouterController";
import { PAGES_PATHS } from "./Router";
import { _Block } from "./_Block";

export const REGISTERED_ROUTE: Record<string, typeof _Block> = {};
export const REGISTERED_TESTDATA: Record<string, any> = {};
 
export {PAGES_PATHS as PAGES};

export default function routeUse(route: string): void {
    RouterController.go(route);
}
