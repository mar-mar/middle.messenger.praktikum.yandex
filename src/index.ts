import { PAGES, routeRegister } from "./utils/route";
import  routeUse from "./utils/route";
import Error404Page from "./pages/error404";
import Error500Page from "./pages/error500";
import IndexPage from "./pages/index";
import LoginPage from "./pages/login";
import ProfilePage from "./pages/profile";
import SignPage from "./pages/sign";
import { _Block } from "./utils/_Block";

const ROUTES: Record<string, typeof _Block > = {
    [PAGES.Error404]: Error404Page,
    [PAGES.Error500]: Error500Page,
    [PAGES.Login]: LoginPage,
    [PAGES.Profile]: ProfilePage,
    [PAGES.Sign]: SignPage,
    [PAGES.Index]: IndexPage
};


import { registerComponent } from "./utils/registerComponents";
// без ts-ignore не работает, ts не понимает такие импорты, это фича от parcel (@parcel/resolver-glob)
// @ts-ignore 
import componentsModules from "./**/components/*/index.ts";
// @ts-ignore
import layoutModules from "./**/layout/*/index.ts";
// @ts-ignore
import modulesModules from "./**/modules/*/index.ts";
// @ts-ignore
import testData from ".././testData/*.json";

//const testData = {};

Object.entries(ROUTES).forEach(([key, PageClass]) => {
    routeRegister(key, PageClass, testData[key]);
});

const register = function registerReq(modules: Record<string, any>, type: string, path: string[]): void{
    Object.entries(modules).forEach(([name, module]) => {
        const currentPath = [...path];
        currentPath.push(name);

        if ((module as any).default) {
            currentPath.splice(-1, 0, type);
            registerComponent(currentPath.join("_"), (module as any).default);
            console.info(currentPath.join("_"));
        }
        else {
            
            registerReq(module, type, currentPath);
        }
    });
}

register(componentsModules, "components", []);
register(layoutModules, "layout", []);
register(modulesModules, "modules", []);

window.addEventListener('DOMContentLoaded', async () => {
    //routeUse("sign");
    routeUse(PAGES.Index);
});


/*
,
  /*"validators": {
    "*.{ts, tsx}": ["@parcel/validator-typescript"]
  }

*/
