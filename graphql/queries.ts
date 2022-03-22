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
      accountInfo {
        bankName
        depositor
        accountNumber
      }
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
        createDate
        accountInfo {
          bankName
          depositor
          accountNumber
        }
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
          liveId # 라이브 고유식별 ID
          memberShareInfo {
            memberId # 회원 ID
            nickName # 닉네임
            priorityShare # 우선환수 지분률
            directShare # 직분배 지분률
          }
        }
        viewCount
        delayedEntryTime
        likeCount
        liveStatus
        vodId
        createDate
        updateDate
      }
    }
  }
`

export const VOD_QUERY = gql`
  query FindVodById($vodInput: FindVodByIdInput!) {
    findVodById(input: $vodInput) {
      ok
      error {
        ko
        en
      }
      vod {
        _id
        title
        content
        paymentAmount
        mainImageName
        vodLinkInfo {
          linkPath
          introImageName
          playingImageName
          transcodeStatus
          listingOrder
        }
        vodShareInfo {
          # 지분정보
          shareApplyDate # 지분시작일자
          vodId # vod 고유식별 ID
          memberShareInfo {
            memberId # 회원 ID
            nickName # 닉네임
            priorityShare # 우선환수 지분률
            directShare # 직분배 지분률
          }
        }
        storageTotalCount
        vodStatus
        liveId
        createDate
        updateDate
      }
    }
  }
`

/**
 * 타입별로 LIVE를 검색 합니다.
 * @param {Array} liveStatus live status
 * @example {input: {liveStatus: [DISPLAY, ACTIVE]}}
 */
export const FIND_LIVD_BY_TYPES_QUERY = gql`
  query FindLiveByTypes($findLiveByTypesInput: FindLiveByTypesInput!) {
    findLiveByTypes(input: $findLiveByTypesInput) {
      ok
      error {
        ko
        en
      }
      lives {
        _id
        title
      }
    }
  }
`

/**
 * 타입별로 VOD를 검색합니다
 * @param {Array} vodStatus vod status
 * @example {input: {vodStatus: [WAIT, ...]}}
 */
export const FIND_VOD_BY_TYPES_QUERY = gql`
  query FindVodByTypes($findVodByTypesInput: FindVodByTypesInput!) {
    findVodByTypes(input: $findVodByTypesInput) {
      ok
      error {
        ko
        en
      }
      vods {
        _id
        title
      }
    }
  }
`

/**
 * 콘텐츠 목록들을 가져옵니다.
 */
export const MAIN_BANNER_LIVE_CONTENTS_QUERY = gql`
  query MainBannerLiveContents {
    mainBannerLiveContents {
      ok
      error {
        ko
        en
      }
      mainBannerLives {
        liveId
        listingOrder
        title
      }
    }
  }
`

/**
 * 고유식별아이디로 특정 광고를 가져옵니다.
 * @example {input: {_id: <ObjectId>}}
 */
export const FIND_ADVERTISEMENT_BY_ID_QUERY = gql`
  query FindAdvertisementById($findAdvertisementByIdInput: FindAdvertisementByIdInput!) {
    findAdvertisementById(input: $findAdvertisementByIdInput) {
      ok
      error {
        ko
        en
      }
      advertisement {
        _id
        advertiseStatus
        displayType
        displayDeviceType
        title
        content
        mainImageName
        linkType
        linkUrl
        startDate
        endDate
      }
    }
  }
`

/**
 * ID별로 게시판을 데이터를 검색합니다
 */
export const FIND_BOARD_BY_ID_QUERY = gql`
  query FindBoardById($boardInput: BoardInput!) {
    findBoardById(input: $boardInput) {
      ok
      error {
        ko
        en
      }
      board {
        email
        title
        content
        questionType
        boardStatus
        faqType
        uploadImageInfo {
          uploadImageName
          displayOrder
        }
        answerInfo {
          answer
          createDate
        }
        createDate
      }
    }
  }
`

/**
 * Going 대쉬보드 데이터를 가져옵니다
 */
export const GET_GOING_DASHBOARD = gql`
  query GetGoingDashboard {
    getGoingDashboard {
      ok
      error {
        ko
        en
      }
      dashboard {
        totalMemberCount
        loginCountByDate
      }
    }
  }
`
