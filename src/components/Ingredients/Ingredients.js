import React, { useReducer, useEffect, useCallback, useMemo } from 'react'

import IngredientForm from './IngredientForm'
import Search from './Search'
import IngredientList from './IngredientList'
import LoadingIndicator from '../UI/LoadingIndicator'
import ErrorModal from '../UI/ErrorModal'

import useHttp from '../../hooks/http'

// Reducers
function ingredientReducer(currentIng, action) {
  switch (action.type) {
    case 'SET': return action.ingredients
    case 'ADD': return [...currentIng, action.newIng]
    case 'REMOVE': return currentIng.filter(ing => ing.id !== action.ingId)
    default: throw new Error('All action types must be handled properly.')
  }
}

function Ingredients() {
  const [ingredients, dispatchIng] = useReducer(ingredientReducer, [])
  const [filteredIng, dispatchFilteredIng] = useReducer(ingredientReducer, [])

  const [http, sendRequest, resetError] = useHttp()

  // Set ingredients data local state
  useEffect(() => {
    if (http.data) {
      dispatchIng({ type: 'SET', ingredients: http.data })
      dispatchFilteredIng({ type: 'SET', ingredients: http.data })
    }
  }, [http.data])

  // Fetch ingredients from server request
  useEffect(() => {
    const url = 'https://react-hooks-7ae5a.firebaseio.com/ingredients.json'
    sendRequest(url, 'GET', 'fetchingIngredients')
  }, [])

  const addIngredientHandler = useCallback(ingredient => {
    const url = 'https://react-hooks-7ae5a.firebaseio.com/ingredients.json'
    sendRequest(url, 'POST', 'addingIngredient', ingredient)
  }, [])

  const removeIngredient = useCallback(ingId => {
    const url = `https://react-hooks-7ae5a.firebaseio.com/ingredients/${ingId}.json`
    sendRequest(url, 'DELETE', 'removingIngredient', ingId)
  }, [])

  const ingredientList = useMemo(() => (
    <IngredientList
      ingredients={filteredIng}
      onRemoveIngredient={removeIngredient}
    />
  ), [filteredIng])

  return (
    <div className="App">
      <ErrorModal
        show={http.error ? true : false}
        onClose={resetError}
      >{http.error}</ErrorModal>

      {
        http.fetchingIngredients
          ? <LoadingIndicator />
          : <IngredientForm onAddIngredient={addIngredientHandler} />
      }

      <section>
        <Search
          ingredientsToFilter={ingredients}
          onFilter={useCallback(filtered => dispatchFilteredIng({
            type: 'SET',
            ingredients: filtered
          }), [])}
        />

        {
          (http.addingIngredient || http.removingIngredient)
            ? <LoadingIndicator />
            : ingredientList
        }
      </section>
    </div>
  )
}

export default Ingredients
