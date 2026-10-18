export default {
  docsRepositoryBase: "https://github.com/godfrednanaowusu/countries-geo",
  titleSuffix: " – Countries Geo",
  editLink: {
    component: null,
    text: ''
  },
  feedback: {
    content: null
  },
  toc: {
    backToTop: true
  },
  search: {
    placeholder: 'Search documentation...'
  },
  footer: {
    text: (
      <div className="flex justify-between items-center w-full gap-5 flex-wrap">
        <div className="flex flex-col">
          MIT {new Date().getFullYear()} © Countries Geo.
        </div>
        <div className="flex gap-3 justify-end">
          <p>Made by <a href="https://github.com/godfrednanaowusu"><b>Godfred Owusu</b></a></p>
        </div>
      </div>
    )
  },
  logo: (
    <div className="flex items-center gap-3">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="teal" strokeWidth="2"/>
        <path d="M12 2C15.866 2 19 5.13401 19 9C19 12.866 15.866 16 12 16C8.13401 16 5 12.866 5 9C5 5.13401 8.13401 2 12 2Z" fill="teal"/>
      </svg>
      <h2 className="text-teal font-bold text-lg">Countries Geo</h2>
    </div>
  ),
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Countries Geo" />
      <meta property="og:description" content="Utility to access Continents, Countries, States, and Cities" />
      <meta name="description" content="Utility to access Continents, Countries, States, and Cities" />
    </>
  )
}
