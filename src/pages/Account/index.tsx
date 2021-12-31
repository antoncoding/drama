import { Header } from '@aragon/ui'

import { useParams } from 'react-router-dom'

export function Account(props: any) {

  const { address } = useParams()
  return (<div>
    <Header primary={address}></Header>
  </div>)
}