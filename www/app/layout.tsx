import 'nextra-theme-docs/style.css'
import "./globals.css";

import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { Earth } from 'lucide-react';
import Link from "next/link";
import { version } from "countries-geo/package.json";
import Blob from './components/blob';
import SVGBackground from "./components/svg_background";
import { LocaleProvider, T } from "./components/locale_provider";
import LocaleSwitcher from "./components/locale_switcher";
import LocalizedSearch from "./components/localized_search";
import LocalizedLastUpdated from "./components/localized_last_updated";

const FlowerIconSection = () => (
  <Earth
    className="hidden md:block"
    style={{
      color: 'teal',
      opacity: 0.1,
      width: "245px",
      height: "342px",
      position: "absolute",
      top: "58px",
      right: "67px",
      pointerEvents: "none",
    }}
  />
)

// Clipped so the oversized blobs can't widen the page (they did in RTL, where it became scrollable)
const AmbientLights = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-x-clip">
      <Blob top="-50px" left="80%" transform="translateX(-50%)" />
      <Blob bottom="-20%" left="-40%" top="40%" />
    </div>
  )
}
 
const banner = <Banner storageKey={`release-${version}`}><T k="banner.released" values={{ version }} /></Banner>
const navbar = (
  <Navbar
    logo={<div className="flex items-center gap-3"><Earth size={30} color={'teal'} /><h2 className="text-teal font-bold text-lg">Countries Geo</h2></div>}
    projectLink="https://github.com/godfrednanaowusu/countries-geo"
  >
    <LocaleSwitcher />
  </Navbar>
)
const footer = <Footer>
  <div className="flex justify-between items-center w-full gap-5 flex-wrap">
    <div className="flex flex-col">
  MIT {new Date().getFullYear()} © Countries Geo.
  </div>
  <div className="flex gap-3 justify-end">
    <p ><T k="footer.madeBy" /> <Link href={'https://github.com/godfrednanaowusu'}><b>Godfred Owusu</b></Link></p>
  </div>
  </div>
  </Footer>
 
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageMap = await getPageMap()

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <LocaleProvider>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/godfrednanaowusu/countries-geo/tree/main"
          footer={footer}
          editLink={<T k="page.editPage" />}
          feedback={{ content: <T k="page.feedback" /> }}
          lastUpdated={<LocalizedLastUpdated />}
          search={<LocalizedSearch />}
          toc={{ title: <T k="toc.title" />, backToTop: <T k="toc.backToTop" /> }}
          nextThemes={{
            attribute: "class",
            defaultTheme: "system",
            disableTransitionOnChange: false,
            storageKey: "countries-geo-theme",
          }}
        >
          <SVGBackground/>
          <FlowerIconSection/>
          <AmbientLights />
          
          {children}
        </Layout>
        </LocaleProvider>
      </body>
    </html>
  )
}