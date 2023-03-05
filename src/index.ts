import { PAGES, routeRegister } from "./utils/route";
import registerComponents from "./utils/registerComponents";
import  routeUse from "./utils/route";

import Error404Page from "./pages/error404";
import Error500Page from "./pages/error500";
import IndexPage from "./pages/index";
import LoginPage from "./pages/login";
import ProfilePage from "./pages/profile";
import SignPage from "./pages/sign";
import { _Block } from "./utils/_Block";

// без ts-ignore не работает, ts не понимает такие импорты, это фича от parcel (@parcel/resolver-glob)
// @ts-ignore
import testData from ".././testData/*.json";

const ROUTES: Record<string, typeof _Block > = {
    [PAGES.Error404]: Error404Page,
    [PAGES.Error500]: Error500Page,
    [PAGES.Login]: LoginPage,
    [PAGES.Profile]: ProfilePage,
    [PAGES.Sign]: SignPage,
    [PAGES.Index]: IndexPage
};

// регистрируем хелперы по компонентам
registerComponents();

// регистрируем страницы
Object.entries(ROUTES).forEach(([key, PageClass]) => {
    routeRegister(key, PageClass, testData[key]);
});


window.addEventListener('DOMContentLoaded', async () => {
    routeUse(PAGES.Index);
});

