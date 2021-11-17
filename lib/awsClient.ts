import AWS from 'aws-sdk'

const AWS_REGION = process.env.NEXT_PUBLIC_AWS_REGION
const AWS_ACCESS_KEY_ID = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
const AWS_BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME

AWS.config.update({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
})

export const S3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: AWS_BUCKET_NAME },
})

export const replaceStr = (str: string) =>
  str
    .replace(
      /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g,
      ''
    )
    .replace(/[~!@#£$%^&*()_+=|<>?:;`,{}\]\[/\'\"\\\']/g, '')
    .replace(/(\s)/g, '-')
