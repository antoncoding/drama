import { Header } from '@aragon/ui'
import { useParams } from 'react-router-dom'

import { Address1, Title3 } from '../../components/aragon'

export function Account(props: any) {

  const { address } = useParams()
  return (<div>
    <Header primary={
      <Title3>Account {address}</Title3>}></Header>
    <Address1>
      KK
    </Address1>
  </div>)
}

