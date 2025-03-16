import { createClient } from "@openauthjs/openauth/client"
import { createCookieSessionStorage, redirect } from "react-router";
import { Resource } from "sst";

type SessionData = {
    access_token: string;
    refresh_token: string;
    display_name: string;
};

type SessionFlashData = {
    error: string;
};

export const client = createClient({
    clientID: "geointel_web",
    issuer: Resource.OpenGeoIntelAuth.url
})

const { getSession, commitSession, destroySession } =
    createCookieSessionStorage<SessionData, SessionFlashData>(
        {
            cookie: {
                name: "__session",
                httpOnly: true,
                maxAge: 60,
                path: "/",
                sameSite: "lax",
                secrets: [Resource.CookieSecret.value],
                secure: true,
            },
        }
    );

export async function requireUser(
    request: Request,
    redirectTo: string = new URL(request.url).pathname,
) : Promise<SessionData> {
    const session = await getSession(request);

    const accessToken = session.get("access_token")
    const refreshToken = session.get("refresh_token")

    if (!accessToken) {
        const searchParams = new URLSearchParams([["redirectTo", redirectTo], ["reason", "invalid_token"]]);
        throw redirect(`/login?${searchParams}`);
    }

    let jwt
    try {
        jwt = await getJWT(request);
    } catch (e) {
        const searchParams = new URLSearchParams([["redirectTo", redirectTo], ["reason", "invalid_token"]]);
        throw redirect(`/login?${searchParams}`);
    }

    if (!jwt) {
        const searchParams = new URLSearchParams([["redirectTo", redirectTo], ["reason", "invalid_token"]]);
        throw redirect(`/login?${searchParams}`);
    }

    const claims = decodeJwt(jwt);
    invariant(
        claims.exp && claims.sub,
        "JWT claims must have exp and sub",
    )

    if (claims.exp < Math.floor(Date.now() / 1000)) {
        const searchParams = new URLSearchParams([["redirectTo", redirectTo], ["reason", "expired"]]);
        throw redirect(`/login?${searchParams}`);
    }

    return {
        jwt,
        claims: claims as UserClaims,
    };
}

export { getSession, commitSession, destroySession };