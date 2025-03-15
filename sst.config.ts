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
    new sst.aws.React("geo-intel", {
      path: "web/"
    });
  },
});
