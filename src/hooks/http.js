import { useReducer, useCallback } from 'react'
import axios from 'axios'

function httpReducer(currentHttp, action) {

    function startRequest(cHttp, loading) {
        return { ...cHttp, [loading]: true, error: null }
    }

    function response(cHttp, loading) {
        return { ...cHttp, [loading]: false }
    }

    function setData(cHttp, data) {
        return { ...cHttp, data }
    }

    function addIng(cHttp, ing, id) {
        const updatedData = [...cHttp.data, { ...ing, id }]
        return { ...cHttp, data: updatedData }
    }

    function removeIng(cHttp, ingId) {
        const updatedData = cHttp.data.filter(ing => ing.id !== ingId)
        return { ...cHttp, data: updatedData }
    }

    function setError(cHttp, error) {
        const loadings = Object.keys(cHttp)
        return Object.assign(
            ...loadings.map(loading => ({ [loading]: false })),
            { error }
        )
    }

    switch (action.type) {
        case 'START_REQUEST': return startRequest({ ...currentHttp }, action.loading)
        case 'RESPONSE': return response({ ...currentHttp }, action.loading)
        case 'SET_DATA': return setData({ ...currentHttp }, action.data)
        case 'ADD_ING': return addIng({ ...currentHttp }, action.ing, action.id)
        case 'REMOVE_ING': return removeIng({ ...currentHttp }, action.id)
        case 'ERROR': return setError({ ...currentHttp }, action.error)
        default: throw new Error('All action types must be handled properly.')
    }
}

export default function useHttp() {
    const [http, dispatchHttp] = useReducer(httpReducer, {
        fetchingIngredients: false,
        addingIngredient: false,
        removingIngredient: false,
        error: null,
        data: []
    })

    const sendRequest = useCallback((url, method, loading, payload = {}) => {
        dispatchHttp({ type: 'START_REQUEST', loading })

        let response

        switch (method.toUpperCase()) {
            case 'GET':
                {
                    response = axios.get(url)
                    break
                }
            case 'POST':
                {
                    response = axios.post(url, payload)
                    break
                }
            case 'DELETE':
                {
                    response = axios.delete(url)
                    break
                }
            default: response = axios.get(url)
        }

        response
            .then(res => {
                dispatchHttp({ type: 'RESPONSE', loading })

                switch (method) {
                    case 'GET':
                        {
                            if (res.data) {
                                const fetchedIngredients = Object.keys(res.data)
                                    .map(
                                        ingId => ({
                                            title: res.data[ingId].title,
                                            amount: res.data[ingId].amount,
                                            id: ingId
                                        })
                                    )
                                dispatchHttp({ type: 'SET_DATA', data: fetchedIngredients })
                            }
                            break
                        }
                    case 'POST':
                        {
                            dispatchHttp({ type: 'ADD_ING', ing: payload, id: res.data.name })
                            break
                        }
                    case 'DELETE':
                        {
                            dispatchHttp({ type: 'REMOVE_ING', id: payload })
                            break
                        }
                    default: dispatchHttp({ type: 'SET_DATA', data: res.data })
                }
            })
            .catch(err => {
                let errorMessage
                switch(err.message) {
                    case 'Network Error':
                        {
                            errorMessage = 'Network Error: Could not connect to server. Try again later.'
                            break
                        }
                    default: errorMessage = 'Unknown error occurred. Try again later.'
                }
                dispatchHttp({
                    type: 'ERROR',
                    error: errorMessage
                })
            })
    }, [])

    const resetError = useCallback(() => {
        dispatchHttp({ type: 'ERROR', error: null })
    }, [])

    return [http, sendRequest, resetError]
}