import nextra from "nextra";

const withNextra = nextra({
  defaultShowCopyCode: true,
});

export default withNextra({
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
});