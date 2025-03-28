import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
// import ThemeLayout from "../layouts/ThemeLayout.jsx";
import "../styles/globals.css";
import 'nextra-theme-docs/style.css'
// import ThemeLayout from '../layouts/ThemeLayout.jsx';
import { Flex, Heading, Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { Earth } from 'lucide-react';
import { SiGitlab } from'react-icons/si';

 
export const metadata = {
  title: {
    default: 'Countries Geo – Utility for fetching Continents, Countries, States and Cities',
    // template: '%s | Nextra'
  },
  openGraph: {
    url: 'https://countries-geo.vercel.app',
    siteName: 'Countries Geo',
    locale: 'en_US',
    type: 'website'
  }
}
 
const banner = <Banner storageKey="some-key">Version 0.0.1 is released 🎉</Banner>
const navbar = (
  <Navbar
    logo={<Flex gap={'3'} align={'center'}><Earth size={"30"} color={'teal'} /><Heading color={'teal'} weight={'bold'}>Countries Geo</Heading></Flex>}
    projectLink="https://github.com/shuding/nextra"
    // projectIcon={<SiGitlab/>}
    
  />
)
const footer = <Footer>MIT {new Date().getFullYear()} © Countries Geo.</Footer>
 
export default async function RootLayout({ children }) {
  return (
    <html
      // Not required, but good for SEO
      lang="en"
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head
      // ... Your additional head options
      >
        {/* Your additional tags should be passed as `children` of `<Head>` element */}
      </Head>
      <body>
      <Theme appearance="inherit" accentColor="gray">
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com"
          footer={footer}
          editLink={'https://github.com'}
          feedback={{content:'Edit feedback'}}

          // ... Your additional layout options
        >
          
          {children}
          
          
        </Layout>
        </Theme>
      </body>
    </html>
  )
}