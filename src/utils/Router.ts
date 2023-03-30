import { _Block } from "./_Block";

export enum PAGES_PATHS {
    Error404 = "/error404",
    Error500 = "/error500",
    Login = "/",
    Profile = "/settings",
    Sign = "/sign-up",
    Index = "/messenger",
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

    root.innerHTML = '';
    root.appendChild(block.getElement()!);
    return root;
}

class Route {
    private block: _Block | null = null;

    constructor(
        private pathname: string,
        private readonly blockClass: typeof _Block,
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

            this.block = new this.blockClass({});
        }
        
        render(this.query, this.block);
        this.block.dispatchComponentDidMount();
    }
}

class Router {
    private static __instance: Router;
    private routes: Route[] = [];
    private currentRoute: Route | null = null;
    private history = window.history;

    // rootQuery - root domNode приложения
    constructor(private readonly rootQuery: string) {
        if (Router.__instance) {
            return Router.__instance;
        }

        this.routes = [];

        Router.__instance = this;
    }

    // добавляет информацию о "путь/класс страницы" в роутер
    // чтобы по пути показывать страницу
    public use(pathname: string, block: typeof _Block) {
        const route = new Route(pathname, block, this.rootQuery);
        this.routes.push(route);

        return this;
    }

    // go
    public go(pathname: string) {
        if (window.location.pathname !== pathname) {
            this.history.pushState({}, '', pathname);
        }

        this.onChangeRoute(pathname);
    }

    // back
    public back() {
        this.history.back();
    }

    // forward
    public forward() {
        this.history.forward();
    }
 
    // то же по сути инициализация
    public start(pathname: string) {

        window.onpopstate = (event: PopStateEvent) => {
            const target = event.currentTarget as Window;

            this.onChangeRoute(target.location.pathname);
        }

        this.go(pathname);
    }

    private onChangeRoute(pathname: string) {
        let route = this.getRoute(pathname);

        if (!route) {
            
            route = this.getRoute(PAGES_PATHS.Error404);
            if (!route) return;
        }

        if (this.currentRoute && this.currentRoute !== route) {
            this.currentRoute.leave();
        }

        this.currentRoute = route;

        route.render(); // добавляем в root domNode приложения
    }

    private getRoute(pathname: string) {
        return this.routes.find(route => route.match(pathname));
    }
}

export default new Router('#app');
