import {lazy, Suspense, useEffect, useMemo, useState} from 'react';
import {Route, Router, Switch} from 'wouter';
import {RegisterTokenRefresher} from './auth/RegisterTokenRefresher.tsx';
import AuthWrapper from './auth/Wrapper.tsx';
import Preloader from './components/custom/Preloader.tsx';
import {Toaster} from './components/ui/toaster.tsx';
import {StoreProvider} from './state/context.tsx';
import {makeState} from './state/state.mjs';
import './styles/globals.css';
import {TRPCWrapper} from './trpc/Wrapper.tsx';
import Layout from './Layout.tsx';

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
        }, 50);
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
                            <Layout>
                                <Toaster />
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
                            </Layout>
                        )}
                    </Suspense>
                </StoreProvider>
            </TRPCWrapper>
        </AuthWrapper>
    );
}
