import { Button } from 'antd'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styled from 'styled-components'

/** components */
import FileButton from '../FileButton'

/** utils */
import { getError } from '../../Common/commonFn'
import { md } from '../../styles/styles'
import { VodInfo } from '../../pages/vod/createVod'

interface Props {
  vodInfo?: VodInfo[]
  onVodChange: (video: File, image: File) => void
}

const VodUploadContainer: React.FC<Props> = ({ vodInfo, onVodChange }) => {
  const { locale } = useRouter()
  const [video, setVideo] = useState<File>()
  const [image, setImage] = useState<File>()

  /**
   * 파일 추가 클릭 이벤트 핸들러 입니다
   */
  const onAdd = () => {
    try {
      const nodes = document.querySelectorAll('label.fileLabel') as NodeListOf<HTMLLabelElement>

      // verify
      nodes.forEach((label) => {
        const file = label.nextSibling as HTMLInputElement

        if (!(file.files && file.files.length > 0)) {
          if (file.name.includes('video')) {
            const message =
              locale === 'ko' ? '비디오 파일이 존재 하지 않습니다' : 'Unexists video file'
            throw new Error(message)
          } else if (file.name.includes('image')) {
            const message =
              locale === 'ko' ? '이미지 파일이 존재 하지 않습니다' : 'Unexists image file'
            throw new Error(message)
          }
        }
      })

      // initialize
      nodes.forEach((label) => {
        const svg = label.querySelector('svg')
        const file = label.nextSibling as HTMLInputElement

        if (label.classList.contains('loading')) {
          label.classList.remove('loading')

          if (svg) svg.innerHTML = '<path d="M 4,12 C 4,12 12,20 12,20 C 12,20 20,12 20,12" />'
        }

        if (file) file.value = ''
      })

      video && image && onVodChange(video, image)
    } catch (error) {
      getError(error)
    }
  }

  return (
    <Container>
      <div className="box">
        <FileButton
          className="fileLabel"
          id="videoFile"
          name="videoFile"
          accept="video/mp4"
          paragraph={{ first: 'Select Video', second: video ? video.name : '' }}
          onChange={(event) => {
            const target = event.target as HTMLInputElement
            if (target.files && target.files.length > 0) {
              setVideo(target.files[0])
            }
          }}
        />
      </div>
      <div className="box">
        <FileButton
          className="fileLabel"
          id="imageFile"
          name="imageFile"
          accept=".png, .jpeg, .jpg"
          paragraph={{ first: 'Select Image', second: image ? image.name : '' }}
          onChange={(event) => {
            const target = event.target as HTMLInputElement
            if (target.files && target.files.length > 0) {
              setImage(target.files[0])
            }
          }}
        />
      </div>
      <Button
        type="primary"
        role="button"
        htmlType="button"
        className="addButton"
        onClick={onAdd}
        disabled={vodInfo && vodInfo.length > 7}>
        {locale === 'ko' ? '추가' : 'Add'}
      </Button>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-evenly;
  gap: 2rem;

  padding: 1rem 2rem;

  ${md} {
    gap: 1rem;
  }

  .box {
    display: inline-flex;
    align-items: center;
    flex-flow: column nowrap;

    ${md} {
      width: 100%;
    }
  }

  .addButton {
    height: 2rem;
    border-radius: 0.5rem;

    ${md} {
      width: 100%;
    }
  }
`

export default VodUploadContainer
