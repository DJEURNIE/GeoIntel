import {type RouteConfig, index, layout, prefix, route} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("auth/callback", "routes/auth/auth.tsx"),
    route("auth/login", "routes/auth/login.tsx"),
    route("auth/logout", "routes/auth/logout.tsx"),
    layout("layout/authenticated.tsx", [
        ...prefix("console", [
            index("routes/dashboard.tsx")
        ])
    ]),
    route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
