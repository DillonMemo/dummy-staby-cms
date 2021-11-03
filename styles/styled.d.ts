import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    mode: string
    body: string
    card: string
    card_radius: string
    text: string
    text_hover: string
    border: string
  }
}
