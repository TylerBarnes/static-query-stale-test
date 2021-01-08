// hi there 👋

// this repro demonstrates that static queries do not re-run when a field in filters update their values.
// see ./src/components/menu.js for where the filtered query is.

// first: run gatsby develop and observe that the menu name is updating every 3 seconds

// then: uncomment the commented code on line 31 and 32, and comment lines 26 and 27
// run `gatsby clean && gatsby develop` and observe that the menu simply dissapears

// this is because the menu first is shown by being filtered by location eq `MAIN_MENU`
// then when this value is changed to `UNUSED`, the query re-runs
// then when the value is changed back to `MAIN_MENU`, the query does not re-run

// running the query in graphiql shows that the data continually updates which means
// this is a static query cache invalidation problem.

async function createOrUpdateNode({ actions, createContentDigest, cache }) {
  const isEvenBuild = await cache.get(`build-flipper`)
  await cache.set(`build-flipper`, !isEvenBuild)

  const node = {
    id: `1`,

    // updating the menu name invalidates the static query result
    location: `MAIN_MENU`,
    name: isEvenBuild ? `New Menu Name` : `Main Menu`,

    // changing the location (which we filter by in components/menu.js)
    // doesn't invalidate the static query result
    // location: isEvenBuild ? `UNUSED` : `MAIN_MENU`,
    // name: `Main Menu`,

    items: [
      { label: `home`, link: `/` },
      { label: `page 2`, link: `/page-2` },
    ],
  }

  actions.createNode({
    ...node,
    internal: {
      type: `Menu`,
      contentDigest: createContentDigest(node),
    },
  })
}

exports.sourceNodes = createOrUpdateNode

exports.onCreateDevServer = async gatsbyApi => {
  setTimeout(() => {
    // after 3 seconds, start updating the single Menu node back and forth between having a location of MAIN_MENU and UNUSED every 3 seconds
    setInterval(() => createOrUpdateNode(gatsbyApi), 3000)
  }, 3000)
}
