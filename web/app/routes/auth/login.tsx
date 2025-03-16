import type {Route} from "../../../.react-router/types/app/routes/+types";
import {client} from "~/session.server";
import {redirect} from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
    const host = request.headers.get("Host");
    const protocol = host?.includes("localhost") ? "http" : "https";

    const { url } = await client.authorize(`${protocol}://${host}/auth/callback`, "code");

    return redirect(url, {
        status: 302,
    });
}