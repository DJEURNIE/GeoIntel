import type {Route} from "./+types/logout";
import {getSession, destroySession} from "~/session.server";
import {redirect} from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
    const session = await getSession(request.headers.get("Cookie"));

    return redirect('/', {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
}