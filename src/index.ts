import { routeRegister } from "./utils/route";
import  routeUse from "./utils/route";
import Error404Page from "./pages/error404";
import Error500Page from "./pages/error500";
import HomePage from "./pages/home";
import IndexPage from "./pages/index";
import LoginPage from "./pages/login";
import ProfilePage from "./pages/profile";
import SignPage from "./pages/sign";
import { _Block } from "./utils/_Block";

const ROUTES: Record<string, typeof _Block> = {
    home: HomePage,
    error404: Error404Page,
    error500: Error500Page,
    login: LoginPage,
    profile: ProfilePage,
    sign: SignPage,
    index: IndexPage
};


import { registerComponent } from "./utils/registerComponents";
// @ts-ignore
import componentsModules from "./**/components/**/index.ts";
// @ts-ignore
import layoutModules from "./layout/**/index.ts";
// @ts-ignore
import pageModules from "./page/**/index.ts";



Object.entries(ROUTES).forEach(([key, PageClass]) => {
    routeRegister(key, PageClass);
});



const register = function registerReq(modules: Record<string, any>, path: string[]): void{
    Object.entries(modules).forEach(([name, module]) => {
        const currentPath = [...path];
        
        if ((module as any).default) {
            currentPath.push(name);
            registerComponent(currentPath.join("_"), (module as any).default);
            console.info(currentPath.join("_"));
        }
        else {
            currentPath.splice(-1, 0, name);
            registerReq(module, currentPath);
        }
    });
}


register(componentsModules, ["components"]);
register(layoutModules, ["layout"]);
register(pageModules, ["page"]);

window.addEventListener('DOMContentLoaded', async () => {
   routeUse("index");
});


/*

,
  /*"validators": {
    "*.{ts, tsx}": ["@parcel/validator-typescript"]
  }

*/
