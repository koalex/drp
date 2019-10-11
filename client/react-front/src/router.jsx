import React               from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Switch }          from 'react-router-dom';
import RouteWithSubRoutes  from './components/RouteWithSubRoutes';
import history             from './middlewares/history';
import MainLayout          from './components/MainLayout/container';
import FindSolution        from './components/FindSolution/container';
import CreateSolutions     from './components/CreateSolutions/container';
import EditSolutions       from './components/EditSolutions/container';

const routes = [
    {
        path: '/',
        component: MainLayout,
        exact: false,
        routes: [
            {
                path: '/find-solution',
                component: FindSolution,
                exact: true,
            },
            {
                path: '/create-solution',
                component: CreateSolutions,
                exact: true,
            },
            {
                path: '/edit-solutions',
                component: EditSolutions,
                exact: true,
            }
        ]
    },
];

export default function Router () {
    return (
        <ConnectedRouter history={history}>
            <Switch>
                {routes.map((route, i) => {
                    return (
                        <RouteWithSubRoutes
                            key={'route' + i + route.path}
                            {...route}
                        />
                    )
                })}
            </Switch>
        </ConnectedRouter>
    );
};
