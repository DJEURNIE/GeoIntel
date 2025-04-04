import type { Route } from "./+types/auth";
import {client, commitSession, getSession} from "~/session.server";
import {data, redirect} from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code")

    const exchanged = await client.exchange(code!, `${url.origin}/auth/callback`);

    if (exchanged.err) {
        return data({message: exchanged.err.message}, {
            status: 400,
        });
    }

    const session = await getSession(request.headers.get("Cookie"));
    session.set("access_token", exchanged.tokens.access);
    session.set("refresh_token", exchanged.tokens.refresh);

    return redirect("/console", {
        headers: {
            "Set-Cookie": await commitSession(session)
        },
    });
}
