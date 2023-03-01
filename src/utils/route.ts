import { _Block } from "./_Block";

const REGISTERED_ROUTE: Record<string, typeof _Block> = {};
 
export default function routeUse(route: string): void {

    const root = document.querySelector("#app")!;
    const PageClass = REGISTERED_ROUTE[route];
    const page = new PageClass({});

    // currentpage unmout
    root.innerHTML = '';
    root.appendChild(page.getElement()!);
    page.dispatchComponentDidMount();
}

export function routeRegister(key: string, block: typeof _Block): void {
    REGISTERED_ROUTE[key] = block;
}
