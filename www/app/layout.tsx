import "../styles/globals.css";
import 'nextra-theme-docs/style.css'

import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { Flex, Heading, Theme, Text } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { Earth, Heart } from 'lucide-react';
import  Flag  from'react-world-flags';
import Link from "next/link";
 
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
const footer = <Footer>
  <Flex justify={'between'} align={'center'} width={'100%'} gap={'5'} wrap={'wrap'}>
    <Flex direction={'column'}>
  MIT {new Date().getFullYear()} © Countries Geo.
  </Flex>
  <Flex gap={'3'} justify={'end'}>
    <Text >Made by <Link href={'https://github.com/godfrednanaowusu'}><b>Godfred Owusu</b></Link></Text>
  </Flex>
  </Flex>
  </Footer>
 
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