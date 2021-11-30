import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Edit, Form, MainWrapper, md, styleMode } from '../../styles/styles'
import { Button, Input } from 'antd'

import Link from 'next/link'
import styled from 'styled-components'

/** components */
import Layout from '../../components/Layout'
import { Controller, useForm } from 'react-hook-form'
import TextArea from 'rc-textarea'

type Props = styleMode

const VodDetail: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { control } = useForm()
  const { locale } = useRouter()

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper>
        <div className="main-header">
          <h2>{locale === 'ko' ? 'VOD 관리' : 'VOD Settings'}</h2>
          <ol>
            <li>
              <Link href="/">
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? 'VOD' : 'VOD'}</li>
            <li>{locale === 'ko' ? 'VOD 관리' : 'VOD Settings'}</li>
          </ol>
        </div>
        <div className="main-content">
          <Edit className="card">
            <Form>
              <div className="form-item">
                <div className="form-group">
                  <span>Title</span>
                  <Controller
                    control={control}
                    name="title"
                    render={({ field: { value, onChange } }) => (
                      <Input
                        className="input"
                        placeholder="Please enter the title."
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="form-item">
                <div className="form-group">
                  <span>Price</span>
                  <Controller
                    control={control}
                    name="price"
                    render={({ field: { value, onChange } }) => (
                      <Input
                        type="number"
                        className="input"
                        placeholder="Please enter the Price."
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="form-item">
                <div className="form-group">
                  <span>Vod</span>
                  <Controller
                    control={control}
                    name="vod"
                    render={({ field: { value, onChange } }) => (
                      <Input
                        className="input"
                        placeholder="Please upload the video.(only mp4)"
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                  ※
                  {locale === 'ko'
                    ? 'vod는 최대 8개까지 추가할 수 있습니다.'
                    : 'Up to eight vod can be uploaded.'}
                  <Button className="thumbnailAddBtn">{locale === 'ko' ? '추가' : 'Add'}</Button>
                </div>
              </div>
              <div className="form-item">
                <div className="form-group">
                  <span>Vod Thumbnail</span>
                  <Controller
                    control={control}
                    name="vodThumbnail"
                    render={({ field: { value, onChange } }) => (
                      <div>
                        <Input
                          className="input"
                          placeholder="Please upload img. only png or jpg"
                          value={value}
                          onChange={onChange}
                        />
                      </div>
                    )}
                  />
                  <Button className="thumbnailAddBtn">{locale === 'ko' ? '추가' : 'Add'}</Button>
                </div>
              </div>
              <div className="form-item">
                <div className="form-group">
                  <span>Playing Thumbnail</span>
                  <Controller
                    control={control}
                    name="playingThumnail"
                    render={({ field: { value, onChange } }) => (
                      <Input
                        className="input"
                        placeholder="Please upload img. only png or jpg"
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                  <Button className="thumbnailAddBtn">{locale === 'ko' ? '추가' : 'Add'}</Button>
                </div>
              </div>
              <div className="form-item">
                <div className="form-group">
                  <span>Content</span>
                  <Controller
                    control={control}
                    name="content"
                    render={({ field: { value, onChange } }) => (
                      <TextArea
                        className="input ant-input"
                        placeholder="Please upload content."
                        maxLength={1000}
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="form-item">
                <div className="button-group">
                  <Button type="primary" role="button" htmlType="submit" className="submit-button">
                    {locale === 'ko' ? '저장' : 'save'}
                  </Button>
                </div>
              </div>
            </Form>
          </Edit>
        </div>
      </MainWrapper>
    </Layout>
  )
}
export default VodDetail
