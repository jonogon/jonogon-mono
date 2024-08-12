import {Route, Router, Switch} from 'wouter';
import {TRPCWrapper} from './trpc/Wrapper.tsx';
import {lazy, Suspense} from 'react';
import AuthWrapper from './auth/Wrapper.tsx';
import {RegisterTokenRefresher} from './auth/RegisterTokenRefresher.tsx';
import './styles/globals.css';

export type TAppProps = {
    hostname: string;
    ssrPath: string;
    ssrSearch: string;
};

export default function App(props: TAppProps) {
    return (
        <Suspense fallback={<>LOADING ...</>}>
            <AuthWrapper>
                <TRPCWrapper hostname={props.hostname}>
                    <RegisterTokenRefresher />

                    <Router ssrPath={props.ssrPath} ssrSearch={props.ssrSearch}>
                        <Switch>
                            <Route
                                path={'/'}
                                component={lazy(
                                    () => import('./pages/home/index.jsx'),
                                )}
                            />

                            <Route
                                path={'/login'}
                                component={lazy(
                                    () => import('./pages/login.jsx'),
                                )}
                            />

                            {/* the catch-all route */}
                            <Route>404: NOT FOUND</Route>
                        </Switch>
                    </Router>
                </TRPCWrapper>
            </AuthWrapper>
        </Suspense>
    );
}
