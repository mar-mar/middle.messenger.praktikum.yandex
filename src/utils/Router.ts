import { _Block, BlockConstructable } from "./_Block";

export enum PAGES_PATHS {
    Error404 = "/error404",
    Error500 = "/error500",
    Login = "/",
    Profile = "/settings",
    Sign = "/sign-up",
    Messages = "/messenger"
}

function isEqual(lhs: string, rhs: string): boolean {
    return lhs === rhs;
}

function render(query: string, block: _Block) {
    const root = document.querySelector(query);

    if (root === null) {
        throw new Error(`root not found by selector "${query}"`);
    }

    root.innerHTML = "";
    const element = block.getElement();

    if (element) root.appendChild(element);
    return root;
}

class Route {
    private block: _Block | null = null;

    constructor(
        private pathname: string,
        private readonly blockClass: BlockConstructable,
        private readonly query: string) {
    }

    leave() {
        
        if (!this.block) return;

        this.block.dispatchComponentDidUnMount();
        this.block = null;
    }

    match(pathname: string) {
        return isEqual(pathname, this.pathname);
    }

    render() {
        if (!this.block) {

            this.block = new this.blockClass({ attachName: "page" });
        }
        
        render(this.query, this.block);
        this.block.dispatchComponentDidMount();
    }
}

export default class Router {
    private routes: Route[] = [];
    private currentRoute: Route | null = null;
    private history: History;

    // rootQuery - root domNode приложения
    constructor(private readonly rootQuery: string,
        private readonly checkPath: (path: string) => string,
        private readonly win: Window = window) {

        this.routes = [];
        this.history = win.history;

        this.win.onpopstate = (_event: PopStateEvent) => {
            this.onChangeRoute(this.win.location.pathname);
        }
    }

    // добавляет информацию о "путь/класс страницы" в роутер
    // чтобы по пути показывать страницу
    public use(pathname: string, block: BlockConstructable) {
        const route = new Route(pathname, block, this.rootQuery);
        this.routes.push(route);

        return this;
    }

    // go
    public go(pathname: string, quick?: boolean) {

        const oldRoute = this.currentRoute;
        const isChange = this.onChangeRoute(pathname, quick);

        if (oldRoute && isChange) {
            this.history.pushState({}, "", pathname);
        }
    }

    // back
    public back() {
        this.history.back();
    }

    // forward
    public forward() {
        this.history.forward();
    }
 
    private onChangeRoute(pathname: string, quick?: boolean) {

        if (!quick) pathname = this.checkPath(pathname);

        let route = this.getRoute(pathname);

        if (!route) {
            
            route = this.getRoute(PAGES_PATHS.Error404);
            if (!route) return false;
        }

        if (this.currentRoute) {
            if (this.currentRoute === route) return false; // мы уже на этой странице

            this.currentRoute.leave();
        }

        this.currentRoute = route;

        route.render(); // добавляем в root domNode приложения
        return true;
    }

    private getRoute(pathname: string) {
        return this.routes.find(route => route.match(pathname));
    }
}
