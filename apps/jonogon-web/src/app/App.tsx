import {Route, Router, Switch} from 'wouter';
import {TRPCWrapper} from './trpc/Wrapper.tsx';
import {lazy, Suspense, useEffect, useMemo, useState} from 'react';
import AuthWrapper from './auth/Wrapper.tsx';
import {RegisterTokenRefresher} from './auth/RegisterTokenRefresher.tsx';
import './styles/globals.css';
import Preloader from './components/custom/Preloader.tsx';
import {StoreProvider} from './state/context.tsx';
import {makeState} from './state/state.mjs';
import Navigation from './components/custom/Navigation.tsx';

export type TAppProps = {
    hostname: string;
    ssrPath: string;
    ssrSearch: string;
};

export default function App(props: TAppProps) {
    const store = useMemo(() => {
        return makeState();
    }, []);

    const [preloader, setPreloader] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPreloader(false);
        }, 700);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AuthWrapper>
            <TRPCWrapper hostname={props.hostname}>
                <RegisterTokenRefresher />
                <StoreProvider store={store}>
                    <Suspense fallback={<>LOADING ...</>}>
                        {preloader ? (
                            <Preloader />
                        ) : (
                            <>
                                <Navigation />
                                <Router
                                    ssrPath={props.ssrPath}
                                    ssrSearch={props.ssrSearch}>
                                    <Switch>
                                        <Route
                                            path={'/'}
                                            component={lazy(
                                                () =>
                                                    import(
                                                        './pages/home/index.jsx'
                                                    ),
                                            )}
                                        />
                                        <Route
                                            path={
                                                '/petitions/:petition_id/edit'
                                            }
                                            component={lazy(
                                                () =>
                                                    import(
                                                        './pages/updatePetition/index.jsx'
                                                    ),
                                            )}
                                        />
                                        <Route
                                            path={'/petitions/:petition_id'}
                                            component={lazy(
                                                () =>
                                                    import(
                                                        './pages/singlePetition/index.jsx'
                                                    ),
                                            )}
                                        />
                                        <Route
                                            path={'/login'}
                                            component={lazy(
                                                () =>
                                                    import('./pages/login.jsx'),
                                            )}
                                        />

                                        {/* the catch-all route */}
                                        <Route>404: NOT FOUND</Route>
                                    </Switch>
                                </Router>
                            </>
                        )}
                    </Suspense>
                </StoreProvider>
            </TRPCWrapper>
        </AuthWrapper>
    );
}
