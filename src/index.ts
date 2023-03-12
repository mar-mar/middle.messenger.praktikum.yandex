import registerComponents from "./utils/registerComponents";
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
import { PAGES_PATHS } from "./utils/Router";
import RouterController from "./controllers/RouterController";
import IndexController from "./controllers/IndexController";

/*const ROUTES: Record<string, typeof _Block > = {
    [PAGES_PATHS.Error404]: Error404Page,
    [PAGES_PATHS.Error500]: Error500Page,
    [PAGES_PATHS.Login]: LoginPage,
    [PAGES_PATHS.Profile]: ProfilePage,
    [PAGES_PATHS.Sign]: SignPage,
    [PAGES_PATHS.Index]: IndexPage
};*/

// регистрируем хелперы по компонентам
registerComponents();

// регистрируем страницы
//Object.entries(ROUTES).forEach(([key, PageClass]) => {
   // routeRegister(key, PageClass, testData[key]);
//});


window.addEventListener('DOMContentLoaded', async () => {
    RouterController
    .use(PAGES_PATHS.Error404, Error404Page)
    .use(PAGES_PATHS.Error500, Error500Page)
    .use(PAGES_PATHS.Login, LoginPage)
    .use(PAGES_PATHS.Profile, ProfilePage)
    .use(PAGES_PATHS.Sign, SignPage)
    .use(PAGES_PATHS.Index, IndexPage);

    IndexController.start();
});

