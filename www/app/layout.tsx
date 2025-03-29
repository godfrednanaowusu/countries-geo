import "../styles/globals.css";
import 'nextra-theme-docs/style.css'

import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { Flex, Heading, Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { Earth } from 'lucide-react';
 
export const metadata = {
  title: {
    default: 'Countries Geo – Utility for fetching Continents, Countries, States and Cities',
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
    projectLink="https://github.com/godfrednanaowusu/countries-geo"
    
  />
)
const footer = <Footer>MIT {new Date().getFullYear()} © Countries Geo.</Footer>
 
export default async function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
      <Theme appearance="inherit" accentColor="gray">
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/godfrednanaowusu/countries-geo"
          footer={footer}
          editLink={'https://github.com/godfrednanaowusu/countries-geo'}
          feedback={{content:'Edit feedback'}}
        >
          {children}
        </Layout>
        </Theme>
      </body>
    </html>
  )
}