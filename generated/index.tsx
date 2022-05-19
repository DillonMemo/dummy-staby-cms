// THIS IS A GENERATED FILE, use `npm run codegen` or `yarn codegen` to regenerate
/* tslint:disable */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type AccountInfo = {
  __typename?: 'AccountInfo';
  accountNumber: Scalars['String'];
  bankName: Scalars['String'];
  depositor: Scalars['String'];
};

export type AccountInfoInputType = {
  accountNumber: Scalars['String'];
  bankName: Scalars['String'];
  depositor: Scalars['String'];
};

export type ActiveHistoriesByMemberIdInput = {
  activeType?: Maybe<ActiveType>;
  dates?: Maybe<Array<Scalars['DateTime']>>;
  memberId: Scalars['ID'];
  page?: Maybe<Scalars['Int']>;
  pageView?: Maybe<Scalars['Int']>;
  serviceType?: Maybe<ServiceType>;
};

export type ActiveHistoriesByMemberIdOutput = {
  __typename?: 'ActiveHistoriesByMemberIdOutput';
  error?: Maybe<LangErrorMessage>;
  goingActiveLog?: Maybe<Array<GoingActiveLog>>;
  ok: Scalars['Boolean'];
  totalPages?: Maybe<Scalars['Int']>;
  totalResults?: Maybe<Scalars['Int']>;
};

export enum ActiveType {
  Away = 'AWAY',
  Charge = 'CHARGE',
  Delete = 'DELETE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Modify = 'MODIFY',
  New = 'NEW',
  Payment = 'PAYMENT',
  Refund = 'REFUND',
  View = 'VIEW'
}

export enum AdvertiseStatus {
  Display = 'DISPLAY',
  Removed = 'REMOVED',
  Wait = 'WAIT'
}

export type Advertisement = {
  __typename?: 'Advertisement';
  _id: Scalars['ID'];
  advertiseStatus: AdvertiseStatus;
  content?: Maybe<Scalars['String']>;
  createDate: Scalars['DateTime'];
  createMember: AuthMember;
  displayCount: Scalars['Float'];
  displayDeviceType: DisplayDeviceType;
  displayType: DisplayType;
  endDate: Scalars['DateTime'];
  linkType: LinkType;
  linkUrl: Scalars['String'];
  listingOrder?: Maybe<Scalars['Float']>;
  mainImageName: Scalars['String'];
  startDate: Scalars['DateTime'];
  title: Scalars['String'];
  updateDate: Scalars['DateTime'];
  updateMember: AuthMember;
};

export type AdvertisementsInput = {
  displayType?: Maybe<DisplayType>;
  page?: Maybe<Scalars['Int']>;
  pageView?: Maybe<Scalars['Int']>;
};

export type AdvertisementsOutput = {
  __typename?: 'AdvertisementsOutput';
  advertisements?: Maybe<Array<Advertisement>>;
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
  totalPages?: Maybe<Scalars['Int']>;
  totalResults?: Maybe<Scalars['Int']>;
};

export type AnswerInfo = {
  __typename?: 'AnswerInfo';
  answer: Scalars['String'];
  createDate: Scalars['DateTime'];
};

export type AnswerInfoInputType = {
  answer: Scalars['String'];
  createDate: Scalars['DateTime'];
};

export type AuthMember = {
  __typename?: 'AuthMember';
  email: Scalars['String'];
  memberId: Scalars['ID'];
};

export type Board = {
  __typename?: 'Board';
  _id: Scalars['ID'];
  answerInfo?: Maybe<AnswerInfo>;
  boardCategoryType: BoardCategoryType;
  boardStatus: BoardStatus;
  content: Scalars['String'];
  createDate: Scalars['DateTime'];
  createMember: AuthMember;
  email?: Maybe<Scalars['String']>;
  faqType?: Maybe<FaqType>;
  memberId: Scalars['ID'];
  questionType?: Maybe<QuestionType>;
  title: Scalars['String'];
  updateDate: Scalars['DateTime'];
  updateMember: AuthMember;
  uploadImageInfo?: Maybe<Array<UploadImageInfo>>;
};

export enum BoardCategoryType {
  Event = 'EVENT',
  Faq = 'FAQ',
  Notice = 'NOTICE',
  Qna = 'QNA'
}

export type BoardInput = {
  boardId: Scalars['ID'];
};

