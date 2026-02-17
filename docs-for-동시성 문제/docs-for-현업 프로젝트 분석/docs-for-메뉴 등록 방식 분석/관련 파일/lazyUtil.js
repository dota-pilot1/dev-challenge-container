import { lazy } from 'react'

export const retryLazy = (componentImport) =>
  lazy(async () => {
    const pageAlreadyRefreshed = JSON.parse(window.localStorage.getItem('lazy-Refreshed') || 'false')
    try {
      const component = await componentImport()
      window.localStorage.setItem('lazy-Refreshed', 'false')
      return component
    } catch (error) {
      if (!pageAlreadyRefreshed) {
        window.localStorage.setItem('lazy-Refreshed', 'true')
        return window.location.reload()
      }
      throw error
    }
  })
