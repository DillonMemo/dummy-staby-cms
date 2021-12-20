import { IncomingMessage, ServerResponse } from 'http'
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  NormalizedCacheObject,
  ReactiveVar,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import merge from 'deepmerge'
import { isEqual } from 'lodash'
import type { AppProps } from 'next/app'
import { useMemo } from 'react'
import { LOCALSTORAGE_TOKEN } from './constants'

export type ResolverContext = {
  req?: IncomingMessage
  res?: ServerResponse
}

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

/**
 * @this {ReactiveVar<T>} makeVar
 * @description 캐시 외부의 로컬 상태를 나타내는 반응 변수 입니다.
 */
let token: string | null = null
export let isLoggedInVar: ReactiveVar<boolean> = makeVar(Boolean(null))
export let authTokenVar: ReactiveVar<string> = makeVar('')

const httpLink = createHttpLink({
  uri: 'http://cms-api-dev.staby.co.kr/graphql',
  credentials: 'same-origin',
})

const authLink = () => {
  return setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        'x-jwt': authTokenVar() || '',
      },
    }
  })
}

const createApolloClient = () => {
  return new ApolloClient({
    // SSR only for Node.js
    ssrMode: typeof window === 'undefined',
    link: authLink().concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            isLoggedIn: {
              read: () => isLoggedInVar(),
            },
            token: {
              read: () => authTokenVar(),
            },
          },
        },
      },
    }),
  })
}

const initializeApollo = (initialState: any = null) => {
  if (typeof window !== 'undefined') {
    const _token = localStorage.getItem(LOCALSTORAGE_TOKEN)
    if (_token) {
      token = _token
      isLoggedInVar = makeVar(Boolean(token))
      authTokenVar = makeVar(token)
    }
  }

  const _apolloClient = apolloClient ?? createApolloClient()

  // console.log('initialState value is:', initialState);

  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // getStaticProps & getServerSideProps에서 전달되어지는 데이터에 기존 캐시를 병합(merge) 합니다.
    const data = merge(initialState, existingCache, {
      // object equalit를 사용하여 배열을 결합 합니다.
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((destination) =>
          sourceArray.every((source) => !isEqual(destination, source))
        ),
      ],
    })

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)
  }

  // SSG, SSR의 경우 항상 new Apollo Client를 생성 합니다.
  if (typeof window === 'undefined') return _apolloClient
  // apolloClient가 존재 하지 않으면 선언 합니다.
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export const addApolloState = (
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: AppProps['pageProps']
) => {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }

  return pageProps
}

export const useApollo = (pageProps: AppProps['pageProps']) => {
  // console.log('page props is value:', pageProps);
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  const store = useMemo(() => initializeApollo({ initialState: state }), [state])

  return store
}