export type BoardOutput = {
  __typename?: 'BoardOutput';
  board?: Maybe<Board>;
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export enum BoardStatus {
  Completed = 'COMPLETED',
  Delete = 'DELETE',
  Display = 'DISPLAY',
  Wait = 'WAIT'
}

export enum CategoryType {
  Comment = 'COMMENT',
  Event = 'EVENT',
  Faq = 'FAQ',
  Live = 'LIVE',
  Livefavorite = 'LIVEFAVORITE',
  Member = 'MEMBER',
  Notice = 'NOTICE',
  Payment = 'PAYMENT',
  Qna = 'QNA',
  Report = 'REPORT',
  Vod = 'VOD',
  Vodfavorite = 'VODFAVORITE'
}

export type ChangeAdvertisementStatusInput = {
  _id: Scalars['ID'];
  advertiseStatus?: Maybe<AdvertiseStatus>;
};

export type ChangeAdvertisementStatusOutput = {
  __typename?: 'ChangeAdvertisementStatusOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export type CommentHistoriesByMemberIdInput = {
  dates?: Maybe<Array<Scalars['DateTime']>>;
  memberId: Scalars['ID'];
  page?: Maybe<Scalars['Int']>;
  pageView?: Maybe<Scalars['Int']>;
};

export type CommentHistoriesByMemberIdOutput = {
  __typename?: 'CommentHistoriesByMemberIdOutput';
  commentHistoryView?: Maybe<Array<CommentHistoryView>>;
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
  totalPages?: Maybe<Scalars['Int']>;
  totalResults?: Maybe<Scalars['Int']>;
};

export type CommentHistoryView = {
  __typename?: 'CommentHistoryView';
  _id: Scalars['ID'];
  content: Scalars['String'];
  createDate: Scalars['DateTime'];
  createMember: AuthMember;
  memberId: Scalars['ID'];
  nickName: Scalars['String'];
  reportCount: Scalars['Float'];
  title: Scalars['String'];
  updateDate: Scalars['DateTime'];
  updateMember: AuthMember;
  vodCommentStatus: VodCommentStatus;
  vodId: Scalars['ID'];
};

export type CreateAdvertisementInput = {
  advertiseStatus?: Maybe<AdvertiseStatus>;
  displayDeviceType: DisplayDeviceType;
  displayType: DisplayType;
  endDate: Scalars['DateTime'];
  linkType: LinkType;
  linkUrl: Scalars['String'];
  mainImageName: Scalars['String'];
  startDate: Scalars['DateTime'];
  title: Scalars['String'];
};

export type CreateAdvertisementOutput = {
  __typename?: 'CreateAdvertisementOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export type CreateAnswerInput = {
  _id?: Maybe<Scalars['ID']>;
  answerInfo?: Maybe<AnswerInfoInputType>;
};

export type CreateAnswerOutput = {
  __typename?: 'CreateAnswerOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export type CreateEventInput = {
  content?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type CreateEventOutput = {
  __typename?: 'CreateEventOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export type CreateFaqInput = {
  content?: Maybe<Scalars['String']>;
  faqType?: Maybe<FaqType>;
  title?: Maybe<Scalars['String']>;
};

export type CreateFaqOutput = {
  __typename?: 'CreateFaqOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export type CreateLiveInput = {
  _id: Scalars['ID'];
  content?: Maybe<Scalars['String']>;
  delayedEntryTime: Scalars['Float'];
  hostName: Scalars['String'];
  liveEndDate?: Maybe<Scalars['DateTime']>;
  liveLinkInfo: Array<LiveLinkInfoInputType>;
  livePreviewDate: Scalars['DateTime'];
  liveShareInfo: LiveShareInfoInputType;
  liveStartDate?: Maybe<Scalars['DateTime']>;
  liveStatus?: Maybe<LiveStatus>;
  mainImageName: Scalars['String'];
  paymentAmount: Scalars['Float'];
  storageTotalCount?: Maybe<Scalars['Float']>;
  title: Scalars['String'];
  viewCount?: Maybe<Scalars['Float']>;
};

export type CreateLiveOutput = {
  __typename?: 'CreateLiveOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export type CreateMainBannerLiveInput = {
  mainBannerLive: Array<MainBannerLiveInputType>;
};

export type CreateMainBannerLiveOutput = {
  __typename?: 'CreateMainBannerLiveOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export type CreateMemberInput = {
  accountInfo?: Maybe<AccountInfoInputType>;
  email: Scalars['String'];
  memberType?: Maybe<MemberType>;
  nickName: Scalars['String'];
  password: Scalars['String'];
};

export type CreateMemberOutput = {
  __typename?: 'CreateMemberOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export type CreateNoticeInput = {
  content?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type CreateNoticeOutput = {
  __typename?: 'CreateNoticeOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export type CreateVodInput = {
  _id: Scalars['ID'];
  content?: Maybe<Scalars['String']>;
  liveId?: Maybe<Scalars['ID']>;
  mainImageName: Scalars['String'];
  paymentAmount: Scalars['Float'];
  storageTotalCount?: Maybe<Scalars['Float']>;
  title: Scalars['String'];
  viewCount?: Maybe<Scalars['Float']>;
  vodLinkInfo: Array<VodLinkInfoInputType>;
  vodRatioType?: Maybe<VodRatioType>;
  vodShareInfo: VodShareInfoInputType;
  vodStatus?: Maybe<VodStatus>;
};

export type CreateVodOutput = {
  __typename?: 'CreateVodOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export type DeleteBoardInput = {
  boardId: Scalars['ID'];
};

export type DeleteBoardOutput = {
  __typename?: 'DeleteBoardOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export type DeleteLiveInput = {
  liveId: Scalars['ID'];
};

export type DeleteLiveOutput = {
  __typename?: 'DeleteLiveOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export type DeleteVodCommentInput = {
  _id: Scalars['ID'];
};

export type DeleteVodCommentOutput = {
  __typename?: 'DeleteVodCommentOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export type DeleteVodInput = {
  vodId: Scalars['ID'];
};

export type DeleteVodOutput = {
  __typename?: 'DeleteVodOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export enum DisplayDeviceType {
  Android = 'ANDROID',
  Common = 'COMMON',
  Ios = 'IOS'
}

export enum DisplayType {
  Banner = 'BANNER',
  Popup = 'POPUP'
}

export type EditAdvertisementInput = {
  _id?: Maybe<Scalars['ID']>;
  displayDeviceType?: Maybe<DisplayDeviceType>;
  displayType?: Maybe<DisplayType>;
  endDate?: Maybe<Scalars['DateTime']>;
  linkType?: Maybe<LinkType>;
  linkUrl?: Maybe<Scalars['String']>;
  mainImageName?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['DateTime']>;
  title?: Maybe<Scalars['String']>;
};

export type EditAdvertisementOutput = {
  __typename?: 'EditAdvertisementOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export type EditEventInput = {
  _id?: Maybe<Scalars['ID']>;
  content?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type EditEventOutput = {
  __typename?: 'EditEventOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export type EditFaqInput = {
  _id?: Maybe<Scalars['ID']>;
  content?: Maybe<Scalars['String']>;
  faqType?: Maybe<FaqType>;
  title?: Maybe<Scalars['String']>;
};

export type EditFaqOutput = {
  __typename?: 'EditFaqOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export type EditLiveInput = {
  _id: Scalars['ID'];
  content?: Maybe<Scalars['String']>;
  delayedEntryTime: Scalars['Float'];
  hostName: Scalars['String'];
  liveEndDate?: Maybe<Scalars['DateTime']>;
  liveLinkInfo: Array<LiveLinkInfoInputType>;
  livePreviewDate: Scalars['DateTime'];
  liveShareInfo: LiveShareInfoInputType;
  liveStartDate?: Maybe<Scalars['DateTime']>;
  liveStatus?: Maybe<LiveStatus>;
  mainImageName: Scalars['String'];
  paymentAmount: Scalars['Float'];
  title: Scalars['String'];
};

export type EditLiveOutput = {
  __typename?: 'EditLiveOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export type EditMemberInput = {
  _id?: Maybe<Scalars['ID']>;
  accountInfo?: Maybe<AccountInfoInputType>;
  freePoint?: Maybe<Scalars['Int']>;
  memberStatus?: Maybe<MemberStatus>;
  memberType?: Maybe<MemberType>;
  nickName?: Maybe<Scalars['String']>;
  paidPoint?: Maybe<Scalars['Int']>;
  password?: Maybe<Scalars['String']>;
  profileImageName?: Maybe<Scalars['String']>;
};

export type EditMemberOutput = {
  __typename?: 'EditMemberOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export type EditNoticeInput = {
  _id?: Maybe<Scalars['ID']>;
  content?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type EditNoticeOutput = {
  __typename?: 'EditNoticeOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export type EditVodInput = {
  _id: Scalars['ID'];
  content?: Maybe<Scalars['String']>;
  liveId?: Maybe<Scalars['ID']>;
  mainImageName: Scalars['String'];
  paymentAmount: Scalars['Float'];
  title: Scalars['String'];
  vodLinkInfo: Array<VodLinkInfoInputType>;
  vodRatioType?: Maybe<VodRatioType>;
  vodShareInfo: VodShareInfoInputType;
  vodStatus?: Maybe<VodStatus>;
};

export type EditVodOutput = {
  __typename?: 'EditVodOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export type EventsInput = {
  dates?: Maybe<Array<Scalars['DateTime']>>;
  page?: Maybe<Scalars['Int']>;
  pageView?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
};

export type EventsOutput = {
  __typename?: 'EventsOutput';
  error?: Maybe<LangErrorMessage>;
  events?: Maybe<Array<Board>>;
  ok: Scalars['Boolean'];
  totalPages?: Maybe<Scalars['Int']>;
  totalResults?: Maybe<Scalars['Int']>;
};

export enum FaqType {
  Content = 'CONTENT',
  Etc = 'ETC',
  Member = 'MEMBER',
  Payment = 'PAYMENT',
  Play = 'PLAY',
  Service = 'SERVICE'
}

export type FaqsInput = {
  dates?: Maybe<Array<Scalars['DateTime']>>;
  faqType?: Maybe<FaqType>;
  page?: Maybe<Scalars['Int']>;
  pageView?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
};

export type FaqsOutput = {
  __typename?: 'FaqsOutput';
  error?: Maybe<LangErrorMessage>;
  faqs?: Maybe<Array<Board>>;
  ok: Scalars['Boolean'];
  totalPages?: Maybe<Scalars['Int']>;
  totalResults?: Maybe<Scalars['Int']>;
};

export type FindAdvertisementByIdInput = {
  _id: Scalars['ID'];
};

export type FindAdvertisementByIdOutput = {
  __typename?: 'FindAdvertisementByIdOutput';
  advertisement?: Maybe<Advertisement>;
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export type FindLiveByTypesInput = {
  liveStatus: Array<LiveStatus>;
};

export type FindLiveByTypesOutput = {
  __typename?: 'FindLiveByTypesOutput';
  error?: Maybe<LangErrorMessage>;
  lives: Array<Live>;
  ok: Scalars['Boolean'];
};

export type FindVodByIdInput = {
  vodId: Scalars['ID'];
};

export type FindVodByIdOutput = {
  __typename?: 'FindVodByIdOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
  vod?: Maybe<Vod>;
};

export type FindVodByTypesInput = {
  vodStatus: Array<VodStatus>;
};

export type FindVodByTypesOutput = {
  __typename?: 'FindVodByTypesOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
  vods: Array<Vod>;
};

export type GetGoingDashboardOutput = {
  __typename?: 'GetGoingDashboardOutput';
  dashboard?: Maybe<GoingDashboard>;
  error?: Maybe<LangErrorMessage>;
  memberType: MemberType;
  ok: Scalars['Boolean'];
};

export type GoingActiveLog = {
  __typename?: 'GoingActiveLog';
  _id: Scalars['ID'];
  activeType: ActiveType;
  amount?: Maybe<Scalars['Float']>;
  categoryType: CategoryType;
  content: Scalars['String'];
  createDate: Scalars['DateTime'];
  ip: Scalars['String'];
  member?: Maybe<Member>;
  memberId: Scalars['ID'];
  memberType: MemberType;
  serviceType: ServiceType;
  targetId: Scalars['ID'];
  updateDate: Scalars['DateTime'];
};

export type GoingDashboard = {
  __typename?: 'GoingDashboard';
  _id: Scalars['ID'];
  createDate: Scalars['DateTime'];
  loginCountByDate: Array<Scalars['Float']>;
  totalMemberCount: Scalars['Float'];
  updateDate: Scalars['DateTime'];
};

export type InquiriesInput = {
  boardStatus?: Maybe<BoardStatus>;
  dates?: Maybe<Array<Scalars['DateTime']>>;
  email?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  pageView?: Maybe<Scalars['Int']>;
  questionType?: Maybe<QuestionType>;
  title?: Maybe<Scalars['String']>;
};

export type InquiriesOutput = {
  __typename?: 'InquiriesOutput';
  error?: Maybe<LangErrorMessage>;
  inquiries?: Maybe<Array<Board>>;
  ok: Scalars['Boolean'];
  totalPages?: Maybe<Scalars['Int']>;
  totalResults?: Maybe<Scalars['Int']>;
};

export type LangErrorMessage = {
  __typename?: 'LangErrorMessage';
  en: Scalars['String'];
  ko: Scalars['String'];
};

export enum LinkType {
  Live = 'LIVE',
  Vod = 'VOD',
  Web = 'WEB'
}

export type Live = {
  __typename?: 'Live';
  _id: Scalars['ID'];
  content?: Maybe<Scalars['String']>;
  createDate: Scalars['DateTime'];
  createMember: AuthMember;
  delayedEntryTime: Scalars['Float'];
  hostName: Scalars['String'];
  likeCount?: Maybe<Scalars['Float']>;
  liveEndDate?: Maybe<Scalars['DateTime']>;
  liveLinkInfo: Array<LiveLinkInfo>;
  livePreviewDate: Scalars['DateTime'];
  liveShareInfo: LiveShareInfo;
  liveStartDate?: Maybe<Scalars['DateTime']>;
  liveStatus: LiveStatus;
  mainImageName: Scalars['String'];
  paymentAmount: Scalars['Float'];
  storageTotalCount: Scalars['Float'];
  title: Scalars['String'];
  updateDate: Scalars['DateTime'];
  updateMember: AuthMember;
  viewCount: Scalars['Float'];
  vodId?: Maybe<Scalars['ID']>;
};

export type LiveChatHistoriesByHistoryIdInput = {
  historyId: Scalars['ID'];
  messages?: Maybe<Array<MessageInputType>>;
  page?: Maybe<Scalars['Int']>;
  pageView?: Maybe<Scalars['Int']>;
  timestemp?: Maybe<Scalars['Float']>;
};

export type LiveChatHistoriesByHistoryIdOutput = {
  __typename?: 'LiveChatHistoriesByHistoryIdOutput';
  email?: Maybe<Scalars['String']>;
  error?: Maybe<LangErrorMessage>;
  isDisable?: Maybe<Scalars['Boolean']>;
  liveStartDate?: Maybe<Scalars['DateTime']>;
  liveTitle?: Maybe<Scalars['String']>;
  messages?: Maybe<Array<Message>>;
  nickName?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  totalPages?: Maybe<Scalars['Int']>;
  totalResults?: Maybe<Scalars['Int']>;
};

export type LiveInput = {
  liveId: Scalars['ID'];
};

export type LiveLinkInfo = {
  __typename?: 'LiveLinkInfo';
  linkPath?: Maybe<Scalars['String']>;
  listingOrder: Scalars['Float'];
  playingImageName?: Maybe<Scalars['String']>;
};

export type LiveLinkInfoInputType = {
  linkPath?: Maybe<Scalars['String']>;
  listingOrder: Scalars['Float'];
  playingImageName?: Maybe<Scalars['String']>;
};

export type LiveOutput = {
  __typename?: 'LiveOutput';
  error?: Maybe<LangErrorMessage>;
  live?: Maybe<Live>;
  ok: Scalars['Boolean'];
};

export type LiveShareInfo = {
  __typename?: 'LiveShareInfo';
  _id: Scalars['ID'];
  createDate: Scalars['DateTime'];
  liveId: Scalars['ID'];
  memberShareInfo: Array<MemberShareInfo>;
  shareApplyDate?: Maybe<Scalars['DateTime']>;
  updateDate: Scalars['DateTime'];
};

export type LiveShareInfoInputType = {
  liveId: Scalars['ID'];
  memberShareInfo: Array<MemberShareInfoInputType>;
  shareApplyDate?: Maybe<Scalars['DateTime']>;
};

export enum LiveStatus {
  Active = 'ACTIVE',
  Delete = 'DELETE',
  Display = 'DISPLAY',
  Finish = 'FINISH',
  Hide = 'HIDE'
}

export type LivesInput = {
  dates?: Maybe<Array<Scalars['DateTime']>>;
  hostName?: Maybe<Scalars['String']>;
  livePreviewDates?: Maybe<Array<Scalars['DateTime']>>;
  liveStatus?: Maybe<LiveStatus>;
  page?: Maybe<Scalars['Int']>;
  pageView?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
};

export type LivesOutput = {
  __typename?: 'LivesOutput';
  error?: Maybe<LangErrorMessage>;
  lives?: Maybe<Array<Live>>;
  ok: Scalars['Boolean'];
  totalPages?: Maybe<Scalars['Int']>;
  totalResults?: Maybe<Scalars['Int']>;
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type LoginOutput = {
  __typename?: 'LoginOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
  token?: Maybe<Scalars['String']>;
};

export type LogoutOutput = {
  __typename?: 'LogoutOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export type MainBannerLive = {
  __typename?: 'MainBannerLive';
  _id: Scalars['ID'];
  createDate: Scalars['DateTime'];
  createMember: AuthMember;
  listingOrder: Scalars['Float'];
  liveId: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  updateDate: Scalars['DateTime'];
  updateMember: AuthMember;
};

export type MainBannerLiveInputType = {
  listingOrder: Scalars['Float'];
  liveId: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
};

export type MainBannerLiveOutput = {
  __typename?: 'MainBannerLiveOutput';
  error?: Maybe<LangErrorMessage>;
  mainBannerLives?: Maybe<Array<MainBannerLive>>;
  ok: Scalars['Boolean'];
};

export type Member = {
  __typename?: 'Member';
  _id: Scalars['ID'];
  accountInfo?: Maybe<AccountInfo>;
  createDate: Scalars['DateTime'];
  email: Scalars['String'];
  lastLoginDate?: Maybe<Scalars['DateTime']>;
  memberStatus: MemberStatus;
  memberType: MemberType;
  nickName: Scalars['String'];
  password: Scalars['String'];
  point: Point;
  profileImageName?: Maybe<Scalars['String']>;
  pushInfo: Array<PushInfo>;
  refreshToken?: Maybe<Scalars['String']>;
  report: Report;
  updateDate: Scalars['DateTime'];
};

export type MemberInput = {
  memberId: Scalars['ID'];
};

export type MemberOutput = {
  __typename?: 'MemberOutput';
  error?: Maybe<LangErrorMessage>;
  member?: Maybe<Member>;
  ok: Scalars['Boolean'];
};

export enum MemberReportStatus {
  None = 'NONE',
  Reported = 'REPORTED'
}

export type MemberShareInfo = {
  __typename?: 'MemberShareInfo';
  directShare: Scalars['Float'];
  memberId: Scalars['ID'];
  nickName: Scalars['String'];
  priorityShare: Scalars['Float'];
};

export type MemberShareInfoInputType = {
  directShare: Scalars['Float'];
  memberId: Scalars['ID'];
  nickName: Scalars['String'];
  priorityShare: Scalars['Float'];
};

export enum MemberStatus {
  Active = 'ACTIVE',
  Removed = 'REMOVED',
  RemoveStandby = 'REMOVE_STANDBY'
}

export type MemberSuspendInput = {
  increase?: Maybe<Scalars['Float']>;
  memberId: Scalars['ID'];
};

export type MemberSuspendOutput = {
  __typename?: 'MemberSuspendOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export enum MemberType {
  Business = 'BUSINESS',
  Contents = 'CONTENTS',
  Cx = 'CX',
  Normal = 'NORMAL',
  Service = 'SERVICE',
  System = 'SYSTEM'
}

export type MembersByTypeInput = {
  memberType?: Maybe<MemberType>;
};

export type MembersByTypeOutput = {
  __typename?: 'MembersByTypeOutput';
  error?: Maybe<LangErrorMessage>;
  members: Array<Member>;
  ok: Scalars['Boolean'];
};

export type MembersInput = {
  dates?: Maybe<Array<Scalars['DateTime']>>;
  email?: Maybe<Scalars['String']>;
  memberStatus?: Maybe<MemberStatus>;
  memberType?: Maybe<MemberType>;
  nickName?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  pageView?: Maybe<Scalars['Int']>;
};

export type MembersOutput = {
  __typename?: 'MembersOutput';
  error?: Maybe<LangErrorMessage>;
  members?: Maybe<Array<Member>>;
  ok: Scalars['Boolean'];
  totalPages?: Maybe<Scalars['Int']>;
  totalResults?: Maybe<Scalars['Int']>;
};

export type Message = {
  __typename?: 'Message';
  created_at: Scalars['Float'];
  message: Scalars['String'];
  message_id: Scalars['Float'];
  type: Scalars['String'];
};

export type MessageInputType = {
  created_at: Scalars['Float'];
  message: Scalars['String'];
  message_id: Scalars['Float'];
  type: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  activeHistoriesByMemberId: ActiveHistoriesByMemberIdOutput;
  advertisements: AdvertisementsOutput;
  changeAdvertisementStatus: ChangeAdvertisementStatusOutput;
  commentHistoriesByMemberId: CommentHistoriesByMemberIdOutput;
  createAccount: CreateMemberOutput;
  createAdvertisement: CreateAdvertisementOutput;
  createAnswer: CreateAnswerOutput;
  createEvent: CreateEventOutput;
  createFaq: CreateFaqOutput;
  createLive: CreateLiveOutput;
  createMainBannerLiveContents: CreateMainBannerLiveOutput;
  createNotice: CreateNoticeOutput;
  createVod: CreateVodOutput;
  deleteBoard: DeleteBoardOutput;
  deleteLive: DeleteLiveOutput;
  deleteVod: DeleteVodOutput;
  deleteVodComment: DeleteVodCommentOutput;
  editAccount: EditMemberOutput;
  editAdvertisement: EditAdvertisementOutput;
  editEvent: EditEventOutput;
  editFaq: EditFaqOutput;
  editLive: EditLiveOutput;
  editMemberById: EditMemberOutput;
  editNotice: EditNoticeOutput;
  editVod: EditVodOutput;
  events: EventsOutput;
  faqs: FaqsOutput;
  inquiries: InquiriesOutput;
  listSendbirdMessages: LiveChatHistoriesByHistoryIdOutput;
  lives: LivesOutput;
  login: LoginOutput;
  logout: LogoutOutput;
  masterCreateAccount: CreateMemberOutput;
  members: MembersOutput;
  notices: NoticesOutput;
  pointHistoriesByMemberId: PointHistoriesByMemberIdOutput;
  suspendMemberById: MemberSuspendOutput;
  vods: VodsOutput;
};


export type MutationActiveHistoriesByMemberIdArgs = {
  input: ActiveHistoriesByMemberIdInput;
};


export type MutationAdvertisementsArgs = {
  input: AdvertisementsInput;
};


export type MutationChangeAdvertisementStatusArgs = {
  input: ChangeAdvertisementStatusInput;
};


export type MutationCommentHistoriesByMemberIdArgs = {
  input: CommentHistoriesByMemberIdInput;
};


export type MutationCreateAccountArgs = {
  input: CreateMemberInput;
};


export type MutationCreateAdvertisementArgs = {
  input: CreateAdvertisementInput;
};


export type MutationCreateAnswerArgs = {
  input: CreateAnswerInput;
};


export type MutationCreateEventArgs = {
  input: CreateEventInput;
};


export type MutationCreateFaqArgs = {
  input: CreateFaqInput;
};


export type MutationCreateLiveArgs = {
  input: CreateLiveInput;
};


export type MutationCreateMainBannerLiveContentsArgs = {
  input: CreateMainBannerLiveInput;
};


export type MutationCreateNoticeArgs = {
  input: CreateNoticeInput;
};


export type MutationCreateVodArgs = {
  input: CreateVodInput;
};


export type MutationDeleteBoardArgs = {
  input: DeleteBoardInput;
};


export type MutationDeleteLiveArgs = {
  input: DeleteLiveInput;
};


export type MutationDeleteVodArgs = {
  input: DeleteVodInput;
};


export type MutationDeleteVodCommentArgs = {
  input: DeleteVodCommentInput;
};


export type MutationEditAccountArgs = {
  input: EditMemberInput;
};


export type MutationEditAdvertisementArgs = {
  input: EditAdvertisementInput;
};


export type MutationEditEventArgs = {
  input: EditEventInput;
};


export type MutationEditFaqArgs = {
  input: EditFaqInput;
};


export type MutationEditLiveArgs = {
  input: EditLiveInput;
};


export type MutationEditMemberByIdArgs = {
  input: EditMemberInput;
};


export type MutationEditNoticeArgs = {
  input: EditNoticeInput;
};


export type MutationEditVodArgs = {
  input: EditVodInput;
};


export type MutationEventsArgs = {
  input: EventsInput;
};


export type MutationFaqsArgs = {
  input: FaqsInput;
};


export type MutationInquiriesArgs = {
  input: InquiriesInput;
};


export type MutationListSendbirdMessagesArgs = {
  input: LiveChatHistoriesByHistoryIdInput;
};


export type MutationLivesArgs = {
  input: LivesInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationMasterCreateAccountArgs = {
  input: CreateMemberInput;
};


export type MutationMembersArgs = {
  input: MembersInput;
};


export type MutationNoticesArgs = {
  input: NoticesInput;
};


export type MutationPointHistoriesByMemberIdArgs = {
  input: PointHistoriesByMemberIdInput;
};


export type MutationSuspendMemberByIdArgs = {
  input: MemberSuspendInput;
};


export type MutationVodsArgs = {
  input: VodsInput;
};

export type NoticesInput = {
  dates?: Maybe<Array<Scalars['DateTime']>>;
  page?: Maybe<Scalars['Int']>;
  pageView?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
};

export type NoticesOutput = {
  __typename?: 'NoticesOutput';
  error?: Maybe<LangErrorMessage>;
  notices?: Maybe<Array<Board>>;
  ok: Scalars['Boolean'];
  totalPages?: Maybe<Scalars['Int']>;
  totalResults?: Maybe<Scalars['Int']>;
};

export type Point = {
  __typename?: 'Point';
  _id: Scalars['ID'];
  createDate: Scalars['DateTime'];
  freePoint: Scalars['Int'];
  memberId: Scalars['ID'];
  paidPoint: Scalars['Int'];
  totalPoint: Scalars['Int'];
  updateDate: Scalars['DateTime'];
};

export type PointHistoriesByMemberIdInput = {
  dates?: Maybe<Array<Scalars['DateTime']>>;
  memberId: Scalars['ID'];
  page?: Maybe<Scalars['Int']>;
  pageView?: Maybe<Scalars['Int']>;
  pointPayStatus?: Maybe<PointPayStatus>;
};

export type PointHistoriesByMemberIdOutput = {
  __typename?: 'PointHistoriesByMemberIdOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
  pointPayHistoryView?: Maybe<Array<PointPayHistoryView>>;
  totalPages?: Maybe<Scalars['Int']>;
  totalResults?: Maybe<Scalars['Int']>;
};

export type PointPayHistoryView = {
  __typename?: 'PointPayHistoryView';
  _id: Scalars['ID'];
  amount: Scalars['Float'];
  content: Scalars['String'];
  createDate: Scalars['DateTime'];
  expireDate: Scalars['DateTime'];
  liveId?: Maybe<Scalars['ID']>;
  liveStartDate?: Maybe<Scalars['DateTime']>;
  liveStatus: LiveStatus;
  memberId: Scalars['ID'];
  payOrderId?: Maybe<Scalars['String']>;
  pointPayStatus: PointPayStatus;
  pointPayType: PointPayType;
  refundHistoryId: Scalars['ID'];
  updateDate: Scalars['DateTime'];
  useFreeAmount: Scalars['Float'];
  usePaidAmount: Scalars['Float'];
  vodId?: Maybe<Scalars['ID']>;
  vodStatus: VodStatus;
};

export enum PointPayStatus {
  Charge = 'CHARGE',
  Pass = 'PASS',
  Payment = 'PAYMENT',
  Refund = 'REFUND',
  Rental = 'RENTAL'
}

export enum PointPayType {
  Coupon = 'COUPON',
  Live = 'LIVE',
  Point = 'POINT',
  Vod = 'VOD'
}

export type PushInfo = {
  __typename?: 'PushInfo';
  notificationFlag: Scalars['Boolean'];
  pushType: PushType;
};

export enum PushType {
  All = 'ALL'
}

export type Query = {
  __typename?: 'Query';
  findAdvertisementById: FindAdvertisementByIdOutput;
  findBoardById: BoardOutput;
  findLiveById: LiveOutput;
  findLiveByTypes: FindLiveByTypesOutput;
  findMemberById: MemberOutput;
  findMembersByType: MembersByTypeOutput;
  findVodById: FindVodByIdOutput;
  findVodByTypes: FindVodByTypesOutput;
  getGoingDashboard: GetGoingDashboardOutput;
  mainBannerLiveContents: MainBannerLiveOutput;
  my: Member;
};


export type QueryFindAdvertisementByIdArgs = {
  input: FindAdvertisementByIdInput;
};


export type QueryFindBoardByIdArgs = {
  input: BoardInput;
};


export type QueryFindLiveByIdArgs = {
  input: LiveInput;
};


export type QueryFindLiveByTypesArgs = {
  input: FindLiveByTypesInput;
};


export type QueryFindMemberByIdArgs = {
  input: MemberInput;
};


export type QueryFindMembersByTypeArgs = {
  input: MembersByTypeInput;
};


export type QueryFindVodByIdArgs = {
  input: FindVodByIdInput;
};


export type QueryFindVodByTypesArgs = {
  input: FindVodByTypesInput;
};

export enum QuestionType {
  Etc = 'ETC',
  Event = 'EVENT',
  Payment = 'PAYMENT',
  Play = 'PLAY',
  Service = 'SERVICE'
}

export type Report = {
  __typename?: 'Report';
  _id: Scalars['ID'];
  chatCount: Scalars['Float'];
  commentCount: Scalars['Float'];
  createDate: Scalars['DateTime'];
  memberId: Scalars['ID'];
  memberReportStatus: MemberReportStatus;
  releaseDate?: Maybe<Scalars['DateTime']>;
  updateDate: Scalars['DateTime'];
};

export enum ServiceType {
  Cms = 'CMS',
  Service = 'SERVICE'
}

export enum TranscodeStatus {
  Fail = 'FAIL',
  Finish = 'FINISH',
  Processing = 'PROCESSING',
  Wait = 'WAIT'
}

export type UploadImageInfo = {
  __typename?: 'UploadImageInfo';
  displayOrder: Scalars['Float'];
  uploadImageName: Scalars['String'];
};

export type Vod = {
  __typename?: 'Vod';
  _id: Scalars['ID'];
  content?: Maybe<Scalars['String']>;
  createDate: Scalars['DateTime'];
  liveId?: Maybe<Scalars['ID']>;
  mainImageName: Scalars['String'];
  paymentAmount: Scalars['Float'];
  storageTotalCount: Scalars['Float'];
  title: Scalars['String'];
  updateDate: Scalars['DateTime'];
  viewCount: Scalars['Float'];
  vodLinkInfo: Array<VodLinkInfo>;
  vodRatioType: VodRatioType;
  vodShareInfo: VodShareInfo;
  vodStatus: VodStatus;
};

export enum VodCommentStatus {
  Active = 'ACTIVE',
  Blind = 'BLIND',
  Delete = 'DELETE'
}

export type VodLinkInfo = {
  __typename?: 'VodLinkInfo';
  introImageName: Scalars['String'];
  linkPath: Scalars['String'];
  listingOrder: Scalars['Float'];
  playingImageName?: Maybe<Scalars['String']>;
  transcodeEndDate?: Maybe<Scalars['DateTime']>;
  transcodeId?: Maybe<Scalars['Float']>;
  transcodeStatus: TranscodeStatus;
};

export type VodLinkInfoInputType = {
  introImageName: Scalars['String'];
  linkPath: Scalars['String'];
  listingOrder: Scalars['Float'];
  playingImageName?: Maybe<Scalars['String']>;
  transcodeEndDate?: Maybe<Scalars['DateTime']>;
  transcodeId?: Maybe<Scalars['Float']>;
  transcodeStatus?: Maybe<TranscodeStatus>;
};

export enum VodRatioType {
  Horizontal = 'HORIZONTAL',
  Vertical = 'VERTICAL'
}

export type VodShareInfo = {
  __typename?: 'VodShareInfo';
  _id: Scalars['ID'];
  createDate: Scalars['DateTime'];
  memberShareInfo: Array<MemberShareInfo>;
  shareApplyDate?: Maybe<Scalars['DateTime']>;
  updateDate: Scalars['DateTime'];
  vodId: Scalars['ID'];
};

export type VodShareInfoInputType = {
  memberShareInfo: Array<MemberShareInfoInputType>;
  shareApplyDate?: Maybe<Scalars['DateTime']>;
  vodId: Scalars['ID'];
};

export enum VodStatus {
  Active = 'ACTIVE',
  Available = 'AVAILABLE',
  Delete = 'DELETE',
  Fail = 'FAIL',
  Wait = 'WAIT'
}

export type VodsInput = {
  dates?: Maybe<Array<Scalars['DateTime']>>;
  page?: Maybe<Scalars['Int']>;
  pageView?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  vodStatus?: Maybe<VodStatus>;
};

export type VodsOutput = {
  __typename?: 'VodsOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
  totalPages?: Maybe<Scalars['Int']>;
  totalResults?: Maybe<Scalars['Int']>;
  vods?: Maybe<Array<Vod>>;
};

export type LoginMutationVariables = Exact<{
  loginInput: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginOutput', ok: boolean, token?: string | null | undefined, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined } };

export type CreateAccountMutationVariables = Exact<{
  createMemberInput: CreateMemberInput;
}>;


export type CreateAccountMutation = { __typename?: 'Mutation', createAccount: { __typename?: 'CreateMemberOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined } };

export type EditAccountMutationVariables = Exact<{
  editMemberInput: EditMemberInput;
}>;


export type EditAccountMutation = { __typename?: 'Mutation', editAccount: { __typename?: 'EditMemberOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'LogoutOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined } };

export type MembersMutationVariables = Exact<{
  membersInput: MembersInput;
}>;


export type MembersMutation = { __typename?: 'Mutation', members: { __typename?: 'MembersOutput', ok: boolean, totalResults?: number | null | undefined, totalPages?: number | null | undefined, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, members?: Array<{ __typename?: 'Member', _id: string, email: string, nickName: string, memberStatus: MemberStatus, memberType: MemberType, createDate: any }> | null | undefined } };

export type EditMemberByIdMutationVariables = Exact<{
  editMemberInput: EditMemberInput;
}>;


export type EditMemberByIdMutation = { __typename?: 'Mutation', editMemberById: { __typename?: 'EditMemberOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined } };

export type CreateLiveMutationVariables = Exact<{
  createLiveInput: CreateLiveInput;
}>;


export type CreateLiveMutation = { __typename?: 'Mutation', createLive: { __typename?: 'CreateLiveOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined } };

export type LivesMutationVariables = Exact<{
  livesInput: LivesInput;
}>;


export type LivesMutation = { __typename?: 'Mutation', lives: { __typename?: 'LivesOutput', ok: boolean, totalPages?: number | null | undefined, totalResults?: number | null | undefined, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, lives?: Array<{ __typename?: 'Live', _id: string, title: string, content?: string | null | undefined, hostName: string, paymentAmount: number, livePreviewDate: any, liveStartDate?: any | null | undefined, liveEndDate?: any | null | undefined, mainImageName: string, viewCount: number, delayedEntryTime: number, likeCount?: number | null | undefined, liveStatus: LiveStatus, vodId?: string | null | undefined, createDate: any, liveLinkInfo: Array<{ __typename?: 'LiveLinkInfo', linkPath?: string | null | undefined, playingImageName?: string | null | undefined, listingOrder: number }> }> | null | undefined } };

export type EditLiveMutationVariables = Exact<{
  editLiveInput: EditLiveInput;
}>;


export type EditLiveMutation = { __typename?: 'Mutation', editLive: { __typename?: 'EditLiveOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined } };

export type DeleteLiveMutationVariables = Exact<{
  deleteLiveInput: DeleteLiveInput;
}>;


export type DeleteLiveMutation = { __typename?: 'Mutation', deleteLive: { __typename?: 'DeleteLiveOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined } };

export type CreateVodMutationVariables = Exact<{
  createVodInput: CreateVodInput;
}>;


export type CreateVodMutation = { __typename?: 'Mutation', createVod: { __typename?: 'CreateVodOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined } };

export type VodsMutationVariables = Exact<{
  vodsInput: VodsInput;
}>;


export type VodsMutation = { __typename?: 'Mutation', vods: { __typename?: 'VodsOutput', ok: boolean, totalPages?: number | null | undefined, totalResults?: number | null | undefined, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, vods?: Array<{ __typename?: 'Vod', _id: string, title: string, content?: string | null | undefined, paymentAmount: number, viewCount: number, storageTotalCount: number, mainImageName: string, liveId?: string | null | undefined, vodStatus: VodStatus, createDate: any }> | null | undefined } };

export type EditVodMutationVariables = Exact<{
  editVodInput: EditVodInput;
}>;


export type EditVodMutation = { __typename?: 'Mutation', editVod: { __typename?: 'EditVodOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined } };

export type DeleteVodMutationVariables = Exact<{
  deleteVodInput: DeleteVodInput;
}>;


export type DeleteVodMutation = { __typename?: 'Mutation', deleteVod: { __typename?: 'DeleteVodOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined } };

export type CreateMainBannerLiveContentsMutationVariables = Exact<{
  createMainBannerLiveInput: CreateMainBannerLiveInput;
}>;


export type CreateMainBannerLiveContentsMutation = { __typename?: 'Mutation', createMainBannerLiveContents: { __typename?: 'CreateMainBannerLiveOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined } };

export type CreateAdvertisementMutationVariables = Exact<{
  createAdvertisementInput: CreateAdvertisementInput;
}>;


export type CreateAdvertisementMutation = { __typename?: 'Mutation', createAdvertisement: { __typename?: 'CreateAdvertisementOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined } };

export type AdvertisementsMutationVariables = Exact<{
  advertisementsInput: AdvertisementsInput;
}>;


export type AdvertisementsMutation = { __typename?: 'Mutation', advertisements: { __typename?: 'AdvertisementsOutput', ok: boolean, totalPages?: number | null | undefined, totalResults?: number | null | undefined, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, advertisements?: Array<{ __typename?: 'Advertisement', _id: string, advertiseStatus: AdvertiseStatus, displayType: DisplayType, title: string, content?: string | null | undefined, linkType: LinkType, linkUrl: string, startDate: any, endDate: any, createDate: any }> | null | undefined } };

export type EditAdvertisementMutationVariables = Exact<{
  editAdvertisementInput: EditAdvertisementInput;
}>;


export type EditAdvertisementMutation = { __typename?: 'Mutation', editAdvertisement: { __typename?: 'EditAdvertisementOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined } };

export type ChangeAdvertisementStatusMutationVariables = Exact<{
  changeAdvertisementStatusInput: ChangeAdvertisementStatusInput;
}>;


export type ChangeAdvertisementStatusMutation = { __typename?: 'Mutation', changeAdvertisementStatus: { __typename?: 'ChangeAdvertisementStatusOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined } };

export type CreateNoticeMutationVariables = Exact<{
  createNoticeInput: CreateNoticeInput;
}>;


export type CreateNoticeMutation = { __typename?: 'Mutation', createNotice: { __typename?: 'CreateNoticeOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined } };

export type NoticesMutationVariables = Exact<{
  noticesInput: NoticesInput;
}>;


export type NoticesMutation = { __typename?: 'Mutation', notices: { __typename?: 'NoticesOutput', ok: boolean, totalPages?: number | null | undefined, totalResults?: number | null | undefined, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, notices?: Array<{ __typename?: 'Board', _id: string, title: string, content: string, boardCategoryType: BoardCategoryType, createDate: any }> | null | undefined } };

export type EditNoticeMutationVariables = Exact<{
  editNoticeInput: EditNoticeInput;
}>;


export type EditNoticeMutation = { __typename?: 'Mutation', editNotice: { __typename?: 'EditNoticeOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined } };

export type DeleteBoardMutationVariables = Exact<{
  deleteBoardInput: DeleteBoardInput;
}>;


export type DeleteBoardMutation = { __typename?: 'Mutation', deleteBoard: { __typename?: 'DeleteBoardOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined } };

export type CreateEventMutationVariables = Exact<{
  createEventInput: CreateEventInput;
}>;


export type CreateEventMutation = { __typename?: 'Mutation', createEvent: { __typename?: 'CreateEventOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined } };

export type EventsMutationVariables = Exact<{
  eventsInput: EventsInput;
}>;


export type EventsMutation = { __typename?: 'Mutation', events: { __typename?: 'EventsOutput', ok: boolean, totalPages?: number | null | undefined, totalResults?: number | null | undefined, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, events?: Array<{ __typename?: 'Board', _id: string, title: string, content: string, boardCategoryType: BoardCategoryType, createDate: any }> | null | undefined } };

export type EditEventMutationVariables = Exact<{
  editEventInput: EditEventInput;
}>;


export type EditEventMutation = { __typename?: 'Mutation', editEvent: { __typename?: 'EditEventOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined } };

export type CreateFaqMutationVariables = Exact<{
  createFaqInput: CreateFaqInput;
}>;


export type CreateFaqMutation = { __typename?: 'Mutation', createFaq: { __typename?: 'CreateFaqOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined } };

export type FaqsMutationVariables = Exact<{
  faqsInput: FaqsInput;
}>;


export type FaqsMutation = { __typename?: 'Mutation', faqs: { __typename?: 'FaqsOutput', ok: boolean, totalPages?: number | null | undefined, totalResults?: number | null | undefined, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, faqs?: Array<{ __typename?: 'Board', _id: string, title: string, content: string, boardCategoryType: BoardCategoryType, faqType?: FaqType | null | undefined, createDate: any }> | null | undefined } };

export type EditFaqMutationVariables = Exact<{
  editFaqInput: EditFaqInput;
}>;


export type EditFaqMutation = { __typename?: 'Mutation', editFaq: { __typename?: 'EditFaqOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined } };

export type CreateAnswerMutationVariables = Exact<{
  createAnswerInput: CreateAnswerInput;
}>;


export type CreateAnswerMutation = { __typename?: 'Mutation', createAnswer: { __typename?: 'CreateAnswerOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined } };

export type InquiriesMutationVariables = Exact<{
  inquiriesInput: InquiriesInput;
}>;


export type InquiriesMutation = { __typename?: 'Mutation', inquiries: { __typename?: 'InquiriesOutput', ok: boolean, totalPages?: number | null | undefined, totalResults?: number | null | undefined, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, inquiries?: Array<{ __typename?: 'Board', _id: string, title: string, questionType?: QuestionType | null | undefined, boardStatus: BoardStatus, createDate: any, createMember: { __typename?: 'AuthMember', email: string } }> | null | undefined } };

export type SuspendMemberByIdMutationVariables = Exact<{
  memberSuspendInput: MemberSuspendInput;
}>;


export type SuspendMemberByIdMutation = { __typename?: 'Mutation', suspendMemberById: { __typename?: 'MemberSuspendOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined } };

export type ActiveHistoriesByMemberIdMutationVariables = Exact<{
  activeHistoriesByMemberIdInput: ActiveHistoriesByMemberIdInput;
}>;


export type ActiveHistoriesByMemberIdMutation = { __typename?: 'Mutation', activeHistoriesByMemberId: { __typename?: 'ActiveHistoriesByMemberIdOutput', ok: boolean, totalPages?: number | null | undefined, totalResults?: number | null | undefined, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, goingActiveLog?: Array<{ __typename?: 'GoingActiveLog', memberType: MemberType, categoryType: CategoryType, activeType: ActiveType, serviceType: ServiceType, content: string, createDate: any }> | null | undefined } };

export type PointHistoriesByMemberIdMutationVariables = Exact<{
  pointHistoriesByMemberIdInput: PointHistoriesByMemberIdInput;
}>;


export type PointHistoriesByMemberIdMutation = { __typename?: 'Mutation', pointHistoriesByMemberId: { __typename?: 'PointHistoriesByMemberIdOutput', ok: boolean, totalPages?: number | null | undefined, totalResults?: number | null | undefined, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, pointPayHistoryView?: Array<{ __typename?: 'PointPayHistoryView', _id: string, pointPayType: PointPayType, pointPayStatus: PointPayStatus, amount: number, content: string, createDate: any }> | null | undefined } };

export type CommentHistoriesByMemberIdMutationVariables = Exact<{
  commentHistoriesByMemberIdInput: CommentHistoriesByMemberIdInput;
}>;


export type CommentHistoriesByMemberIdMutation = { __typename?: 'Mutation', commentHistoriesByMemberId: { __typename?: 'CommentHistoriesByMemberIdOutput', ok: boolean, totalPages?: number | null | undefined, totalResults?: number | null | undefined, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, commentHistoryView?: Array<{ __typename?: 'CommentHistoryView', _id: string, title: string, content: string, vodCommentStatus: VodCommentStatus, reportCount: number, nickName: string, createDate: any }> | null | undefined } };

export type DeleteVodCommentMutationVariables = Exact<{
  deleteVodCommentInput: DeleteVodCommentInput;
}>;


export type DeleteVodCommentMutation = { __typename?: 'Mutation', deleteVodComment: { __typename?: 'DeleteVodCommentOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined } };

export type ListSendBirdMessagesMutationVariables = Exact<{
  liveChatHistoriesByHistoryIdInput: LiveChatHistoriesByHistoryIdInput;
}>;


export type ListSendBirdMessagesMutation = { __typename?: 'Mutation', listSendbirdMessages: { __typename?: 'LiveChatHistoriesByHistoryIdOutput', ok: boolean, email?: string | null | undefined, nickName?: string | null | undefined, liveTitle?: string | null | undefined, liveStartDate?: any | null | undefined, isDisable?: boolean | null | undefined, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, messages?: Array<{ __typename?: 'Message', message_id: number, type: string, message: string, created_at: number }> | null | undefined } };

export type MyQueryVariables = Exact<{ [key: string]: never; }>;


export type MyQuery = { __typename?: 'Query', my: { __typename?: 'Member', _id: string, email: string, password: string, nickName: string, profileImageName?: string | null | undefined, memberStatus: MemberStatus, memberType: MemberType, refreshToken?: string | null | undefined, lastLoginDate?: any | null | undefined, accountInfo?: { __typename?: 'AccountInfo', bankName: string, depositor: string, accountNumber: string } | null | undefined } };

export type FindMemberByIdQueryVariables = Exact<{
  memberInput: MemberInput;
}>;


export type FindMemberByIdQuery = { __typename?: 'Query', findMemberById: { __typename?: 'MemberOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, member?: { __typename?: 'Member', email: string, nickName: string, memberStatus: MemberStatus, memberType: MemberType, createDate: any, lastLoginDate?: any | null | undefined, point: { __typename?: 'Point', totalPoint: number, paidPoint: number, freePoint: number }, report: { __typename?: 'Report', memberReportStatus: MemberReportStatus, chatCount: number, commentCount: number, releaseDate?: any | null | undefined }, accountInfo?: { __typename?: 'AccountInfo', bankName: string, depositor: string, accountNumber: string } | null | undefined, pushInfo: Array<{ __typename?: 'PushInfo', pushType: PushType, notificationFlag: boolean }> } | null | undefined } };

export type FindMembersByTypeQueryVariables = Exact<{
  membersByTypeInput: MembersByTypeInput;
}>;


export type FindMembersByTypeQuery = { __typename?: 'Query', findMembersByType: { __typename?: 'MembersByTypeOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, members: Array<{ __typename?: 'Member', _id: string, nickName: string, memberStatus: MemberStatus, memberType: MemberType }> } };

export type FindLiveByIdQueryVariables = Exact<{
  liveInput: LiveInput;
}>;


export type FindLiveByIdQuery = { __typename?: 'Query', findLiveById: { __typename?: 'LiveOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, live?: { __typename?: 'Live', _id: string, title: string, content?: string | null | undefined, hostName: string, paymentAmount: number, livePreviewDate: any, liveStartDate?: any | null | undefined, liveEndDate?: any | null | undefined, mainImageName: string, viewCount: number, delayedEntryTime: number, likeCount?: number | null | undefined, liveStatus: LiveStatus, vodId?: string | null | undefined, createDate: any, updateDate: any, liveLinkInfo: Array<{ __typename?: 'LiveLinkInfo', linkPath?: string | null | undefined, playingImageName?: string | null | undefined, listingOrder: number }>, liveShareInfo: { __typename?: 'LiveShareInfo', shareApplyDate?: any | null | undefined, liveId: string, memberShareInfo: Array<{ __typename?: 'MemberShareInfo', memberId: string, nickName: string, priorityShare: number, directShare: number }> } } | null | undefined } };

export type FindVodByIdQueryVariables = Exact<{
  vodInput: FindVodByIdInput;
}>;


export type FindVodByIdQuery = { __typename?: 'Query', findVodById: { __typename?: 'FindVodByIdOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, vod?: { __typename?: 'Vod', _id: string, title: string, content?: string | null | undefined, paymentAmount: number, vodRatioType: VodRatioType, mainImageName: string, storageTotalCount: number, vodStatus: VodStatus, liveId?: string | null | undefined, createDate: any, updateDate: any, vodLinkInfo: Array<{ __typename?: 'VodLinkInfo', linkPath: string, introImageName: string, playingImageName?: string | null | undefined, transcodeStatus: TranscodeStatus, listingOrder: number }>, vodShareInfo: { __typename?: 'VodShareInfo', shareApplyDate?: any | null | undefined, vodId: string, memberShareInfo: Array<{ __typename?: 'MemberShareInfo', memberId: string, nickName: string, priorityShare: number, directShare: number }> } } | null | undefined } };

export type FindLiveByTypesQueryVariables = Exact<{
  findLiveByTypesInput: FindLiveByTypesInput;
}>;


export type FindLiveByTypesQuery = { __typename?: 'Query', findLiveByTypes: { __typename?: 'FindLiveByTypesOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, lives: Array<{ __typename?: 'Live', _id: string, title: string }> } };

export type FindVodByTypesQueryVariables = Exact<{
  findVodByTypesInput: FindVodByTypesInput;
}>;


export type FindVodByTypesQuery = { __typename?: 'Query', findVodByTypes: { __typename?: 'FindVodByTypesOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, vods: Array<{ __typename?: 'Vod', _id: string, title: string }> } };

export type MainBannerLiveContentsQueryVariables = Exact<{ [key: string]: never; }>;


export type MainBannerLiveContentsQuery = { __typename?: 'Query', mainBannerLiveContents: { __typename?: 'MainBannerLiveOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, mainBannerLives?: Array<{ __typename?: 'MainBannerLive', liveId: string, listingOrder: number, title?: string | null | undefined }> | null | undefined } };

export type FindAdvertisementByIdQueryVariables = Exact<{
  findAdvertisementByIdInput: FindAdvertisementByIdInput;
}>;


export type FindAdvertisementByIdQuery = { __typename?: 'Query', findAdvertisementById: { __typename?: 'FindAdvertisementByIdOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, advertisement?: { __typename?: 'Advertisement', _id: string, advertiseStatus: AdvertiseStatus, displayType: DisplayType, displayDeviceType: DisplayDeviceType, title: string, content?: string | null | undefined, mainImageName: string, linkType: LinkType, linkUrl: string, startDate: any, endDate: any } | null | undefined } };

export type FindBoardByIdQueryVariables = Exact<{
  boardInput: BoardInput;
}>;


export type FindBoardByIdQuery = { __typename?: 'Query', findBoardById: { __typename?: 'BoardOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, board?: { __typename?: 'Board', email?: string | null | undefined, title: string, content: string, questionType?: QuestionType | null | undefined, boardStatus: BoardStatus, faqType?: FaqType | null | undefined, createDate: any, uploadImageInfo?: Array<{ __typename?: 'UploadImageInfo', uploadImageName: string, displayOrder: number }> | null | undefined, answerInfo?: { __typename?: 'AnswerInfo', answer: string, createDate: any } | null | undefined } | null | undefined } };

export type GetGoingDashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGoingDashboardQuery = { __typename?: 'Query', getGoingDashboard: { __typename?: 'GetGoingDashboardOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, dashboard?: { __typename?: 'GoingDashboard', totalMemberCount: number, loginCountByDate: Array<number> } | null | undefined } };


export const LoginDocument = gql`
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
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      loginInput: // value for 'loginInput'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const CreateAccountDocument = gql`
    mutation CreateAccount($createMemberInput: CreateMemberInput!) {
  createAccount(input: $createMemberInput) {
    ok
    error {
      ko
      en
    }
  }
}
    `;
export type CreateAccountMutationFn = Apollo.MutationFunction<CreateAccountMutation, CreateAccountMutationVariables>;

/**
 * __useCreateAccountMutation__
 *
 * To run a mutation, you first call `useCreateAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAccountMutation, { data, loading, error }] = useCreateAccountMutation({
 *   variables: {
 *      createMemberInput: // value for 'createMemberInput'
 *   },
 * });
 */
export function useCreateAccountMutation(baseOptions?: Apollo.MutationHookOptions<CreateAccountMutation, CreateAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAccountMutation, CreateAccountMutationVariables>(CreateAccountDocument, options);
      }
export type CreateAccountMutationHookResult = ReturnType<typeof useCreateAccountMutation>;
export type CreateAccountMutationResult = Apollo.MutationResult<CreateAccountMutation>;
export type CreateAccountMutationOptions = Apollo.BaseMutationOptions<CreateAccountMutation, CreateAccountMutationVariables>;
export const EditAccountDocument = gql`
    mutation EditAccount($editMemberInput: EditMemberInput!) {
  editAccount(input: $editMemberInput) {
    ok
    error {
      ko
      en
    }
  }
}
    `;
export type EditAccountMutationFn = Apollo.MutationFunction<EditAccountMutation, EditAccountMutationVariables>;

/**
 * __useEditAccountMutation__
 *
 * To run a mutation, you first call `useEditAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editAccountMutation, { data, loading, error }] = useEditAccountMutation({
 *   variables: {
 *      editMemberInput: // value for 'editMemberInput'
 *   },
 * });
 */
export function useEditAccountMutation(baseOptions?: Apollo.MutationHookOptions<EditAccountMutation, EditAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditAccountMutation, EditAccountMutationVariables>(EditAccountDocument, options);
      }
export type EditAccountMutationHookResult = ReturnType<typeof useEditAccountMutation>;
export type EditAccountMutationResult = Apollo.MutationResult<EditAccountMutation>;
export type EditAccountMutationOptions = Apollo.BaseMutationOptions<EditAccountMutation, EditAccountMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout {
    ok
    error {
      ko
      en
    }
  }
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const MembersDocument = gql`
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
    `;
export type MembersMutationFn = Apollo.MutationFunction<MembersMutation, MembersMutationVariables>;

/**
 * __useMembersMutation__
 *
 * To run a mutation, you first call `useMembersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMembersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [membersMutation, { data, loading, error }] = useMembersMutation({
 *   variables: {
 *      membersInput: // value for 'membersInput'
 *   },
 * });
 */
export function useMembersMutation(baseOptions?: Apollo.MutationHookOptions<MembersMutation, MembersMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MembersMutation, MembersMutationVariables>(MembersDocument, options);
      }
export type MembersMutationHookResult = ReturnType<typeof useMembersMutation>;
export type MembersMutationResult = Apollo.MutationResult<MembersMutation>;
export type MembersMutationOptions = Apollo.BaseMutationOptions<MembersMutation, MembersMutationVariables>;
export const EditMemberByIdDocument = gql`
    mutation EditMemberById($editMemberInput: EditMemberInput!) {
  editMemberById(input: $editMemberInput) {
    ok
    error {
      ko
      en
    }
  }
}
    `;
export type EditMemberByIdMutationFn = Apollo.MutationFunction<EditMemberByIdMutation, EditMemberByIdMutationVariables>;

/**
 * __useEditMemberByIdMutation__
 *
 * To run a mutation, you first call `useEditMemberByIdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditMemberByIdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editMemberByIdMutation, { data, loading, error }] = useEditMemberByIdMutation({
 *   variables: {
 *      editMemberInput: // value for 'editMemberInput'
 *   },
 * });
 */
export function useEditMemberByIdMutation(baseOptions?: Apollo.MutationHookOptions<EditMemberByIdMutation, EditMemberByIdMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditMemberByIdMutation, EditMemberByIdMutationVariables>(EditMemberByIdDocument, options);
      }
export type EditMemberByIdMutationHookResult = ReturnType<typeof useEditMemberByIdMutation>;
export type EditMemberByIdMutationResult = Apollo.MutationResult<EditMemberByIdMutation>;
export type EditMemberByIdMutationOptions = Apollo.BaseMutationOptions<EditMemberByIdMutation, EditMemberByIdMutationVariables>;
export const CreateLiveDocument = gql`
    mutation CreateLive($createLiveInput: CreateLiveInput!) {
  createLive(input: $createLiveInput) {
    ok
    error {
      ko
      en
    }
  }
}
    `;
export type CreateLiveMutationFn = Apollo.MutationFunction<CreateLiveMutation, CreateLiveMutationVariables>;

/**
 * __useCreateLiveMutation__
 *
 * To run a mutation, you first call `useCreateLiveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLiveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLiveMutation, { data, loading, error }] = useCreateLiveMutation({
 *   variables: {
 *      createLiveInput: // value for 'createLiveInput'
 *   },
 * });
 */
export function useCreateLiveMutation(baseOptions?: Apollo.MutationHookOptions<CreateLiveMutation, CreateLiveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLiveMutation, CreateLiveMutationVariables>(CreateLiveDocument, options);
      }
export type CreateLiveMutationHookResult = ReturnType<typeof useCreateLiveMutation>;
export type CreateLiveMutationResult = Apollo.MutationResult<CreateLiveMutation>;
export type CreateLiveMutationOptions = Apollo.BaseMutationOptions<CreateLiveMutation, CreateLiveMutationVariables>;
export const LivesDocument = gql`
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
      viewCount
      delayedEntryTime
      likeCount
      liveStatus
      vodId
      createDate
    }
  }
}
    `;
export type LivesMutationFn = Apollo.MutationFunction<LivesMutation, LivesMutationVariables>;

/**
 * __useLivesMutation__
 *
 * To run a mutation, you first call `useLivesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLivesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [livesMutation, { data, loading, error }] = useLivesMutation({
 *   variables: {
 *      livesInput: // value for 'livesInput'
 *   },
 * });
 */
export function useLivesMutation(baseOptions?: Apollo.MutationHookOptions<LivesMutation, LivesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LivesMutation, LivesMutationVariables>(LivesDocument, options);
      }
export type LivesMutationHookResult = ReturnType<typeof useLivesMutation>;
export type LivesMutationResult = Apollo.MutationResult<LivesMutation>;
export type LivesMutationOptions = Apollo.BaseMutationOptions<LivesMutation, LivesMutationVariables>;
export const EditLiveDocument = gql`
    mutation EditLive($editLiveInput: EditLiveInput!) {
  editLive(input: $editLiveInput) {
    ok
    error {
      ko
      en
    }
  }
}
    `;
export type EditLiveMutationFn = Apollo.MutationFunction<EditLiveMutation, EditLiveMutationVariables>;

/**
 * __useEditLiveMutation__
 *
 * To run a mutation, you first call `useEditLiveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditLiveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editLiveMutation, { data, loading, error }] = useEditLiveMutation({
 *   variables: {
 *      editLiveInput: // value for 'editLiveInput'
 *   },
 * });
 */
export function useEditLiveMutation(baseOptions?: Apollo.MutationHookOptions<EditLiveMutation, EditLiveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditLiveMutation, EditLiveMutationVariables>(EditLiveDocument, options);
      }
export type EditLiveMutationHookResult = ReturnType<typeof useEditLiveMutation>;
export type EditLiveMutationResult = Apollo.MutationResult<EditLiveMutation>;
export type EditLiveMutationOptions = Apollo.BaseMutationOptions<EditLiveMutation, EditLiveMutationVariables>;
export const DeleteLiveDocument = gql`
    mutation DeleteLive($deleteLiveInput: DeleteLiveInput!) {
  deleteLive(input: $deleteLiveInput) {
    ok
    error {
      ko
      en
    }
  }
}
    `;
export type DeleteLiveMutationFn = Apollo.MutationFunction<DeleteLiveMutation, DeleteLiveMutationVariables>;

/**
 * __useDeleteLiveMutation__
 *
 * To run a mutation, you first call `useDeleteLiveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLiveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLiveMutation, { data, loading, error }] = useDeleteLiveMutation({
 *   variables: {
 *      deleteLiveInput: // value for 'deleteLiveInput'
 *   },
 * });
 */
export function useDeleteLiveMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLiveMutation, DeleteLiveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLiveMutation, DeleteLiveMutationVariables>(DeleteLiveDocument, options);
      }
export type DeleteLiveMutationHookResult = ReturnType<typeof useDeleteLiveMutation>;
export type DeleteLiveMutationResult = Apollo.MutationResult<DeleteLiveMutation>;
export type DeleteLiveMutationOptions = Apollo.BaseMutationOptions<DeleteLiveMutation, DeleteLiveMutationVariables>;
export const CreateVodDocument = gql`
    mutation CreateVod($createVodInput: CreateVodInput!) {
  createVod(input: $createVodInput) {
    ok
    error {
      ko
      en
    }
  }
}
    `;
export type CreateVodMutationFn = Apollo.MutationFunction<CreateVodMutation, CreateVodMutationVariables>;

/**
 * __useCreateVodMutation__
 *
 * To run a mutation, you first call `useCreateVodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateVodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createVodMutation, { data, loading, error }] = useCreateVodMutation({
 *   variables: {
 *      createVodInput: // value for 'createVodInput'
 *   },
 * });
 */
export function useCreateVodMutation(baseOptions?: Apollo.MutationHookOptions<CreateVodMutation, CreateVodMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateVodMutation, CreateVodMutationVariables>(CreateVodDocument, options);
      }
export type CreateVodMutationHookResult = ReturnType<typeof useCreateVodMutation>;
export type CreateVodMutationResult = Apollo.MutationResult<CreateVodMutation>;
export type CreateVodMutationOptions = Apollo.BaseMutationOptions<CreateVodMutation, CreateVodMutationVariables>;
export const VodsDocument = gql`
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
      _id
      title
      content
      paymentAmount
      viewCount
      storageTotalCount
      mainImageName
      liveId
      vodStatus
      createDate
    }
  }
}
    `;
export type VodsMutationFn = Apollo.MutationFunction<VodsMutation, VodsMutationVariables>;

/**
 * __useVodsMutation__
 *
 * To run a mutation, you first call `useVodsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVodsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [vodsMutation, { data, loading, error }] = useVodsMutation({
 *   variables: {
 *      vodsInput: // value for 'vodsInput'
 *   },
 * });
 */
export function useVodsMutation(baseOptions?: Apollo.MutationHookOptions<VodsMutation, VodsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VodsMutation, VodsMutationVariables>(VodsDocument, options);
      }
export type VodsMutationHookResult = ReturnType<typeof useVodsMutation>;
export type VodsMutationResult = Apollo.MutationResult<VodsMutation>;
export type VodsMutationOptions = Apollo.BaseMutationOptions<VodsMutation, VodsMutationVariables>;
export const EditVodDocument = gql`
    mutation EditVod($editVodInput: EditVodInput!) {
  editVod(input: $editVodInput) {
    ok
    error {
      ko
      en
    }
  }
}
    `;
export type EditVodMutationFn = Apollo.MutationFunction<EditVodMutation, EditVodMutationVariables>;

/**
 * __useEditVodMutation__
 *
 * To run a mutation, you first call `useEditVodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditVodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editVodMutation, { data, loading, error }] = useEditVodMutation({
 *   variables: {
 *      editVodInput: // value for 'editVodInput'
 *   },
 * });
 */
export function useEditVodMutation(baseOptions?: Apollo.MutationHookOptions<EditVodMutation, EditVodMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditVodMutation, EditVodMutationVariables>(EditVodDocument, options);
      }
export type EditVodMutationHookResult = ReturnType<typeof useEditVodMutation>;
export type EditVodMutationResult = Apollo.MutationResult<EditVodMutation>;
export type EditVodMutationOptions = Apollo.BaseMutationOptions<EditVodMutation, EditVodMutationVariables>;
export const DeleteVodDocument = gql`
    mutation DeleteVod($deleteVodInput: DeleteVodInput!) {
  deleteVod(input: $deleteVodInput) {
    ok
    error {
      ko
      en
    }
  }
}
    `;
export type DeleteVodMutationFn = Apollo.MutationFunction<DeleteVodMutation, DeleteVodMutationVariables>;

/**
 * __useDeleteVodMutation__
 *
 * To run a mutation, you first call `useDeleteVodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteVodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteVodMutation, { data, loading, error }] = useDeleteVodMutation({
 *   variables: {
 *      deleteVodInput: // value for 'deleteVodInput'
 *   },
 * });
 */
export function useDeleteVodMutation(baseOptions?: Apollo.MutationHookOptions<DeleteVodMutation, DeleteVodMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteVodMutation, DeleteVodMutationVariables>(DeleteVodDocument, options);
      }
export type DeleteVodMutationHookResult = ReturnType<typeof useDeleteVodMutation>;
export type DeleteVodMutationResult = Apollo.MutationResult<DeleteVodMutation>;
export type DeleteVodMutationOptions = Apollo.BaseMutationOptions<DeleteVodMutation, DeleteVodMutationVariables>;
export const CreateMainBannerLiveContentsDocument = gql`
    mutation CreateMainBannerLiveContents($createMainBannerLiveInput: CreateMainBannerLiveInput!) {
  createMainBannerLiveContents(input: $createMainBannerLiveInput) {
    ok
    error {
      ko
      en
    }
  }
}
    `;
export type CreateMainBannerLiveContentsMutationFn = Apollo.MutationFunction<CreateMainBannerLiveContentsMutation, CreateMainBannerLiveContentsMutationVariables>;

/**
 * __useCreateMainBannerLiveContentsMutation__
 *
 * To run a mutation, you first call `useCreateMainBannerLiveContentsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMainBannerLiveContentsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMainBannerLiveContentsMutation, { data, loading, error }] = useCreateMainBannerLiveContentsMutation({
 *   variables: {
 *      createMainBannerLiveInput: // value for 'createMainBannerLiveInput'
 *   },
 * });
 */
export function useCreateMainBannerLiveContentsMutation(baseOptions?: Apollo.MutationHookOptions<CreateMainBannerLiveContentsMutation, CreateMainBannerLiveContentsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMainBannerLiveContentsMutation, CreateMainBannerLiveContentsMutationVariables>(CreateMainBannerLiveContentsDocument, options);
      }
export type CreateMainBannerLiveContentsMutationHookResult = ReturnType<typeof useCreateMainBannerLiveContentsMutation>;
export type CreateMainBannerLiveContentsMutationResult = Apollo.MutationResult<CreateMainBannerLiveContentsMutation>;
export type CreateMainBannerLiveContentsMutationOptions = Apollo.BaseMutationOptions<CreateMainBannerLiveContentsMutation, CreateMainBannerLiveContentsMutationVariables>;
export const CreateAdvertisementDocument = gql`
    mutation CreateAdvertisement($createAdvertisementInput: CreateAdvertisementInput!) {
  createAdvertisement(input: $createAdvertisementInput) {
    ok
    error {
      ko
      en
    }
  }
}
    `;
export type CreateAdvertisementMutationFn = Apollo.MutationFunction<CreateAdvertisementMutation, CreateAdvertisementMutationVariables>;

/**
 * __useCreateAdvertisementMutation__
 *
 * To run a mutation, you first call `useCreateAdvertisementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAdvertisementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAdvertisementMutation, { data, loading, error }] = useCreateAdvertisementMutation({
 *   variables: {
 *      createAdvertisementInput: // value for 'createAdvertisementInput'
 *   },
 * });
 */
export function useCreateAdvertisementMutation(baseOptions?: Apollo.MutationHookOptions<CreateAdvertisementMutation, CreateAdvertisementMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAdvertisementMutation, CreateAdvertisementMutationVariables>(CreateAdvertisementDocument, options);
      }
export type CreateAdvertisementMutationHookResult = ReturnType<typeof useCreateAdvertisementMutation>;
export type CreateAdvertisementMutationResult = Apollo.MutationResult<CreateAdvertisementMutation>;
export type CreateAdvertisementMutationOptions = Apollo.BaseMutationOptions<CreateAdvertisementMutation, CreateAdvertisementMutationVariables>;
export const AdvertisementsDocument = gql`
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
    `;
export type AdvertisementsMutationFn = Apollo.MutationFunction<AdvertisementsMutation, AdvertisementsMutationVariables>;

/**
 * __useAdvertisementsMutation__
 *
 * To run a mutation, you first call `useAdvertisementsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdvertisementsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [advertisementsMutation, { data, loading, error }] = useAdvertisementsMutation({
 *   variables: {
 *      advertisementsInput: // value for 'advertisementsInput'
 *   },
 * });
 */
export function useAdvertisementsMutation(baseOptions?: Apollo.MutationHookOptions<AdvertisementsMutation, AdvertisementsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AdvertisementsMutation, AdvertisementsMutationVariables>(AdvertisementsDocument, options);
      }
export type AdvertisementsMutationHookResult = ReturnType<typeof useAdvertisementsMutation>;
export type AdvertisementsMutationResult = Apollo.MutationResult<AdvertisementsMutation>;
export type AdvertisementsMutationOptions = Apollo.BaseMutationOptions<AdvertisementsMutation, AdvertisementsMutationVariables>;
export const EditAdvertisementDocument = gql`
    mutation EditAdvertisement($editAdvertisementInput: EditAdvertisementInput!) {
  editAdvertisement(input: $editAdvertisementInput) {
    ok
    error {
      ko
      en
    }
  }
}
    `;
export type EditAdvertisementMutationFn = Apollo.MutationFunction<EditAdvertisementMutation, EditAdvertisementMutationVariables>;

/**
 * __useEditAdvertisementMutation__
 *
 * To run a mutation, you first call `useEditAdvertisementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditAdvertisementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editAdvertisementMutation, { data, loading, error }] = useEditAdvertisementMutation({
 *   variables: {
 *      editAdvertisementInput: // value for 'editAdvertisementInput'
 *   },
 * });
 */
export function useEditAdvertisementMutation(baseOptions?: Apollo.MutationHookOptions<EditAdvertisementMutation, EditAdvertisementMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditAdvertisementMutation, EditAdvertisementMutationVariables>(EditAdvertisementDocument, options);
      }
export type EditAdvertisementMutationHookResult = ReturnType<typeof useEditAdvertisementMutation>;
export type EditAdvertisementMutationResult = Apollo.MutationResult<EditAdvertisementMutation>;
export type EditAdvertisementMutationOptions = Apollo.BaseMutationOptions<EditAdvertisementMutation, EditAdvertisementMutationVariables>;
export const ChangeAdvertisementStatusDocument = gql`
    mutation ChangeAdvertisementStatus($changeAdvertisementStatusInput: ChangeAdvertisementStatusInput!) {
  changeAdvertisementStatus(input: $changeAdvertisementStatusInput) {
    ok
    error {
      ko
      en
    }
  }
}
    `;
export type ChangeAdvertisementStatusMutationFn = Apollo.MutationFunction<ChangeAdvertisementStatusMutation, ChangeAdvertisementStatusMutationVariables>;

/**
 * __useChangeAdvertisementStatusMutation__
 *
 * To run a mutation, you first call `useChangeAdvertisementStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeAdvertisementStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeAdvertisementStatusMutation, { data, loading, error }] = useChangeAdvertisementStatusMutation({
 *   variables: {
 *      changeAdvertisementStatusInput: // value for 'changeAdvertisementStatusInput'
 *   },
 * });
 */
export function useChangeAdvertisementStatusMutation(baseOptions?: Apollo.MutationHookOptions<ChangeAdvertisementStatusMutation, ChangeAdvertisementStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeAdvertisementStatusMutation, ChangeAdvertisementStatusMutationVariables>(ChangeAdvertisementStatusDocument, options);
      }
export type ChangeAdvertisementStatusMutationHookResult = ReturnType<typeof useChangeAdvertisementStatusMutation>;
export type ChangeAdvertisementStatusMutationResult = Apollo.MutationResult<ChangeAdvertisementStatusMutation>;
export type ChangeAdvertisementStatusMutationOptions = Apollo.BaseMutationOptions<ChangeAdvertisementStatusMutation, ChangeAdvertisementStatusMutationVariables>;
export const CreateNoticeDocument = gql`
    mutation CreateNotice($createNoticeInput: CreateNoticeInput!) {
  createNotice(input: $createNoticeInput) {
    ok
    error {
      ko
      en
    }
  }
}
    `;
export type CreateNoticeMutationFn = Apollo.MutationFunction<CreateNoticeMutation, CreateNoticeMutationVariables>;

/**
 * __useCreateNoticeMutation__
 *
 * To run a mutation, you first call `useCreateNoticeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNoticeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNoticeMutation, { data, loading, error }] = useCreateNoticeMutation({
 *   variables: {
 *      createNoticeInput: // value for 'createNoticeInput'
 *   },
 * });
 */
export function useCreateNoticeMutation(baseOptions?: Apollo.MutationHookOptions<CreateNoticeMutation, CreateNoticeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateNoticeMutation, CreateNoticeMutationVariables>(CreateNoticeDocument, options);
      }
export type CreateNoticeMutationHookResult = ReturnType<typeof useCreateNoticeMutation>;
export type CreateNoticeMutationResult = Apollo.MutationResult<CreateNoticeMutation>;
export type CreateNoticeMutationOptions = Apollo.BaseMutationOptions<CreateNoticeMutation, CreateNoticeMutationVariables>;
export const NoticesDocument = gql`
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
    `;
export type NoticesMutationFn = Apollo.MutationFunction<NoticesMutation, NoticesMutationVariables>;

/**
 * __useNoticesMutation__
 *
 * To run a mutation, you first call `useNoticesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useNoticesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [noticesMutation, { data, loading, error }] = useNoticesMutation({
 *   variables: {
 *      noticesInput: // value for 'noticesInput'
 *   },
 * });
 */
export function useNoticesMutation(baseOptions?: Apollo.MutationHookOptions<NoticesMutation, NoticesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<NoticesMutation, NoticesMutationVariables>(NoticesDocument, options);
      }
export type NoticesMutationHookResult = ReturnType<typeof useNoticesMutation>;
export type NoticesMutationResult = Apollo.MutationResult<NoticesMutation>;
export type NoticesMutationOptions = Apollo.BaseMutationOptions<NoticesMutation, NoticesMutationVariables>;
export const EditNoticeDocument = gql`
    mutation EditNotice($editNoticeInput: EditNoticeInput!) {
  editNotice(input: $editNoticeInput) {
    ok
    error {
      ko
      en
    }
  }
}
    `;
export type EditNoticeMutationFn = Apollo.MutationFunction<EditNoticeMutation, EditNoticeMutationVariables>;

/**
 * __useEditNoticeMutation__
 *
 * To run a mutation, you first call `useEditNoticeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditNoticeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editNoticeMutation, { data, loading, error }] = useEditNoticeMutation({
 *   variables: {
 *      editNoticeInput: // value for 'editNoticeInput'
 *   },
 * });
 */
export function useEditNoticeMutation(baseOptions?: Apollo.MutationHookOptions<EditNoticeMutation, EditNoticeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditNoticeMutation, EditNoticeMutationVariables>(EditNoticeDocument, options);
      }
export type EditNoticeMutationHookResult = ReturnType<typeof useEditNoticeMutation>;
export type EditNoticeMutationResult = Apollo.MutationResult<EditNoticeMutation>;
export type EditNoticeMutationOptions = Apollo.BaseMutationOptions<EditNoticeMutation, EditNoticeMutationVariables>;
export const DeleteBoardDocument = gql`
    mutation DeleteBoard($deleteBoardInput: DeleteBoardInput!) {
  deleteBoard(input: $deleteBoardInput) {
    ok
    error {
      ko
      en
    }
  }
}
    `;
export type DeleteBoardMutationFn = Apollo.MutationFunction<DeleteBoardMutation, DeleteBoardMutationVariables>;

/**
 * __useDeleteBoardMutation__
 *
 * To run a mutation, you first call `useDeleteBoardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBoardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBoardMutation, { data, loading, error }] = useDeleteBoardMutation({
 *   variables: {
 *      deleteBoardInput: // value for 'deleteBoardInput'
 *   },
 * });
 */
export function useDeleteBoardMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBoardMutation, DeleteBoardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBoardMutation, DeleteBoardMutationVariables>(DeleteBoardDocument, options);
      }
export type DeleteBoardMutationHookResult = ReturnType<typeof useDeleteBoardMutation>;
export type DeleteBoardMutationResult = Apollo.MutationResult<DeleteBoardMutation>;
export type DeleteBoardMutationOptions = Apollo.BaseMutationOptions<DeleteBoardMutation, DeleteBoardMutationVariables>;
export const CreateEventDocument = gql`
    mutation CreateEvent($createEventInput: CreateEventInput!) {
  createEvent(input: $createEventInput) {
    ok
    error {
      ko
      en
    }
  }
}
    `;
export type CreateEventMutationFn = Apollo.MutationFunction<CreateEventMutation, CreateEventMutationVariables>;

/**
 * __useCreateEventMutation__
 *
 * To run a mutation, you first call `useCreateEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEventMutation, { data, loading, error }] = useCreateEventMutation({
 *   variables: {
 *      createEventInput: // value for 'createEventInput'
 *   },
 * });
 */
export function useCreateEventMutation(baseOptions?: Apollo.MutationHookOptions<CreateEventMutation, CreateEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEventMutation, CreateEventMutationVariables>(CreateEventDocument, options);
      }
export type CreateEventMutationHookResult = ReturnType<typeof useCreateEventMutation>;
export type CreateEventMutationResult = Apollo.MutationResult<CreateEventMutation>;
export type CreateEventMutationOptions = Apollo.BaseMutationOptions<CreateEventMutation, CreateEventMutationVariables>;
export const EventsDocument = gql`
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
    `;
export type EventsMutationFn = Apollo.MutationFunction<EventsMutation, EventsMutationVariables>;

/**
 * __useEventsMutation__
 *
 * To run a mutation, you first call `useEventsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEventsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [eventsMutation, { data, loading, error }] = useEventsMutation({
 *   variables: {
 *      eventsInput: // value for 'eventsInput'
 *   },
 * });
 */
export function useEventsMutation(baseOptions?: Apollo.MutationHookOptions<EventsMutation, EventsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EventsMutation, EventsMutationVariables>(EventsDocument, options);
      }
export type EventsMutationHookResult = ReturnType<typeof useEventsMutation>;
export type EventsMutationResult = Apollo.MutationResult<EventsMutation>;
export type EventsMutationOptions = Apollo.BaseMutationOptions<EventsMutation, EventsMutationVariables>;
export const EditEventDocument = gql`
    mutation EditEvent($editEventInput: EditEventInput!) {
  editEvent(input: $editEventInput) {
    ok
    error {
      ko
      en
    }
  }
}
    `;
export type EditEventMutationFn = Apollo.MutationFunction<EditEventMutation, EditEventMutationVariables>;

/**
 * __useEditEventMutation__
 *
 * To run a mutation, you first call `useEditEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editEventMutation, { data, loading, error }] = useEditEventMutation({
 *   variables: {
 *      editEventInput: // value for 'editEventInput'
 *   },
 * });
 */
export function useEditEventMutation(baseOptions?: Apollo.MutationHookOptions<EditEventMutation, EditEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditEventMutation, EditEventMutationVariables>(EditEventDocument, options);
      }
export type EditEventMutationHookResult = ReturnType<typeof useEditEventMutation>;
export type EditEventMutationResult = Apollo.MutationResult<EditEventMutation>;
export type EditEventMutationOptions = Apollo.BaseMutationOptions<EditEventMutation, EditEventMutationVariables>;
export const CreateFaqDocument = gql`
    mutation CreateFaq($createFaqInput: CreateFaqInput!) {
  createFaq(input: $createFaqInput) {
    ok
    error {
      ko
      en
    }
  }
}
    `;
export type CreateFaqMutationFn = Apollo.MutationFunction<CreateFaqMutation, CreateFaqMutationVariables>;

/**
 * __useCreateFaqMutation__
 *
 * To run a mutation, you first call `useCreateFaqMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFaqMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFaqMutation, { data, loading, error }] = useCreateFaqMutation({
 *   variables: {
 *      createFaqInput: // value for 'createFaqInput'
 *   },
 * });
 */
export function useCreateFaqMutation(baseOptions?: Apollo.MutationHookOptions<CreateFaqMutation, CreateFaqMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateFaqMutation, CreateFaqMutationVariables>(CreateFaqDocument, options);
      }
export type CreateFaqMutationHookResult = ReturnType<typeof useCreateFaqMutation>;
export type CreateFaqMutationResult = Apollo.MutationResult<CreateFaqMutation>;
export type CreateFaqMutationOptions = Apollo.BaseMutationOptions<CreateFaqMutation, CreateFaqMutationVariables>;
export const FaqsDocument = gql`
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
    `;
export type FaqsMutationFn = Apollo.MutationFunction<FaqsMutation, FaqsMutationVariables>;

/**
 * __useFaqsMutation__
 *
 * To run a mutation, you first call `useFaqsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFaqsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [faqsMutation, { data, loading, error }] = useFaqsMutation({
 *   variables: {
 *      faqsInput: // value for 'faqsInput'
 *   },
 * });
 */
export function useFaqsMutation(baseOptions?: Apollo.MutationHookOptions<FaqsMutation, FaqsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<FaqsMutation, FaqsMutationVariables>(FaqsDocument, options);
      }
export type FaqsMutationHookResult = ReturnType<typeof useFaqsMutation>;
export type FaqsMutationResult = Apollo.MutationResult<FaqsMutation>;
export type FaqsMutationOptions = Apollo.BaseMutationOptions<FaqsMutation, FaqsMutationVariables>;
export const EditFaqDocument = gql`
    mutation EditFaq($editFaqInput: EditFaqInput!) {
  editFaq(input: $editFaqInput) {
    ok
    error {
      ko
      en
    }
  }
}
    `;
export type EditFaqMutationFn = Apollo.MutationFunction<EditFaqMutation, EditFaqMutationVariables>;

/**
 * __useEditFaqMutation__
 *
 * To run a mutation, you first call `useEditFaqMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditFaqMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editFaqMutation, { data, loading, error }] = useEditFaqMutation({
 *   variables: {
 *      editFaqInput: // value for 'editFaqInput'
 *   },
 * });
 */
export function useEditFaqMutation(baseOptions?: Apollo.MutationHookOptions<EditFaqMutation, EditFaqMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditFaqMutation, EditFaqMutationVariables>(EditFaqDocument, options);
      }
export type EditFaqMutationHookResult = ReturnType<typeof useEditFaqMutation>;
export type EditFaqMutationResult = Apollo.MutationResult<EditFaqMutation>;
export type EditFaqMutationOptions = Apollo.BaseMutationOptions<EditFaqMutation, EditFaqMutationVariables>;
export const CreateAnswerDocument = gql`
    mutation CreateAnswer($createAnswerInput: CreateAnswerInput!) {
  createAnswer(input: $createAnswerInput) {
    ok
    error {
      ko
      en
    }
  }
}
    `;
export type CreateAnswerMutationFn = Apollo.MutationFunction<CreateAnswerMutation, CreateAnswerMutationVariables>;

/**
 * __useCreateAnswerMutation__
 *
 * To run a mutation, you first call `useCreateAnswerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAnswerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAnswerMutation, { data, loading, error }] = useCreateAnswerMutation({
 *   variables: {
 *      createAnswerInput: // value for 'createAnswerInput'
 *   },
 * });
 */
export function useCreateAnswerMutation(baseOptions?: Apollo.MutationHookOptions<CreateAnswerMutation, CreateAnswerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAnswerMutation, CreateAnswerMutationVariables>(CreateAnswerDocument, options);
      }
export type CreateAnswerMutationHookResult = ReturnType<typeof useCreateAnswerMutation>;
export type CreateAnswerMutationResult = Apollo.MutationResult<CreateAnswerMutation>;
export type CreateAnswerMutationOptions = Apollo.BaseMutationOptions<CreateAnswerMutation, CreateAnswerMutationVariables>;
export const InquiriesDocument = gql`
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
    `;
export type InquiriesMutationFn = Apollo.MutationFunction<InquiriesMutation, InquiriesMutationVariables>;

/**
 * __useInquiriesMutation__
 *
 * To run a mutation, you first call `useInquiriesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInquiriesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [inquiriesMutation, { data, loading, error }] = useInquiriesMutation({
 *   variables: {
 *      inquiriesInput: // value for 'inquiriesInput'
 *   },
 * });
 */
export function useInquiriesMutation(baseOptions?: Apollo.MutationHookOptions<InquiriesMutation, InquiriesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InquiriesMutation, InquiriesMutationVariables>(InquiriesDocument, options);
      }
export type InquiriesMutationHookResult = ReturnType<typeof useInquiriesMutation>;
export type InquiriesMutationResult = Apollo.MutationResult<InquiriesMutation>;
export type InquiriesMutationOptions = Apollo.BaseMutationOptions<InquiriesMutation, InquiriesMutationVariables>;
export const SuspendMemberByIdDocument = gql`
    mutation SuspendMemberById($memberSuspendInput: MemberSuspendInput!) {
  suspendMemberById(input: $memberSuspendInput) {
    ok
    error {
      ko
      en
    }
  }
}
    `;
export type SuspendMemberByIdMutationFn = Apollo.MutationFunction<SuspendMemberByIdMutation, SuspendMemberByIdMutationVariables>;

/**
 * __useSuspendMemberByIdMutation__
 *
 * To run a mutation, you first call `useSuspendMemberByIdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSuspendMemberByIdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [suspendMemberByIdMutation, { data, loading, error }] = useSuspendMemberByIdMutation({
 *   variables: {
 *      memberSuspendInput: // value for 'memberSuspendInput'
 *   },
 * });
 */
export function useSuspendMemberByIdMutation(baseOptions?: Apollo.MutationHookOptions<SuspendMemberByIdMutation, SuspendMemberByIdMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SuspendMemberByIdMutation, SuspendMemberByIdMutationVariables>(SuspendMemberByIdDocument, options);
      }
export type SuspendMemberByIdMutationHookResult = ReturnType<typeof useSuspendMemberByIdMutation>;
export type SuspendMemberByIdMutationResult = Apollo.MutationResult<SuspendMemberByIdMutation>;
export type SuspendMemberByIdMutationOptions = Apollo.BaseMutationOptions<SuspendMemberByIdMutation, SuspendMemberByIdMutationVariables>;
export const ActiveHistoriesByMemberIdDocument = gql`
    mutation ActiveHistoriesByMemberId($activeHistoriesByMemberIdInput: ActiveHistoriesByMemberIdInput!) {
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
    `;
export type ActiveHistoriesByMemberIdMutationFn = Apollo.MutationFunction<ActiveHistoriesByMemberIdMutation, ActiveHistoriesByMemberIdMutationVariables>;

/**
 * __useActiveHistoriesByMemberIdMutation__
 *
 * To run a mutation, you first call `useActiveHistoriesByMemberIdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useActiveHistoriesByMemberIdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [activeHistoriesByMemberIdMutation, { data, loading, error }] = useActiveHistoriesByMemberIdMutation({
 *   variables: {
 *      activeHistoriesByMemberIdInput: // value for 'activeHistoriesByMemberIdInput'
 *   },
 * });
 */
export function useActiveHistoriesByMemberIdMutation(baseOptions?: Apollo.MutationHookOptions<ActiveHistoriesByMemberIdMutation, ActiveHistoriesByMemberIdMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ActiveHistoriesByMemberIdMutation, ActiveHistoriesByMemberIdMutationVariables>(ActiveHistoriesByMemberIdDocument, options);
      }
export type ActiveHistoriesByMemberIdMutationHookResult = ReturnType<typeof useActiveHistoriesByMemberIdMutation>;
export type ActiveHistoriesByMemberIdMutationResult = Apollo.MutationResult<ActiveHistoriesByMemberIdMutation>;
export type ActiveHistoriesByMemberIdMutationOptions = Apollo.BaseMutationOptions<ActiveHistoriesByMemberIdMutation, ActiveHistoriesByMemberIdMutationVariables>;
export const PointHistoriesByMemberIdDocument = gql`
    mutation PointHistoriesByMemberId($pointHistoriesByMemberIdInput: PointHistoriesByMemberIdInput!) {
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
    `;
export type PointHistoriesByMemberIdMutationFn = Apollo.MutationFunction<PointHistoriesByMemberIdMutation, PointHistoriesByMemberIdMutationVariables>;

/**
 * __usePointHistoriesByMemberIdMutation__
 *
 * To run a mutation, you first call `usePointHistoriesByMemberIdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePointHistoriesByMemberIdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pointHistoriesByMemberIdMutation, { data, loading, error }] = usePointHistoriesByMemberIdMutation({
 *   variables: {
 *      pointHistoriesByMemberIdInput: // value for 'pointHistoriesByMemberIdInput'
 *   },
 * });
 */
export function usePointHistoriesByMemberIdMutation(baseOptions?: Apollo.MutationHookOptions<PointHistoriesByMemberIdMutation, PointHistoriesByMemberIdMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PointHistoriesByMemberIdMutation, PointHistoriesByMemberIdMutationVariables>(PointHistoriesByMemberIdDocument, options);
      }
export type PointHistoriesByMemberIdMutationHookResult = ReturnType<typeof usePointHistoriesByMemberIdMutation>;
export type PointHistoriesByMemberIdMutationResult = Apollo.MutationResult<PointHistoriesByMemberIdMutation>;
export type PointHistoriesByMemberIdMutationOptions = Apollo.BaseMutationOptions<PointHistoriesByMemberIdMutation, PointHistoriesByMemberIdMutationVariables>;
export const CommentHistoriesByMemberIdDocument = gql`
    mutation CommentHistoriesByMemberId($commentHistoriesByMemberIdInput: CommentHistoriesByMemberIdInput!) {
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
    `;
export type CommentHistoriesByMemberIdMutationFn = Apollo.MutationFunction<CommentHistoriesByMemberIdMutation, CommentHistoriesByMemberIdMutationVariables>;

/**
 * __useCommentHistoriesByMemberIdMutation__
 *
 * To run a mutation, you first call `useCommentHistoriesByMemberIdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCommentHistoriesByMemberIdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [commentHistoriesByMemberIdMutation, { data, loading, error }] = useCommentHistoriesByMemberIdMutation({
 *   variables: {
 *      commentHistoriesByMemberIdInput: // value for 'commentHistoriesByMemberIdInput'
 *   },
 * });
 */
export function useCommentHistoriesByMemberIdMutation(baseOptions?: Apollo.MutationHookOptions<CommentHistoriesByMemberIdMutation, CommentHistoriesByMemberIdMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CommentHistoriesByMemberIdMutation, CommentHistoriesByMemberIdMutationVariables>(CommentHistoriesByMemberIdDocument, options);
      }
export type CommentHistoriesByMemberIdMutationHookResult = ReturnType<typeof useCommentHistoriesByMemberIdMutation>;
export type CommentHistoriesByMemberIdMutationResult = Apollo.MutationResult<CommentHistoriesByMemberIdMutation>;
export type CommentHistoriesByMemberIdMutationOptions = Apollo.BaseMutationOptions<CommentHistoriesByMemberIdMutation, CommentHistoriesByMemberIdMutationVariables>;
export const DeleteVodCommentDocument = gql`
    mutation DeleteVodComment($deleteVodCommentInput: DeleteVodCommentInput!) {
  deleteVodComment(input: $deleteVodCommentInput) {
    ok
    error {
      ko
      en
    }
  }
}
    `;
export type DeleteVodCommentMutationFn = Apollo.MutationFunction<DeleteVodCommentMutation, DeleteVodCommentMutationVariables>;

/**
 * __useDeleteVodCommentMutation__
 *
 * To run a mutation, you first call `useDeleteVodCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteVodCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteVodCommentMutation, { data, loading, error }] = useDeleteVodCommentMutation({
 *   variables: {
 *      deleteVodCommentInput: // value for 'deleteVodCommentInput'
 *   },
 * });
 */
export function useDeleteVodCommentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteVodCommentMutation, DeleteVodCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteVodCommentMutation, DeleteVodCommentMutationVariables>(DeleteVodCommentDocument, options);
      }
export type DeleteVodCommentMutationHookResult = ReturnType<typeof useDeleteVodCommentMutation>;
export type DeleteVodCommentMutationResult = Apollo.MutationResult<DeleteVodCommentMutation>;
export type DeleteVodCommentMutationOptions = Apollo.BaseMutationOptions<DeleteVodCommentMutation, DeleteVodCommentMutationVariables>;
export const ListSendBirdMessagesDocument = gql`
    mutation ListSendBirdMessages($liveChatHistoriesByHistoryIdInput: LiveChatHistoriesByHistoryIdInput!) {
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
    `;
export type ListSendBirdMessagesMutationFn = Apollo.MutationFunction<ListSendBirdMessagesMutation, ListSendBirdMessagesMutationVariables>;

/**
 * __useListSendBirdMessagesMutation__
 *
 * To run a mutation, you first call `useListSendBirdMessagesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useListSendBirdMessagesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [listSendBirdMessagesMutation, { data, loading, error }] = useListSendBirdMessagesMutation({
 *   variables: {
 *      liveChatHistoriesByHistoryIdInput: // value for 'liveChatHistoriesByHistoryIdInput'
 *   },
 * });
 */
export function useListSendBirdMessagesMutation(baseOptions?: Apollo.MutationHookOptions<ListSendBirdMessagesMutation, ListSendBirdMessagesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ListSendBirdMessagesMutation, ListSendBirdMessagesMutationVariables>(ListSendBirdMessagesDocument, options);
      }
export type ListSendBirdMessagesMutationHookResult = ReturnType<typeof useListSendBirdMessagesMutation>;
export type ListSendBirdMessagesMutationResult = Apollo.MutationResult<ListSendBirdMessagesMutation>;
export type ListSendBirdMessagesMutationOptions = Apollo.BaseMutationOptions<ListSendBirdMessagesMutation, ListSendBirdMessagesMutationVariables>;
export const MyDocument = gql`
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
    `;

/**
 * __useMyQuery__
 *
 * To run a query within a React component, call `useMyQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyQuery(baseOptions?: Apollo.QueryHookOptions<MyQuery, MyQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyQuery, MyQueryVariables>(MyDocument, options);
      }
export function useMyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyQuery, MyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyQuery, MyQueryVariables>(MyDocument, options);
        }
export type MyQueryHookResult = ReturnType<typeof useMyQuery>;
export type MyLazyQueryHookResult = ReturnType<typeof useMyLazyQuery>;
export type MyQueryResult = Apollo.QueryResult<MyQuery, MyQueryVariables>;
export const FindMemberByIdDocument = gql`
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
    `;

/**
 * __useFindMemberByIdQuery__
 *
 * To run a query within a React component, call `useFindMemberByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindMemberByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindMemberByIdQuery({
 *   variables: {
 *      memberInput: // value for 'memberInput'
 *   },
 * });
 */
export function useFindMemberByIdQuery(baseOptions: Apollo.QueryHookOptions<FindMemberByIdQuery, FindMemberByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindMemberByIdQuery, FindMemberByIdQueryVariables>(FindMemberByIdDocument, options);
      }
export function useFindMemberByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindMemberByIdQuery, FindMemberByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindMemberByIdQuery, FindMemberByIdQueryVariables>(FindMemberByIdDocument, options);
        }
export type FindMemberByIdQueryHookResult = ReturnType<typeof useFindMemberByIdQuery>;
export type FindMemberByIdLazyQueryHookResult = ReturnType<typeof useFindMemberByIdLazyQuery>;
export type FindMemberByIdQueryResult = Apollo.QueryResult<FindMemberByIdQuery, FindMemberByIdQueryVariables>;
export const FindMembersByTypeDocument = gql`
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
    `;

/**
 * __useFindMembersByTypeQuery__
 *
 * To run a query within a React component, call `useFindMembersByTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindMembersByTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindMembersByTypeQuery({
 *   variables: {
 *      membersByTypeInput: // value for 'membersByTypeInput'
 *   },
 * });
 */
export function useFindMembersByTypeQuery(baseOptions: Apollo.QueryHookOptions<FindMembersByTypeQuery, FindMembersByTypeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindMembersByTypeQuery, FindMembersByTypeQueryVariables>(FindMembersByTypeDocument, options);
      }
export function useFindMembersByTypeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindMembersByTypeQuery, FindMembersByTypeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindMembersByTypeQuery, FindMembersByTypeQueryVariables>(FindMembersByTypeDocument, options);
        }
export type FindMembersByTypeQueryHookResult = ReturnType<typeof useFindMembersByTypeQuery>;
export type FindMembersByTypeLazyQueryHookResult = ReturnType<typeof useFindMembersByTypeLazyQuery>;
export type FindMembersByTypeQueryResult = Apollo.QueryResult<FindMembersByTypeQuery, FindMembersByTypeQueryVariables>;
export const FindLiveByIdDocument = gql`
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
        shareApplyDate
        liveId
        memberShareInfo {
          memberId
          nickName
          priorityShare
          directShare
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
    `;

/**
 * __useFindLiveByIdQuery__
 *
 * To run a query within a React component, call `useFindLiveByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindLiveByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindLiveByIdQuery({
 *   variables: {
 *      liveInput: // value for 'liveInput'
 *   },
 * });
 */
export function useFindLiveByIdQuery(baseOptions: Apollo.QueryHookOptions<FindLiveByIdQuery, FindLiveByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindLiveByIdQuery, FindLiveByIdQueryVariables>(FindLiveByIdDocument, options);
      }
export function useFindLiveByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindLiveByIdQuery, FindLiveByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindLiveByIdQuery, FindLiveByIdQueryVariables>(FindLiveByIdDocument, options);
        }
export type FindLiveByIdQueryHookResult = ReturnType<typeof useFindLiveByIdQuery>;
export type FindLiveByIdLazyQueryHookResult = ReturnType<typeof useFindLiveByIdLazyQuery>;
export type FindLiveByIdQueryResult = Apollo.QueryResult<FindLiveByIdQuery, FindLiveByIdQueryVariables>;
export const FindVodByIdDocument = gql`
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
        shareApplyDate
        vodId
        memberShareInfo {
          memberId
          nickName
          priorityShare
          directShare
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
    `;

/**
 * __useFindVodByIdQuery__
 *
 * To run a query within a React component, call `useFindVodByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindVodByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindVodByIdQuery({
 *   variables: {
 *      vodInput: // value for 'vodInput'
 *   },
 * });
 */
export function useFindVodByIdQuery(baseOptions: Apollo.QueryHookOptions<FindVodByIdQuery, FindVodByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindVodByIdQuery, FindVodByIdQueryVariables>(FindVodByIdDocument, options);
      }
export function useFindVodByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindVodByIdQuery, FindVodByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindVodByIdQuery, FindVodByIdQueryVariables>(FindVodByIdDocument, options);
        }
export type FindVodByIdQueryHookResult = ReturnType<typeof useFindVodByIdQuery>;
export type FindVodByIdLazyQueryHookResult = ReturnType<typeof useFindVodByIdLazyQuery>;
export type FindVodByIdQueryResult = Apollo.QueryResult<FindVodByIdQuery, FindVodByIdQueryVariables>;
export const FindLiveByTypesDocument = gql`
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
    `;

/**
 * __useFindLiveByTypesQuery__
 *
 * To run a query within a React component, call `useFindLiveByTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindLiveByTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindLiveByTypesQuery({
 *   variables: {
 *      findLiveByTypesInput: // value for 'findLiveByTypesInput'
 *   },
 * });
 */
export function useFindLiveByTypesQuery(baseOptions: Apollo.QueryHookOptions<FindLiveByTypesQuery, FindLiveByTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindLiveByTypesQuery, FindLiveByTypesQueryVariables>(FindLiveByTypesDocument, options);
      }
export function useFindLiveByTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindLiveByTypesQuery, FindLiveByTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindLiveByTypesQuery, FindLiveByTypesQueryVariables>(FindLiveByTypesDocument, options);
        }
export type FindLiveByTypesQueryHookResult = ReturnType<typeof useFindLiveByTypesQuery>;
export type FindLiveByTypesLazyQueryHookResult = ReturnType<typeof useFindLiveByTypesLazyQuery>;
export type FindLiveByTypesQueryResult = Apollo.QueryResult<FindLiveByTypesQuery, FindLiveByTypesQueryVariables>;
export const FindVodByTypesDocument = gql`
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
    `;

/**
 * __useFindVodByTypesQuery__
 *
 * To run a query within a React component, call `useFindVodByTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindVodByTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindVodByTypesQuery({
 *   variables: {
 *      findVodByTypesInput: // value for 'findVodByTypesInput'
 *   },
 * });
 */
export function useFindVodByTypesQuery(baseOptions: Apollo.QueryHookOptions<FindVodByTypesQuery, FindVodByTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindVodByTypesQuery, FindVodByTypesQueryVariables>(FindVodByTypesDocument, options);
      }
export function useFindVodByTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindVodByTypesQuery, FindVodByTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindVodByTypesQuery, FindVodByTypesQueryVariables>(FindVodByTypesDocument, options);
        }
export type FindVodByTypesQueryHookResult = ReturnType<typeof useFindVodByTypesQuery>;
export type FindVodByTypesLazyQueryHookResult = ReturnType<typeof useFindVodByTypesLazyQuery>;
export type FindVodByTypesQueryResult = Apollo.QueryResult<FindVodByTypesQuery, FindVodByTypesQueryVariables>;
export const MainBannerLiveContentsDocument = gql`
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
    `;

/**
 * __useMainBannerLiveContentsQuery__
 *
 * To run a query within a React component, call `useMainBannerLiveContentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMainBannerLiveContentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMainBannerLiveContentsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMainBannerLiveContentsQuery(baseOptions?: Apollo.QueryHookOptions<MainBannerLiveContentsQuery, MainBannerLiveContentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MainBannerLiveContentsQuery, MainBannerLiveContentsQueryVariables>(MainBannerLiveContentsDocument, options);
      }
export function useMainBannerLiveContentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MainBannerLiveContentsQuery, MainBannerLiveContentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MainBannerLiveContentsQuery, MainBannerLiveContentsQueryVariables>(MainBannerLiveContentsDocument, options);
        }
export type MainBannerLiveContentsQueryHookResult = ReturnType<typeof useMainBannerLiveContentsQuery>;
export type MainBannerLiveContentsLazyQueryHookResult = ReturnType<typeof useMainBannerLiveContentsLazyQuery>;
export type MainBannerLiveContentsQueryResult = Apollo.QueryResult<MainBannerLiveContentsQuery, MainBannerLiveContentsQueryVariables>;
export const FindAdvertisementByIdDocument = gql`
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
    `;

/**
 * __useFindAdvertisementByIdQuery__
 *
 * To run a query within a React component, call `useFindAdvertisementByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAdvertisementByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAdvertisementByIdQuery({
 *   variables: {
 *      findAdvertisementByIdInput: // value for 'findAdvertisementByIdInput'
 *   },
 * });
 */
export function useFindAdvertisementByIdQuery(baseOptions: Apollo.QueryHookOptions<FindAdvertisementByIdQuery, FindAdvertisementByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAdvertisementByIdQuery, FindAdvertisementByIdQueryVariables>(FindAdvertisementByIdDocument, options);
      }
export function useFindAdvertisementByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAdvertisementByIdQuery, FindAdvertisementByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAdvertisementByIdQuery, FindAdvertisementByIdQueryVariables>(FindAdvertisementByIdDocument, options);
        }
export type FindAdvertisementByIdQueryHookResult = ReturnType<typeof useFindAdvertisementByIdQuery>;
export type FindAdvertisementByIdLazyQueryHookResult = ReturnType<typeof useFindAdvertisementByIdLazyQuery>;
export type FindAdvertisementByIdQueryResult = Apollo.QueryResult<FindAdvertisementByIdQuery, FindAdvertisementByIdQueryVariables>;
export const FindBoardByIdDocument = gql`
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
    `;

/**
 * __useFindBoardByIdQuery__
 *
 * To run a query within a React component, call `useFindBoardByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindBoardByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindBoardByIdQuery({
 *   variables: {
 *      boardInput: // value for 'boardInput'
 *   },
 * });
 */
export function useFindBoardByIdQuery(baseOptions: Apollo.QueryHookOptions<FindBoardByIdQuery, FindBoardByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindBoardByIdQuery, FindBoardByIdQueryVariables>(FindBoardByIdDocument, options);
      }
export function useFindBoardByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindBoardByIdQuery, FindBoardByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindBoardByIdQuery, FindBoardByIdQueryVariables>(FindBoardByIdDocument, options);
        }
export type FindBoardByIdQueryHookResult = ReturnType<typeof useFindBoardByIdQuery>;
export type FindBoardByIdLazyQueryHookResult = ReturnType<typeof useFindBoardByIdLazyQuery>;
export type FindBoardByIdQueryResult = Apollo.QueryResult<FindBoardByIdQuery, FindBoardByIdQueryVariables>;
export const GetGoingDashboardDocument = gql`
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
    `;

/**
 * __useGetGoingDashboardQuery__
 *
 * To run a query within a React component, call `useGetGoingDashboardQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGoingDashboardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGoingDashboardQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetGoingDashboardQuery(baseOptions?: Apollo.QueryHookOptions<GetGoingDashboardQuery, GetGoingDashboardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGoingDashboardQuery, GetGoingDashboardQueryVariables>(GetGoingDashboardDocument, options);
      }
export function useGetGoingDashboardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGoingDashboardQuery, GetGoingDashboardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGoingDashboardQuery, GetGoingDashboardQueryVariables>(GetGoingDashboardDocument, options);
        }
export type GetGoingDashboardQueryHookResult = ReturnType<typeof useGetGoingDashboardQuery>;
export type GetGoingDashboardLazyQueryHookResult = ReturnType<typeof useGetGoingDashboardLazyQuery>;
export type GetGoingDashboardQueryResult = Apollo.QueryResult<GetGoingDashboardQuery, GetGoingDashboardQueryVariables>;