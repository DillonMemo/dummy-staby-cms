import { Input, Space } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

/** components */
import Layout from '../../components/Layout'

/** styles */
import { MainWrapper, ManagementWrapper, styleMode } from '../../styles/styles'

type Props = styleMode

/** 공지사항 */
const Notice: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale } = useRouter()
  /** Table component에 들어가는 column 데이터 정보 입니다. */
  const columns: ColumnsType<any> = [
    {
      title: locale === 'ko' ? '제목' : 'title',
      dataIndex: 'title',
      key: 'title',
      responsive: ['md'],
    },
    {
      title: locale === 'ko' ? '등록일' : 'creation date',
      dataIndex: 'createDate',
      key: 'createDate',
      responsive: ['md'],
    },
  ]
  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper className="card">
        <div className="main-header">
          <h2>{locale === 'ko' ? '공지사항' : 'Notice'}</h2>
          <ol>
            <li>
              <Link href="/">
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? '안내' : 'News'}</li>
            <li>{locale === 'ko' ? '공지사항' : 'Notice'}</li>
          </ol>
        </div>
        <div className="main-content">
          <ManagementWrapper className="card">
            <div className="table-wrapper">
              <div className="filter-container">
                <div></div>
                <Space>
                  <Input.Search placeholder={locale === 'ko' ? '제목' : 'Title'} loading={true} />
                </Space>
              </div>
            </div>
          </ManagementWrapper>
        </div>
      </MainWrapper>
    </Layout>
  )
}

export default Notice
