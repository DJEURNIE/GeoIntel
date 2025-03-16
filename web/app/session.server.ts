import { createClient } from "@openauthjs/openauth/client"
import { createCookieSessionStorage, redirect } from "react-router";
import { subjects } from "@geointel/auth/subjects"
import { Resource } from "sst";

type SessionData = {
    access_token: string;
    refresh_token: string;
};

type User = {
    displayName: string;
}

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
                maxAge: 60*60*24,
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
) : Promise<User> {
    const session = await getSession(request.headers.get("Cookie"));

    const accessToken = session.get("access_token")
    const refreshToken = session.get("refresh_token")

    if (!accessToken) {
        console.log("access token not found");
        const searchParams = new URLSearchParams([["redirectTo", redirectTo], ["reason", "access_token"]]);
        throw redirect(`/auth/login?${searchParams}`);
    }

    const verified = await client.verify(subjects, accessToken, {
        refresh: refreshToken,
    })

    if (verified.err) {
        console.log("refresh failed", verified.err.message);
        const searchParams = new URLSearchParams([["redirectTo", redirectTo], ["reason", "refresh_token"]]);
        throw redirect(`/auth/login?${searchParams}`);
    }

    if (verified.tokens) {
        console.log("setting new tokens");
        session.set("access_token", verified.tokens.access);
        session.set("refresh_token", verified.tokens.refresh);

        console.log(verified.tokens.access, verified.tokens.refresh)

        throw redirect(redirectTo, {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    }

    return {
        displayName: verified.subject.properties.id,
    };
}

export { getSession, commitSession, destroySession };