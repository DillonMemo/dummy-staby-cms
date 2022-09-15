import { omit } from 'lodash'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import Layout from '../../components/Layout'
import { VodStatus } from '../../generated'
import { Edit, MainWrapper, styleMode } from '../../styles/styles'
import { VodCreateForm } from './createVod'

type Props = styleMode

interface VodEditForm extends VodCreateForm {
  vodStatus: VodStatus
}

const VodDetail: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale, push, query } = useRouter()
  const {
    getValues,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
  } = useForm<VodEditForm>({
    mode: 'onChange',
  })

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper>
        <div className="main-header">
          <h2>{locale === 'ko' ? 'Vod 관리' : 'Vod Edit'}</h2>
          <ol>
            <li>
              <Link href="/" locale={locale}>
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>
              <Link
                href={{
                  pathname: '/vod/vods',
                  query: { ...omit(query, 'id') },
                }}
                as={'/vod/vods'}
                locale={locale}>
                <a>{locale === 'ko' ? 'Vod' : 'Vod'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? 'Vod 관리' : 'Vod Edit'}</li>
          </ol>
        </div>
        <div className="main-content">
          <Edit className="card">Hello Edit</Edit>
        </div>
      </MainWrapper>
    </Layout>
  )
}

export default VodDetail
