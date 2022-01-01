import { Header, useTheme } from '@aragon/ui'

export function Home(props: any) {

  const theme = useTheme()

  return (<div
    css={`
      color: ${theme.surfaceContentSecondary};
    `}
  >
    <Header primary="Home"></Header>
  </div>)
}