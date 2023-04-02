import RouterController from "../controllers/RouterController";
import { PAGES_PATHS } from "./Router";
import { _Block } from "./_Block";

export const REGISTERED_ROUTE: Record<string, typeof _Block> = {};
export const REGISTERED_TESTDATA: Record<string, any> = {};
 

export {PAGES_PATHS as PAGES};



export default function routeUse(route: string): void {
    RouterController.go(route);
//const root = document.querySelector("#app")!;
   // const PageClass = REGISTERED_ROUTE[route];
    //const page = new PageClass({ item: REGISTERED_TESTDATA[route] });

    // currentpage unmout
  //  root.innerHTML = '';
   // root.appendChild(page.getElement()!);
   // page.dispatchComponentDidMount();
}
/*
export function routeRegister(key: string, block: typeof _Block, testData: any): void {
    REGISTERED_ROUTE[key] = block;
    REGISTERED_TESTDATA[key] = testData;
}*/
