import { _Block } from "./_Block";

const ROUTES: Record<string, typeof _Block> = {};
 
export default function routeUse(route: string) {

    const root = document.querySelector("#app")!;
    const PageClass = ROUTES[route];
    const page = new PageClass({});

    // currentpage unmout
   // root.innerHTML = '';
    root.appendChild(page.getElement()!);
    //page.dispatchComponentDidMount();
}

export function routeRegister(key: string, block: typeof _Block) {
    ROUTES[key] = block;
}
