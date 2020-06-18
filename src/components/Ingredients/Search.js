import React, { useState, useEffect, useRef } from 'react'

import Card from '../UI/Card'
import './Search.css'

const Search = React.memo(props => {

  const [search, setSearch] = useState('')
  const { onFilter, ingredientsToFilter } = props
  const searchRef = useRef()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search && search === searchRef.current.value) {
        onFilter(
          ingredientsToFilter.filter(
            ing => ing.title.toLowerCase().match(search.toLowerCase())
          )
        )
      } else if(!search) {
        onFilter(ingredientsToFilter)
      }
    }, 500)
    return function() { clearTimeout(timer) }
  }, [search, onFilter, ingredientsToFilter])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={searchRef}
            value={search}
            onChange={e => setSearch(e.target.value)}
            type="text"
          />
        </div>
      </Card>
    </section>
  )
})

export default Search