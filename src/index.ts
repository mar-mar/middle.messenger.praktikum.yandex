import registerComponents from "./utils/registerComponents";
import Error404Page from "./pages/error404";
import Error500Page from "./pages/error500";
import IndexPage from "./pages/index";
import LoginPage from "./pages/login";
import ProfilePage from "./pages/profile";
import SignPage from "./pages/sign";
import { _Block } from "./utils/_Block";


import { PAGES_PATHS } from "./utils/Router";
import RouterController from "./controllers/RouterController";
import IndexController from "./controllers/IndexController";


// регистрируем хелперы по компонентам
registerComponents();


window.addEventListener('DOMContentLoaded', async () => {
    RouterController
    .use(PAGES_PATHS.Error404, Error404Page)
    .use(PAGES_PATHS.Error500, Error500Page)
    .use(PAGES_PATHS.Login, LoginPage)
    .use(PAGES_PATHS.Profile, ProfilePage)
    .use(PAGES_PATHS.Sign, SignPage)
    .use(PAGES_PATHS.Messages, IndexPage);

    IndexController.start();
});

