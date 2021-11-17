import gql from 'graphql-tag'

export const MY_QUERY = gql`
  query My {
    my {
      _id
      email
      password
      nickname
      profileImageName
      memberStatus
      memberType
      refreshToken
      lastLoginDate
    }
  }
`
