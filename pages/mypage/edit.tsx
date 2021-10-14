import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { Button, Input, Select, Skeleton } from 'antd'
import styled from 'styled-components'
import { useMutation, useQuery } from '@apollo/client'

/** components */
import Layout from '../../components/Layout'

/** styles */
import { Form, MainWrapper, md, styleMode } from '../../styles/styles'

/** graphql */
import {
  EditAccountMutation,
  EditAccountMutationVariables,
  MeQuery,
  UserRole,
} from '../../generated'
import { ME_QUERY } from '../../graphql/queries'
import { EDIT_ACCOUNT_MUTATION } from '../../graphql/mutations'

type Props = styleMode

export interface IEditForm {
  email: string
  username: string
  role: UserRole
  password: string
}

const MypageEdit: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale } = useRouter()
  const { getValues, handleSubmit, control } = useForm<IEditForm>({
    mode: 'onChange',
  })
  const { loading, data: meData, refetch: refreshMe } = useQuery<MeQuery>(ME_QUERY)

  const onCompleted = async (data: EditAccountMutation) => {
    const {
      editAccount: { ok },
    } = data

    if (ok && meData) {
      await refreshMe()
    }
  }
  const [editAccount, { loading: editLoading }] = useMutation<
    EditAccountMutation,
    EditAccountMutationVariables
  >(EDIT_ACCOUNT_MUTATION, {
    onCompleted,
  })

  const onSubmit = () => {
    const { email, role, username, password } = getValues()
    editAccount({
      variables: {
        editUserInput: {
          email,
          role,
          ...(username !== '' && { username }),
          ...(password !== '' && { password }),
        },
      },
    })
  }

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper>
        <div className="main-header">
          <h2>{locale === 'ko' ? '내 정보 관리' : 'Account Settings'}</h2>
          <ol>
            <li>
              <Link href="/">
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? '마이페이지' : 'My page'}</li>
            <li>{locale === 'ko' ? '내 정보 관리' : 'Account Settings'}</li>
          </ol>
        </div>
        <div className="main-content">
          <Edit className="card">
            {loading ? (
              <Form>
                {Array(4)
                  .fill(null)
                  .map((_, index) => (
                    <div className="form-item" key={`form-${index}`}>
                      <div className="form-group">
                        <Skeleton.Input style={{ width: '100%', minHeight: '3rem' }} active />
                      </div>
                    </div>
                  ))}
                <div className="form-item">
                  <div className="button-group">
                    <Skeleton.Button style={{ minHeight: '3rem' }} active />
                  </div>
                </div>
              </Form>
            ) : (
              <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-item">
                  <div className="form-group">
                    <span>Email</span>
                    <Controller
                      control={control}
                      name="email"
                      defaultValue={meData?.me.email}
                      render={({ field: { onChange, value } }) => (
                        <Input
                          className="input"
                          placeholder="Email"
                          value={value}
                          onChange={onChange}
                          disabled
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="form-item">
                  <div className="form-group">
                    <span>Role</span>
                    <Controller
                      control={control}
                      name="role"
                      defaultValue={meData?.me.role}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          value={value}
                          onChange={onChange}
                          disabled={meData?.me.role !== UserRole.Admin}>
                          {Object.keys(UserRole).map((role, index) => (
                            <Select.Option value={role} key={`role-${index}`}>
                              {role}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    />
                  </div>
                </div>
                <div className="form-item">
                  <div className="form-group">
                    <span>UserName</span>
                    <Controller
                      control={control}
                      name="username"
                      defaultValue={meData?.me.username}
                      render={({ field: { value, onChange } }) => (
                        <Input
                          className="input"
                          placeholder="User Name"
                          value={value}
                          onChange={onChange}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="form-item">
                  <div className="form-group">
                    <span>Password</span>
                    <Controller
                      control={control}
                      name="password"
                      render={({ field: { value, onChange } }) => (
                        <Input.Password
                          className="input"
                          placeholder="password"
                          value={value}
                          onChange={onChange}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="form-item">
                  <div className="button-group">
                    <Button
                      type="primary"
                      role="button"
                      htmlType="submit"
                      className="submit-button"
                      loading={editLoading}>
                      {locale === 'ko' ? '저장' : 'save'}
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Edit>
        </div>
      </MainWrapper>
    </Layout>
  )
}

const Edit = styled.div`
  width: 50%;

  ${md} {
    width: 100%;
  }
`

export default MypageEdit
