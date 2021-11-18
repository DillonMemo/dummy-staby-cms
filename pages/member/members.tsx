import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MainWrapper, styleMode } from '../../styles/styles'
import styled from 'styled-components'
import { Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'

/** components */
import Layout from '../../components/Layout'

/** graphql */
import { useMutation } from '@apollo/client'
import { MembersMutation, MembersMutationVariables } from '../../generated'
import { MEMBERS_MUTATION } from '../../graphql/mutations'

type Props = styleMode

const columns: ColumnsType<any> = [
  {
    title: 'email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'nickname',
    dataIndex: 'nickname',
    key: 'nickname',
  },
]

type Temp = Member

const Members: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale } = useRouter()
  const [dataTable, setDataTable] = useState([])
  const [members, { data: membersData, loading: membersLoading }] = useMutation<
    MembersMutation,
    MembersMutationVariables
  >(MEMBERS_MUTATION)

  useEffect(() => {
    const fetch = async () => {
      try {
        await members({
          variables: {
            membersInput: {},
          },
        })
      } catch (error) {
        console.error(error)
      }
    }

    fetch()
  }, [])

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper>
        <div className="main-header">
          <h2>{locale === 'ko' ? '관리' : 'Management'}</h2>
          <ol>
            <li>
              <Link href="/">
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? '회원' : 'Member'}</li>
            <li>{locale === 'ko' ? '관리' : 'Management'}</li>
          </ol>
        </div>
        <div className="main-content">
          <ManagementWrapper className="card">
            <div>
              <h1>Hello Filter</h1>
            </div>
            <div>
              <Table columns={columns} dataSource={membersData?.members.members || []} />
            </div>
          </ManagementWrapper>
        </div>
      </MainWrapper>
    </Layout>
  )
}

const ManagementWrapper = styled.div`
  width: 100%;
  min-height: 2rem;
`

export default Members
