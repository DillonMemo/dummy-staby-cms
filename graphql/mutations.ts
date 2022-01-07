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
        point {
          totalPoint
          paidPoint
          freePoint
        }
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
