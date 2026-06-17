/**
 * @jest-environment node
 */

// Do not lint the return value destruction for `renderToString`
/* eslint-disable testing-library/render-result-naming-convention */

import { renderToString } from 'react-dom/server'
import { Suspense } from 'react'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'
import { IS_SERVER } from 'swr/_internal'
import { createKey } from './utils'

describe('useSWR', () => {
  it('env IS_SERVER is true in node env', () => {
    expect(IS_SERVER).toBe(true)
  })

  it('should render fallback if provided on server side', async () => {
    const key = createKey()
    const useData = () => useSWR(key, k => k, { fallbackData: 'fallback' })

    function Page() {
      const { data } = useData()
      return <p>{data}</p>
    }

    const html = renderToString(<Page />)
    expect(html).toContain('fallback')
  })

  it('should not revalidate useSWRImmutable on server side', async () => {
    const key = createKey()
    const useData = () => useSWRImmutable(key, k => k)

    function Page() {
      const { data } = useData()
      return <p>{data || 'empty'}</p>
    }

    const html = renderToString(<Page />)
    expect(html).toContain('empty')
  })

  it('should not suspend with a falsy key in suspense mode on the server', () => {
    function Page() {
      const { data } = useSWR(null, () => 'SWR', { suspense: true })
      return <p>{data || 'empty'}</p>
    }

    const html = renderToString(
      <Suspense fallback={<p>fallback</p>}>
        <Page />
      </Suspense>
    )

    expect(html).toContain('empty')
  })
})
