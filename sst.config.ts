/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "geointel",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          profile: "djeurnie"
        }
      }
    };
  },
  async run() {
    const CookieSecret = new sst.Secret("CookieSecret", "3Kte4V!CbAnUcdZ*dKew")

    const auth = new sst.aws.Auth("OpenGeoIntelAuth", {
      issuer: "auth/index.handler",
      domain: $app.stage === "production" ? "auth.opengeointel.com" : `auth.${$app.stage}.opengeointel.com`,
    });

    new sst.aws.React("geo-intel", {
      path: "web/",
      domain: $app.stage === "production" ? "opengeointel.com" : `${$app.stage}.opengeointel.com`,
      link: [CookieSecret, auth]
    });
  },
});
