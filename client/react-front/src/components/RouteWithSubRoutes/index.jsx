import React     from 'react';
import { Route } from 'react-router-dom';

const RouteWithSubRoutes = ({ user, ...route }) => {
    return (
        <Route
            location={route.location}
            exact={route.exact || false}
            strict={route.strict || false}
            path={route.path}
            render={props => {
                if (!route.component) return null;

                return (
                    <route.component
                        {...props}
                        routes={route.routes || []}
                    />
                );
            }}
        />
    );
};

export default RouteWithSubRoutes;
