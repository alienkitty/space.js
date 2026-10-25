import type { Interface } from './Interface.js';

export interface RouterPage extends Interface {
    animateIn?: () => void;
    animateOut?: () => void;
    (...args: any[]): any;
}

export interface RouterTransition {
    animateIn: () => void;
    animateOut: () => void;
}

export interface RouterPathData {
    object: ReturnType<RouterPage> | ((data: any) => void),
    data: any
}

export interface RouterInitOptions {
    path: string,
    page: ReturnType<RouterPage>,
    transition: RouterTransition,
    // https://developer.mozilla.org/en-US/docs/Web/API/History/scrollRestoration
    scrollRestoration: 'auto' | 'manual'
}

/**
 * A page transition router with pages created from a given constructor or function.
 *
 * @example
 * // ...
 * router.add('/', Home);
 * router.add('/about', About);
 * router.add('/projects', Article);
 * router.add('404', NotFound);
 *
 * router.init({
 *     path: basePath,
 *     page: document.querySelector('main'),
 *     transition: new Transition()
 * });
 *
 * // ...
 * router.setPath('/about');
 *
 * @example
 * // ...
 * router.add(path, object, data);
 *
 * router.init({
 *     path: basePath,
 *     scrollRestoration: 'auto'
 * });
 *
 * @example
 * router.add('/test_router.html', onPage, { title: 'Home' });
 *
 * router.init({
 *     path: '/examples',
 *     scrollRestoration: 'auto'
 * });
 *
 * function onPage({ title }) {
 *     document.title = `${title} — Alien Kitty`;
 * }
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/utils/Router.js | Source}
 */
export class Router {
    routes: Map<string, RouterPathData>;

    path: string | null;
    page?: ReturnType<RouterPage> | null;
    transition?: RouterTransition | null;

    firstPage: boolean;
    nextPage: RouterPathData | null;
    isTransitioning: boolean;

    constructor();

    replacePage(nextPage: RouterPathData): void;

    transitionPage(): void;

    addListeners(): void;

    onPopState: () => void;

    init(options?: Partial<RouterInitOptions>): void;

    add(path: string, object: ReturnType<RouterPage> | ((data: any) => void), data?: any): void;

    get(path: string): RouterPathData;

    getPath(path: string): string;

    setPath(path: string): void;
}

export const router: Router;
