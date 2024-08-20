globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as reactExports } from './_@astro-renderers_Dy_ij9pO.mjs';

const listeners = new Set();
function runListeners() {
    listeners.forEach((listener) => {
        listener();
    });
}
(function (history) {
    function intercept(func) {
        return function (...args) {
            const returnedValue = func.apply(history, args);
            runListeners();
            return returnedValue;
        };
    }
    history.pushState = intercept(history.pushState);
    history.replaceState = intercept(history.replaceState);
    // to handle browser's native backward and forward functionality
    window.addEventListener('popstate', () => {
        runListeners();
    });
})(window.history);
function applyQueryParams(target, queryParams, removeExtras = false) {
    const params = target instanceof URL ? target.searchParams : target;
    if (removeExtras) {
        params.forEach((value, key) => {
            if (!(key in queryParams)) {
                params.delete(key);
            }
        });
    }
    for (const [key, values] of Object.entries(queryParams)) {
        const usableValues = Array.isArray(values) ? values : [values];
        params.delete(key);
        for (const value of usableValues) {
            params.append(key, value !== null && value !== void 0 ? value : '');
        }
    }
    return target;
}
function useQueryParams() {
    const currentLocation = window.location.href;
    const urlSearchParams = reactExports.useMemo(() => {
        return new URLSearchParams(window.location.search);
    }, [currentLocation]);
    const watching = reactExports.useRef({});
    const watchingLength = reactExports.useRef(false);
    const pauseWatch = reactExports.useRef(false);
    // stores both the key and the values as an array
    // of the params that are being watched
    const watch = reactExports.useCallback((key) => {
        if (key in watching.current ||
            pauseWatch.current ||
            watchingLength.current) {
            return;
        }
        watching.current[key] = urlSearchParams.getAll(String(key));
    }, [urlSearchParams, watching]);
    const clearWatch = reactExports.useCallback(() => {
        watching.current = {};
        watchingLength.current = false;
    }, [watching]);
    // React's officially recommended way of forcing a rerender
    const [, increment] = reactExports.useReducer((state) => {
        return state + 1;
    }, 0);
    const rerender = reactExports.useCallback(() => {
        increment();
    }, [increment]);
    // Handles location changes via listener mechanism above.
    const handle = reactExports.useCallback(() => {
        const currentParams = new URLSearchParams(window.location.search);
        let shouldRerender = false;
        let length = 0;
        for (const [key, values] of Object.entries(watching.current)) {
            const currentValues = currentParams.getAll(key);
            if (currentValues.length !== (values === null || values === void 0 ? void 0 : values.length)) {
                shouldRerender = true;
                break;
            }
            // the first mismatched value means we need to rerender
            for (let i = 0; i < currentValues.length; i++) {
                if (currentValues[i] !== values[i]) {
                    shouldRerender = true;
                    break;
                }
            }
            length += 1;
        }
        shouldRerender =
            shouldRerender ||
                (watchingLength.current !== false &&
                    watchingLength.current !== length);
        if (shouldRerender) {
            clearWatch();
            rerender();
            return;
        }
    }, [watching, clearWatch, rerender]);
    reactExports.useEffect(() => {
        // listening on the global window object
        // via interceptions and listeners.
        listeners.add(handle);
        return () => {
            listeners.delete(handle);
        };
    }, [handle]);
    const params = reactExports.useMemo(() => {
        return new Proxy({}, {
            get(target, key) {
                watch(key);
                return urlSearchParams.getAll(key);
            },
            ownKeys(target) {
                const keys = new Set();
                urlSearchParams.forEach((value, key) => {
                    keys.add(key);
                });
                if (!pauseWatch.current) {
                    watchingLength.current = keys.size;
                }
                return [...keys];
            },
            getOwnPropertyDescriptor(target, prop) {
                return { configurable: true, enumerable: true, writable: false };
            },
            has(target, key) {
                watch(key);
                return urlSearchParams.has(key);
            },
        });
    }, [urlSearchParams]);
    const setParams = reactExports.useCallback((nextParams, replace = false) => {
        try {
            const nextURL = new URL(window.location.href);
            pauseWatch.current = true;
            const nextParamsObject = nextParams instanceof Function
                ? nextParams(params)
                : nextParams;
            pauseWatch.current = false;
            applyQueryParams(nextURL, nextParamsObject, true);
            if (replace) {
                window.history.replaceState(null, '', nextURL);
            }
            else {
                window.history.pushState(null, '', nextURL);
            }
        }
        catch (error) {
            console.error('Error while setting query params', error);
        }
        pauseWatch.current = false;
    }, [params]);
    return [params, setParams];
}

export { useQueryParams as u };
