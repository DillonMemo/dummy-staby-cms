import { Button, Input } from 'antd'
import { useRouter } from 'next/router'
import React, { ReactNode, useState } from 'react'

interface ChangeFileInputProps {
  children?: ReactNode
  src: string | undefined
  onChange?: any
  setValue?: any
  name: string
  Fname?: string
}

const ChangeFileInput = ({ src, onChange, name }: ChangeFileInputProps) => {
  const [isEdit, setIsEdit] = useState(false)
  const { locale } = useRouter()
  //   const changeInput = useRef<any>(null)

  const onBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsEdit(!isEdit)
  }

  //   const onChangeFile = () => {
  //     if (changeInput.current?.state.value) {
  //       setValue(Fname, changeInput.current.state.value)
  //       setIsEdit(false)
  //     }
  //   }

  return (
    <>
      {isEdit ? (
        <Input
          type="file"
          className="input"
          name={name}
          placeholder="Please upload img. only png or jpg"
        />
      ) : (
        <Input
          type="text"
          className="input"
          name={name}
          placeholder={src}
          // value={src}
          onChange={onChange}
          disabled={true}
        />
      )}

      <div className="edit-btn mt-half">
        <Button type="primary" onClick={onBtnClick}>
          {isEdit ? (locale === 'ko' ? '취소' : 'cancel') : locale === 'ko' ? '수정' : 'edit'}
        </Button>
        {/* {isEdit && (
          <Button type="primary" className="ml-harf" onClick={onChangeFile}>
            확인
          </Button>
        )} */}
      </div>
    </>
  )
}

export default ChangeFileInput
