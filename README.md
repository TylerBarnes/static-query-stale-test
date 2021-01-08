# hi there 👋

this repro demonstrates that static queries do not re-run when a field in filters update their values.
see ./src/components/menu.js for where the filtered query is.

first: run gatsby develop and observe that the menu name is updating every 3 seconds

then: in gatsby-node.js uncomment the commented code on line 31 and 32, and comment lines 26 and 27
run `gatsby clean && gatsby develop` and observe that the menu simply dissapears

this is because the menu first is shown by being filtered by location eq `MAIN_MENU`
then when this value is changed to `UNUSED`, the query re-runs
then when the value is changed back to `MAIN_MENU`, the query does not re-run

running the query in graphiql shows that the data continually updates which means
this is a static query cache invalidation problem.