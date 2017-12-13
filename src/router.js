/* global window */

import React from 'react'
import toRegExp from 'path-to-regexp'

import Init from './components/Init'
import WebPage from './components/WebPage'
import ActionButtons from './components/ActionButtons'
import Country from './components/Country'
import Feed from './components/Feed'
import Statistics from './components/Statistics'
import ResourceIndex from './components/ResourceIndex'
import Register from './components/Register'
import Password from './components/Password'
import Groups from './components/Groups'
import { getURL } from './common'
import Feedback from './components/Feedback'

export default (api) => {

  const routes = [
    {
      path: '/resource/',
      get: async (params, context, state) => {
        const url = getURL({ path: '/resource/', params })
        const data = state || await api.get(url, context.authorization)
        const component = (data) => (
          <ResourceIndex
            {...data}
            mapboxConfig={context.mapboxConfig}
            selected={typeof window !== 'undefined' ? window.location.hash.substr(1) : ''}
            map={params.map}
            view={typeof window !== 'undefined' ? window.location.hash.substr(1) : ''}
          >
            <ActionButtons user={context.user} />
          </ResourceIndex>
        )
        return { title: 'ResourceIndex', data, component }
      },
      post: async (params, context, state, body) => {
        const data = await api.post('/resource/', body, context.authorization)
        const component = (data) => (
          <WebPage
            {...data}
            view={typeof window !== 'undefined' ? window.location.hash.substr(1) : ''}
          />
        )
        return { title: 'Created WebPage', data, component }
      }
    },
    {
      path: '/resource/:id',
      get: async (params, context, state) => {
        const data = state || await api.get(`/resource/${params.id}`, context.authorization)
        const component = (data) => (
          <WebPage
            {...data}
            view={typeof window !== 'undefined' ? window.location.hash.substr(1) : ''}
          />
        )
        return { title: 'WebPage', data, component }
      },
      post: async (params, context, state, body) => {
        const data = await api.post(`/resource/${params.id}`, body, context.authorization)
        const component = (data) => (
          <WebPage
            {...data}
            view={typeof window !== 'undefined' ? window.location.hash.substr(1) : ''}
          />
        )
        return { title: 'Updated WebPage', data, component }
      }
    },
    {
      path: '/country/:id',
      get: async (params, context, state) => {
        const url = getURL({ path: `/country/${params.id}`, params })
        const data = state || await api.get(url, context.authorization)
        const component = (data) => (
          <ResourceIndex
            {...data}
            mapboxConfig={context.mapboxConfig}
            selected={typeof window !== 'undefined' ? window.location.hash.substr(1) : ''}
          >
            <Country {...data} />
          </ResourceIndex>
        )
        return { title: 'Country', data, component }
      }
    },
    {
      path: '/aggregation/',
      get: async (params, context, state) => {
        const data = state || await api.get('/aggregation/', context.authorization)
        const component = (data) => <Statistics aggregations={data} />
        return { title: 'Aggregation', data, component }
      }
    },
    {
      path: '/feed/',
      get: async (params, context, state) => {
        const data = state || await api.get('/resource/?size=20&sort=dateCreated:desc', context.authorization)
        const component = (data) => <Feed {...data} />
        return { title: 'Feed', data, component }
      }
    },
    {
      path: '/user/register',
      get: async (params, context, state) => {
        const data = state
        const component = () => <Register />
        return { title: 'Registration', data, component }
      },
      post: async (params, context, state, body) => {
        const data = await api.post('/user/register', body, context.authorization)
        const component = (data) => (
          <Feedback>
            {data.username} registered{data.newsletter && " and signed up for newsletter"}.
          </Feedback>
        )
        return { title: 'Registered user', data, component }
      }
    },
    {
      path: '/user/password',
      get: async (params, context, state) => {
        const data = state
        const component = () => <Password />
        return { title: 'Reset Password', data, component }
      }
    },
    {
      path: '/user/password/reset',
      post: async (params, context, state, body) => {
        const data = await api.post('/user/password/reset', body, context.authorization)
        const component = () => (
          <Feedback>
            Your password was reset
          </Feedback>
        )
        return { title: 'Reset Password', data, component }
      }
    },
    {
      path: '/user/password/change',
      post: async (params, context, state, body) => {
        const data = await api.post('/user/password/change', body, context.authorization)
        const component = () => (
          <Feedback>
            Your password was changed
          </Feedback>
        )
        return { title: 'Change Password', data, component }
      }
    },
    {
      path: '/user/groups',
      get: async (params, context, state) => {
        const data = state || await api.get('/user/groups', context.authorization)
        const component = (data) => (
          <Groups {...data} />
        )
        return { title: 'Edit Groups', data, component }
      },
      post: async (params, context, state, body) => {
        const data = await api.post('/user/groups', body, context.authorization)
        const component = (data) => (
          <Groups {...data} />
        )
        return { title: 'Update Groups', data, component }
      }
    },
  ]

  const matchURI = (path, uri) => {
    const keys = []
    const pattern = toRegExp(path, keys)
    const match = pattern.exec(uri)
    if (!match) return null
    const params = Object.create(null)
    for (let i = 1; i < match.length; i++) {
      params[keys[i - 1].name] =
        match[i] !== undefined ? match[i] : undefined
    }
    return params
  }

  const handle = async (method, uri, context, state, params, body) => {
    try {
      for (const route of routes) {
        const uriParams = matchURI(route.path, uri)
        if (uriParams === null) continue
        if (typeof route[method] !== 'function') {
          throw "Method not implemented"
        }
        Object.assign(params, uriParams)
        const result = await route[method](params, context, state, body)
        if (result) {
          result.render = (data) => <Init {...context}>{result.component(data)}</Init>
          return result
        }
      }
    } catch (err) {
      console.error(err)
      return {
        title: 'Error',
        data: err,
        component: <pre>{JSON.stringify(err, null, 2)}</pre>
      }
    }
    // 404
    return {
      title: 'Not found',
      data: {},
      component: <h1>Page not found</h1>
    }
  }

  return {
    route: (uri, context, state) => (
      {
        get: async (params = {}) => (
          handle("get", uri, context, state, params, null)
        ),
        post: async (body, params = {}) => (
          handle("post", uri, context, state, params, body)
        )
      }
    )
  }

}
