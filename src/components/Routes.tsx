import React, { Suspense, lazy } from "react";
import { Router, Switch, Route } from "../util/Router";
import { Box } from "native-base";
import ErrorBoundary from "./ErrorBoundary";
const TestPage = lazy(() => import("../pages/Test"));
const KitchenSinkPage = lazy(() => import("../pages/DesignEditor/KitchenSink"));

export default function () {
    return (
        <ErrorBoundary>
            <Suspense fallback={<Box>Loading...</Box>}>
                <Router>
                    <Switch>
                        <Route exact path="/" component={TestPage}></Route>
                    </Switch>
                </Router>
            </Suspense>
        </ErrorBoundary>
    );
}
