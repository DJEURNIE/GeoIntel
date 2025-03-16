import {type RouteConfig, index, layout, prefix} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    layout("layout/authenticated.tsx", [
        ...prefix("console", [
            index("routes/dashboard.tsx")
        ])
    ])
] satisfies RouteConfig;
