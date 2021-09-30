import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    mode: string
    body: string
    card: string
    text: string
  }
}
