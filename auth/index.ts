import { handle } from "hono/aws-lambda";
import { issuer } from "@openauthjs/openauth";
import { CodeUI } from "@openauthjs/openauth/ui/code";
import { CodeProvider } from "@openauthjs/openauth/provider/code";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { subjects } from "./subjects";
import {Resource} from "sst";

async function getUser(email: string) {
    // Get user from database and return user ID
    return "1234"
}


const client = new SESv2Client();

const app = issuer({
    subjects,
    providers: {
        code: CodeProvider(
            CodeUI({
                sendCode: async (claims, code) => {
                    await client.send(
                        new SendEmailCommand({
                            FromEmailAddress: `Open Geo Intel <auth@${Resource.Mailer.sender}>`,
                            Destination: {
                                ToAddresses: [claims.email]
                            },
                            Content: {
                                Simple: {
                                    Subject: {
                                        Data: "Your OpenGeo Intel Login Code",
                                    },
                                    Body: {
                                        Text: {
                                            Data: `
Hi ${claims.name?.trim() || "there"},

Thanks for signing in to OpenGeo Intel. Your temporary login code is:

${code}

This code will expire in 10 minutes. If you didn't request this, you can safely ignore this message.

— The OpenGeo Intel Team
https://opengeointel.com
            `.trim(),
                                        },
                                        Html: {
                                            Data: `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; color: #333;">
    <p>Hi ${claims.name?.trim() || "there"},</p>
    <p>Thanks for signing in to <strong>OpenGeo Intel</strong>. Your temporary login code is:</p>
    <h2>${code}</h2>
    <p>This code will expire in 10 minutes.</p>
    <p>If you didn’t request this, you can safely ignore this message.</p>
    <p style="font-size: 12px; color: #666;">
      — The OpenGeo Intel Team<br />
      <a href="https://opengeointel.com">https://opengeointel.com</a>
    </p>
  </body>
</html>
            `.trim(),
                                        },
                                    },
                                    Headers: [
                                        {
                                            Name: "List-Unsubscribe",
                                            Value: "<mailto:unsubscribe@opengeointel.com>",
                                        }
                                    ]
                                },
                            },
                        })
                    );
                },
            }),
        ),
    },
    success: async (ctx, value) => {
        if (value.provider === "code") {
            return ctx.subject("user", {
                id: await getUser(value.claims.email),
                email: value.claims.email,
            })
        }
        throw new Error("Invalid provider")
    },
})


export const handler = handle(app)