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
        report {
          memberReportStatus
          chatCount
          commentCount
          releaseDate
        }
        createDate
        lastLoginDate
        accountInfo {
          bankName
          depositor
          accountNumber
        }
        pushInfo {
          pushType
          notificationFlag
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
        liveRatioType
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
        vodRatioType
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
export const FIND_LIVE_BY_TYPES_QUERY = gql`
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
        createMember {
          email
        }
        createDate
      }
    }
  }
`

/**
 * Going 대쉬보드 - 총 회원수 데이터를 가져옵니다
 */
export const GET_TOTAL_MEMBERS = gql`
  query GetTotalMembers {
    getTotalMembers {
      ok
      error {
        ko
        en
      }
      count
    }
  }
`

/**
 * 컨텐츠별 조회수를 가져옵니다.
 * @example {input: {date: <Date>}}
 */
export const GET_CONTENTS_VIEW_COUNT = gql`
  query GetContentsViewCount($getContentsViewCountInput: GetContentsViewCountInput!) {
    getContentsViewCount(input: $getContentsViewCountInput) {
      ok
      error {
        ko
        en
      }
      lives {
        _id
        title
        viewCount
      }
      vods {
        _id
        title
        viewCount
      }
    }
  }
`

/**
 * 신규 가입자 정보를 가져옵니다.
 * @example {input: {date: <Date>}}
 */
export const GET_NEW_MEMBERS = gql`
  query GetNewMembers($getNewMembersInput: GetNewMembersInput!) {
    getNewMembers(input: $getNewMembersInput) {
      ok
      error {
        ko
        en
      }
      counts
    }
  }
`

/**
 * 일일 접속자 정보를 가져옵니다.
 * @example {input: {date: <Date>}}
 */
export const GET_DAILY_ACCESSOR = gql`
  query GetDailyAccessor($getDailyAccessorInput: GetDailyAccessorInput!) {
    getDailyAccessor(input: $getDailyAccessorInput) {
      ok
      error {
        ko
        en
      }
      counts
    }
  }
`

/**
 * 일일 OS별 접속자 정보를 가져옵니다.
 * @example {input: {date: <Date>}}
 */
export const GET_USER_BY_OS = gql`
  query GetUserByOS($getUserByOsInput: GetUserByOSInput!) {
    getUserByOs(input: $getUserByOsInput) {
      ok
      error {
        ko
        en
      }
      iosCounts
      androidCounts
    }
  }
`

/**
 * 문의 내역 정보를 가져옵니다.
 */
export const GET_INQUIRIES_HISTORY = gql`
  query GetInquiriesHistory {
    getInquiriesHistory {
      ok
      error {
        ko
        en
      }
      pendingInquiry
      processedInquiry
      inquiries {
        _id
        memberId
        title
        createMember {
          email
        }
        createDate
      }
    }
  }
`
/**
 * 구매 포인트 데이터 정보를 가져옵니다.
 */
export const GET_PAY_HISTORY_BY_OS = gql`
  query GetPayHistoryByOS {
    getPayHistoryByOS {
      ok
      error {
        ko
        en
      }
      android
      ios
    }
  }
`
