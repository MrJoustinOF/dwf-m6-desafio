import { initIndex } from "./views/index";
import { initEmpezarPage } from "./views/empezar";
import { initJuego } from "./views/juego";

export function initRouter(root: Element) {
  function goTo(path) {
    history.pushState({}, "", path);
    handleRoute(path);
  }

  function handleRoute(route) {
    const routes = [
      {
        path: "/",
        component: initIndex,
      },
      {
        path: "/empezar",
        component: initEmpezarPage,
      },
      {
        path: "/juego",
        component: initJuego,
      },
    ];

    for (const r of routes) {
      if (r.path === route) {
        const el = r.component({ goTo: goTo });
        root.firstChild?.remove();

        const wrongEl = document.querySelector(".result");

        if (wrongEl !== null && location.pathname.includes("/empezar")) {
          root.removeChild(wrongEl);
        }

        console.clear();
        root.appendChild(el);
      }
    }
  }

  handleRoute(location.pathname);
}
