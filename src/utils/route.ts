import { _Block } from "./_Block";

const ROUTE_1: Record<string, typeof _Block> = {};
 
export default function routeUse(route: string): void {

    const root = document.querySelector("#app")!;
    const PageClass = ROUTE_1[route];
    const page = new PageClass({});

    // currentpage unmout
    root.innerHTML = '';
    root.appendChild(page.getElement()!);
    page.dispatchComponentDidMount();
}

export function routeRegister(key: string, block: typeof _Block): void {
    ROUTE_1[key] = block;
}
