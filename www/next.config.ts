import nextra from "nextra";

const withNextra = nextra({
    search: true,
    defaultShowCopyCode: true,
});

export default withNextra({
    experimental: {
        turbo: {
          resolveAlias: {
            "next/server.js": "next/server",
            "next/navigation.js": "next/navigation",
            "next/headers.js": "next/headers",
          },
        },
      }
});