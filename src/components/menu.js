import { graphql, Link, useStaticQuery } from "gatsby"
import React from "react"

export default function Menu() {
  const { menu } = useStaticQuery(graphql`
    {
      menu(location: { eq: "MAIN_MENU" }) {
        name
        id
        items {
          label
          link
        }
      }
    }
  `)

  if (!menu?.items) {
    return null
  }

  return (
    <nav>
      <h2>{menu.name}</h2>
      {menu.items.map(item => (
        <Link to={item.link} key={item.link}>
          {item.label}
          <br />
        </Link>
      ))}
    </nav>
  )
}
