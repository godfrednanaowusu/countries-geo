import "../styles/globals.css";
import 'nextra-theme-docs/style.css'
import "../styles/gui.css";

import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { Flex, Heading, Theme, Text, Box } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { Earth, Heart } from 'lucide-react';
import  Flag  from'react-world-flags';
import Link from "next/link";
import Blob from './components/blob';
import SVGBackground from "./components/svg_background";
import ThemeButton from "./components/theme_button";


 
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

const FlowerIconSection = () => (
  <Box
    asChild
    
    // color="fg.inverted"
    // hideBelow="md"
    display={{initial:'none', md:'block'}}
    style={{width:"245px",
      height:"342px",
      position:"absolute",
      top:"58px",
      right:"67px"}}
  >
    <Earth style={{color:'teal', opacity:0.1 }} />
  </Box>
)

const AmbientLights = () => {
  return (
    <Box >
      <Blob top="-50px" left="50%" transform="translateX(-50%)" />
      <Blob bottom="-20%" left="-40%" top="40%" />
      {/* <Blob height="1000px" width="800px" bottom="0" left="40%" top="1200px" transform="translateX(-40%)" /> */}
    </Box>
  )
}
 
const banner = <Banner storageKey="some-key">Version 0.0.1 is released 🎉</Banner>
const navbar = (
  <Navbar
    logo={<Flex gap={'3'} align={'center'}><Earth size={"30"} color={'teal'} /><Heading color={'teal'} weight={'bold'}>Countries Geo</Heading></Flex>}
    projectLink="https://github.com/godfrednanaowusu/countries-geo"children={<Flex gap={'3'} align={'center'} display={{initial:'none', sm:'flex'}}>
    <ThemeButton/>
  </Flex>}
    
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
          <SVGBackground/>
          <FlowerIconSection/>
          <AmbientLights />
          
          {children}
        </Layout>
        </Theme>
      </body>
    </html>
  )
}