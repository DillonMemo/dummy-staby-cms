import gql from 'graphql-tag'

export const MY_QUERY = gql`
  query My {
    my {
      _id
      email
      password
      nickName
      profileImageName
      memberStatus
      memberType
      refreshToken
      lastLoginDate
    }
  }
`

export const MEMBER_QUERY = gql`
  query FindMemberById($memberInput: MemberInput!) {
    findMemberById(input: $memberInput) {
      ok
      error {
        ko
        en
      }
      member {
        email
        nickName
        memberStatus
        memberType
        point {
          totalPoint
          paidPoint
          freePoint
        }
        createdAt
      }
    }
  }
`

export const FIND_MEMBERS_BY_TYPE_QUERY = gql`
  query FindMembersByType($membersByTypeInput: MembersByTypeInput!) {
    findMembersByType(input: $membersByTypeInput) {
      ok
      error {
        ko
        en
      }
      members {
        _id
        nickName
        memberStatus
        memberType
      }
    }
  }
`
export const LIVE_QUERY = gql`
  query FindLiveById($liveInput: LiveInput!) {
    findLiveById(input: $liveInput) {
      ok
      error {
        ko
        en
      }
      live {
        _id
        title
        content
        hostName
        paymentAmount
        livePreviewDate
        liveStartDate
        liveEndDate
        mainImageName
        liveLinkInfo {
          linkPath
          playingImageName
          listingOrder
        }
        liveShareInfo {
          # 지분정보
          shareApplyDate # 지분시작일자 (=== 라이브시작일자)
          memberShareInfo {
            memberId # 회원 ID
            priorityShare # 우선환수 지분률
            directShare # 직분배 지분률
          }
        }
        viewCount
        delayedEntryTime
        likeCount
        liveStatus
        vodId
        createdAt
        updatedAt
      }
    }
  }
`
