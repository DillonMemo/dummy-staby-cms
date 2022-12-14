import gql from 'graphql-tag'

/** 로그인 Mutation. */
export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      error {
        ko
        en
      }
      token
    }
  }
`

/** 회원 생성 */
export const CREATE_ACCOUNT_MUTATION = gql`
  mutation CreateAccount($createMemberInput: CreateMemberInput!) {
    createAccount(input: $createMemberInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`

/** 마이페이지 > 수정 Mutation */
export const EDIT_ACCOUNT_MUTATION = gql`
  mutation EditAccount($editMemberInput: EditMemberInput!) {
    editAccount(input: $editMemberInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`

/** 로그아웃 Mutation */
export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      ok
      error {
        ko
        en
      }
    }
  }
`

/** Member List Mutation */
export const MEMBERS_MUTATION = gql`
  mutation Members($membersInput: MembersInput!) {
    members(input: $membersInput) {
      ok
      error {
        ko
        en
      }
      totalResults
      totalPages
      members {
        _id
        email
        nickName
        memberStatus
        memberType
        createDate
      }
    }
  }
`

/** Edit Member by (_id) */
export const EDIT_MEMBER_BY_ID_MUTATION = gql`
  mutation EditMemberById($editMemberInput: EditMemberInput!) {
    editMemberById(input: $editMemberInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`

/** Create Live */
export const CREATE_LIVE_MUTATION = gql`
  mutation CreateLive($createLiveInput: CreateLiveInput!) {
    createLive(input: $createLiveInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`
/** get live list mutation */
export const LIVES_MUTATION = gql`
  mutation Lives($livesInput: LivesInput!) {
    lives(input: $livesInput) {
      ok
      error {
        ko
        en
      }
      totalPages
      totalResults
      lives {
        _id # ID
        title # 제목
        content # 설명 및 내용
        hostName # 진행자명
        paymentAmount # 결제금액
        livePreviewDate # 라이브예고일자
        liveStartDate # 라이브시작일자
        liveEndDate # 라이브종료일자
        mainImageName # 라이브메인이미지
        liveLinkInfo {
          # 라이브영상링크정보
          linkPath # 채널 링크 Path + 파일명
          playingImageName # 플레이중 이미지 파일명
          listingOrder # 노출 순서
        }
        viewCount # 조회수
        delayedEntryTime # 진행후결제가능시간
        likeCount # 좋아요 수
        liveStatus # 라이브상태
        vodId # VOD 고유식별 ID (종료 후 등록된 VOD)
        createDate # 등록일
      }
    }
  }
`

/** Edit Live */
export const EDIT_LIVE_MUTATION = gql`
  mutation EditLive($editLiveInput: EditLiveInput!) {
    editLive(input: $editLiveInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`

/** Delete Live */
export const DELETE_LIVE_MUTATION = gql`
  mutation DeleteLive($deleteLiveInput: DeleteLiveInput!) {
    deleteLive(input: $deleteLiveInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`

/** Create VOD */
export const CREATE_VOD_MUTATION = gql`
  mutation CreateVod($createVodInput: CreateVodInput!) {
    createVod(input: $createVodInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`

/** get VOD list mutation */
export const VODS_MUTATION = gql`
  mutation Vods($vodsInput: VodsInput!) {
    vods(input: $vodsInput) {
      ok
      error {
        ko
        en
      }
      totalPages
      totalResults
      vods {
        _id # VOD 고유식별 ID
        title # 제목
        content # 설명 및 내용
        paymentAmount # 결제금액
        viewCount # 조회수
        storageTotalCount # 찜 총건수
        mainImageName # VOD메인이미지
        liveId # LIVE 고유식별 ID (선택한 LIVE)
        vodStatus # VOD 상태
        createDate # 등록일
      }
    }
  }
`

/** Edit Vod */
export const EDIT_VOD_MUTATION = gql`
  mutation EditVod($editVodInput: EditVodInput!) {
    editVod(input: $editVodInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`

/** Delete Vod */
export const DELETE_VOD_MUTATION = gql`
  mutation DeleteVod($deleteVodInput: DeleteVodInput!) {
    deleteVod(input: $deleteVodInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`

/** Main Banner Live Mutation */
export const CREATE_MAIN_BANNER_LIVE_MUTATION = gql`
  mutation CreateMainBannerLiveContents($createMainBannerLiveInput: CreateMainBannerLiveInput!) {
    createMainBannerLiveContents(input: $createMainBannerLiveInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`

/**
 * AD(광고)를 생성 합니다
 * @default advertiseStatus WAIT
 * @example {input: {
 *  _id: <ObjectId>
 *  displayType: <Enum>
 *  title: <String>
 *  mainImageName: <String>
 *  linkType: <Enum>
 *  linkUrl: <String>
 *  startDate: <Date>
 *  endDate: <Date>
 * }}
 */
export const CREATE_ADVERTISEMENT_MUTATION = gql`
  mutation CreateAdvertisement($createAdvertisementInput: CreateAdvertisementInput!) {
    createAdvertisement(input: $createAdvertisementInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`

/**
 * AD(광고) 목록을 가져옵니다
 * @default page 1
 * @default pageView 20
 * @example {input: {
 *  page: <Number>
 *  pageView: <Number>
 *  displayType: <Enum>
 * }}
 */
export const ADVERTISEMENTS_MUTATION = gql`
  mutation Advertisements($advertisementsInput: AdvertisementsInput!) {
    advertisements(input: $advertisementsInput) {
      ok
      error {
        ko
        en
      }
      totalPages
      totalResults
      advertisements {
        _id
        advertiseStatus
        displayType
        title
        content
        linkType
        linkUrl
        startDate
        endDate
        createDate
      }
    }
  }
`

/**
 * AD(광고)를 수정 합니다
 * @example {input: {
 *  _id: <ObjectId>
 *  displayType: <Enum>
 *  title: <String>
 *  mainImageName: <String>
 *  linkType: <Enum>
 *  linkUrl: <String>
 *  startDate: <Date>
 *  endDate: <Date>
 * }}
 */
export const EDIT_ADVERTISEMENTS_MUTATION = gql`
  mutation EditAdvertisement($editAdvertisementInput: EditAdvertisementInput!) {
    editAdvertisement(input: $editAdvertisementInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`

/**
 * AD(광고)의 상태를 변경합니다.
 * @default advertiseStatus WAIT
 * @example {input: {
 *  _id: <ObjectId>
 *  advertiseStatus: <Enum>
 * }}
 */
export const CHANGE_ADVERTISEMENT_STATUS_MUTATION = gql`
  mutation ChangeAdvertisementStatus(
    $changeAdvertisementStatusInput: ChangeAdvertisementStatusInput!
  ) {
    changeAdvertisementStatus(input: $changeAdvertisementStatusInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`

/**
 * 공지사항글을 생성 합니다.
 * @example {input: {
 *  title: <String>
 *  content: <String>
 * }}
 */
export const CREATE_NOTICE_MUTATION = gql`
  mutation CreateNotice($createNoticeInput: CreateNoticeInput!) {
    createNotice(input: $createNoticeInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`

/**
 * 공지사항 목록을 가져옵니다.
 * @default page 1
 * @default pageView 20
 * @example {input: {
 *  page: <Number>
 *  pageView: <Number>
 * }}
 */
export const NOTICES_MUTATION = gql`
  mutation Notices($noticesInput: NoticesInput!) {
    notices(input: $noticesInput) {
      ok
      error {
        ko
        en
      }
      totalPages
      totalResults
      notices {
        _id
        title
        content
        boardCategoryType
        createDate
      }
    }
  }
`

/**
 * 공지사항을 수정합니다.
 * @example {input: {
 *  _id: <ObjectId>
 *  title: <String>
 *  content: <String>
 * }}
 */
export const EDIT_NOTICE_MUTATION = gql`
  mutation EditNotice($editNoticeInput: EditNoticeInput!) {
    editNotice(input: $editNoticeInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`

/**
 * 게시판을 삭제 합니다.
 * @example {input: {
 *  boardId: <ObjectId>
 * }}
 */
export const DELETE_BOARD_MUTATION = gql`
  mutation DeleteBoard($deleteBoardInput: DeleteBoardInput!) {
    deleteBoard(input: $deleteBoardInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`

/**
 * 이벤트 게시판을 생성 합니다.
 * @example {input: {
 *  title: <String>
 *  content: <String>
 * }}
 */
export const CREATE_EVENT_MUTATION = gql`
  mutation CreateEvent($createEventInput: CreateEventInput!) {
    createEvent(input: $createEventInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`
/**
 * 이벤트 목록을 가져옵니다.
 * @default page 1
 * @default pageView 20
 * @example {input: {
 *  page: <Number>
 *  pageView: <Number>
 * }}
 */
export const EVENTS_MUTATION = gql`
  mutation Events($eventsInput: EventsInput!) {
    events(input: $eventsInput) {
      ok
      error {
        ko
        en
      }
      totalPages
      totalResults
      events {
        _id
        title
        content
        boardCategoryType
        createDate
      }
    }
  }
`

/**
 * 이벤트를 수정합니다.
 * @example {input: {
 *  _id: <ObjectId>
 *  title: <String>
 *  content: <String>
 * }}
 */
export const EDIT_EVENT_MUTATION = gql`
  mutation EditEvent($editEventInput: EditEventInput!) {
    editEvent(input: $editEventInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`

/**
 * FAQ 게시판을 생성 합니다.
 * @example {input: {
 *  title: <String>
 *  content: <String>
 *  faqType: <Enum>
 * }}
 */
export const CREATE_FAQ_MUTATION = gql`
  mutation CreateFaq($createFaqInput: CreateFaqInput!) {
    createFaq(input: $createFaqInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`
/**
 * FAQ 목록을 가져옵니다.
 * @default page 1
 * @default pageView 20
 * @example {input: {
 *  page: <Number>
 *  pageView: <Number>
 *  faqType: <Enum>
 * }}
 */
export const FAQS_MUTATION = gql`
  mutation Faqs($faqsInput: FaqsInput!) {
    faqs(input: $faqsInput) {
      ok
      error {
        ko
        en
      }
      totalPages
      totalResults
      faqs {
        _id
        title
        content
        boardCategoryType
        faqType
        createDate
      }
    }
  }
`

/**
 * FAQ를 수정합니다.
 * @example {input: {
 *  _id: <ObjectId>
 *  title: <String>
 *  content: <String>
 *  faqType: <Enum>
 * }}
 */
export const EDIT_FAQ_MUTATION = gql`
  mutation EditFaq($editFaqInput: EditFaqInput!) {
    editFaq(input: $editFaqInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`

/**
 * 문의 게시판에서 답변을 생성 합니다.
 * @example {input: {
 *  answerInfo: {
 *    answer: <String>
 *    createDate: <Date>
 *  }
 * }}
 */
export const CREATE_ANSWER_MUTATION = gql`
  mutation CreateAnswer($createAnswerInput: CreateAnswerInput!) {
    createAnswer(input: $createAnswerInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`

/**
 * 문의 목록을 가져옵니다.
 * @default page 1
 * @default pageView 20
 * @example {input: {
 *  page: <Number>
 *  pageView: <Number>
 *  questionType?: <Enum>
 * }}
 */
export const INQUIRIES_MUTATION = gql`
  mutation Inquiries($inquiriesInput: InquiriesInput!) {
    inquiries(input: $inquiriesInput) {
      ok
      error {
        ko
        en
      }
      totalPages
      totalResults
      inquiries {
        _id
        title
        questionType
        boardStatus
        createDate
        createMember {
          email
        }
      }
    }
  }
`

/**
 * 회원 정지를 요청 합니다.
 * @example {input: {
 *  memberId: <ObjectId>
 *  increase: <Number>
 * }}
 */
export const SUSPEND_MEMBER_BY_ID_MUTATION = gql`
  mutation SuspendMemberById($memberSuspendInput: MemberSuspendInput!) {
    suspendMemberById(input: $memberSuspendInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`

/**
 * 특정 회원의 로그 이력 데이터를 가져옵니다
 * @example {input: {
 *  memberId: <ObjectId>
 *  serviceType: <Enum>
 *  activeType: <Enum>
 *  dates: <Date[]>
 * }}
 */
export const ACTIVE_HISTORIES_BY_MEMBER_ID_MUTATION = gql`
  mutation ActiveHistoriesByMemberId(
    $activeHistoriesByMemberIdInput: ActiveHistoriesByMemberIdInput!
  ) {
    activeHistoriesByMemberId(input: $activeHistoriesByMemberIdInput) {
      ok
      error {
        ko
        en
      }
      totalPages
      totalResults
      goingActiveLog {
        memberType
        categoryType
        activeType
        serviceType
        content
        createDate
      }
    }
  }
`

/**
 * 특정 회원의 포인트 사용, 충전 이력 데이터를 가져옵니다
 * @example {input: {
 *  memberId: <ObjectId>
 *  pointPayStatus: <Enum>
 *  dates: <Date[]>
 * }}
 */
export const POINT_HISTORIES_BY_MEMBER_ID_MUTATION = gql`
  mutation PointHistoriesByMemberId(
    $pointHistoriesByMemberIdInput: PointHistoriesByMemberIdInput!
  ) {
    pointHistoriesByMemberId(input: $pointHistoriesByMemberIdInput) {
      ok
      error {
        ko
        en
      }
      totalPages
      totalResults
      pointPayHistoryView {
        _id
        pointPayType
        pointPayStatus
        amount
        content
        createDate
      }
    }
  }
`

/**
 * 특정 회원의 댓글 이력 데이터를 가져옵니다
 * @example {input: {
 *  memberId: <ObjectId>
 *  dates: <Date[]>
 * }}
 */
export const COMMENT_HISTORIES_BY_MEMBER_ID_MUTATION = gql`
  mutation CommentHistoriesByMemberId(
    $commentHistoriesByMemberIdInput: CommentHistoriesByMemberIdInput!
  ) {
    commentHistoriesByMemberId(input: $commentHistoriesByMemberIdInput) {
      ok
      error {
        ko
        en
      }
      totalPages
      totalResults
      commentHistoryView {
        _id
        title
        content
        vodCommentStatus
        reportCount
        nickName
        createDate
      }
    }
  }
`

/**
 * 특정 VOD 댓글을 삭제 합니다.
 * @example {input: {
 *  _id: <ObjectId>
 * }}
 */
export const DELETE_VOD_COMMENT_MUTATION = gql`
  mutation DeleteVodComment($deleteVodCommentInput: DeleteVodCommentInput!) {
    deleteVodComment(input: $deleteVodCommentInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`

/**
 * 샌드버드 특정 회원의 메시지 내용을 가져옵니다
 * @example {input: {
 *  historyId: <ObjectId>
 *  timestemp: <Number>
 *  messages: <Message[]>
 * }}
 */
export const LIST_SENDBIRD_MESSAGES = gql`
  mutation ListSendBirdMessages(
    $liveChatHistoriesByHistoryIdInput: LiveChatHistoriesByHistoryIdInput!
  ) {
    listSendbirdMessages(input: $liveChatHistoriesByHistoryIdInput) {
      ok
      error {
        ko
        en
      }
      email
      nickName
      liveTitle
      liveStartDate
      messages {
        message_id
        type
        message
        created_at
      }
      isDisable
    }
  }
`

/**
 * 채널 상태를 가져옵니다
 * @example {input: {
 *  channelId: <String>
 * }}
 */
export const CHANNEL_STATUS_MUTATION = gql`
  mutation ChannelStatus($channelStatusInput: ChannelStatusInput!) {
    channelStatus(input: $channelStatusInput) {
      ok
      error {
        ko
        en
      }
      code
      message
    }
  }
`

/**
 * 채널 상태를 변경 합니다
 * @example {input: {
 *  checked: <Boolean>
 *  channelId: <String>
 * }}
 */
export const EDIT_CHANNEL_MUTATION = gql`
  mutation EditChannel($editChannelInput: EditChannelInput!) {
    editChannel(input: $editChannelInput) {
      ok
      error {
        ko
        en
      }
    }
  }
`
