// layouts/ThemeLayout.js
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css"; // Import Radix Themes styles globally

const ThemeLayout = ({ children }) => {
  return (
    <Theme appearance="inherit" accentColor="gray">
      {children}
    </Theme>
  );
};

export default ThemeLayout;
