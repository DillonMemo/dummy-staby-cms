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
  faqType?: Maybe<FaqType>;
  memberId: Scalars['ID'];
  questionType?: Maybe<QuestionType>;
  title: Scalars['String'];
  updateDate: Scalars['DateTime'];
  updateMember: AuthMember;
  uploadImageInfo?: Maybe<UploadImageInfo>;
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
  Delete = 'DELETE',
  Display = 'DISPLAY'
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

export type CreateEventInput = {
  content?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type CreateEventOutput = {
  __typename?: 'CreateEventOutput';
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
  title: Scalars['String'];
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
  title: Scalars['String'];
  vodLinkInfo: Array<VodLinkInfoInputType>;
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
  vodShareInfo: VodShareInfoInputType;
  vodStatus?: Maybe<VodStatus>;
};

export type EditVodOutput = {
  __typename?: 'EditVodOutput';
  error?: Maybe<LangErrorMessage>;
  ok: Scalars['Boolean'];
};

export type EventsInput = {
  page?: Maybe<Scalars['Int']>;
  pageView?: Maybe<Scalars['Int']>;
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
  Payment = 'PAYMENT'
}

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
  title: Scalars['String'];
  updateDate: Scalars['DateTime'];
  updateMember: AuthMember;
  viewCount?: Maybe<Scalars['Float']>;
  vodId?: Maybe<Scalars['ID']>;
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
  hostName?: Maybe<Scalars['String']>;
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
  createDate: Scalars['DateTime'];
  email: Scalars['String'];
  lastLoginDate?: Maybe<Scalars['DateTime']>;
  memberStatus: MemberStatus;
  memberType: MemberType;
  nickName: Scalars['String'];
  password: Scalars['String'];
  point: Point;
  profileImageName?: Maybe<Scalars['String']>;
  refreshToken?: Maybe<Scalars['String']>;
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

export enum MemberType {
  Admin = 'ADMIN',
  Business = 'BUSINESS',
  Normal = 'NORMAL',
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

export type Mutation = {
  __typename?: 'Mutation';
  advertisements: AdvertisementsOutput;
  changeAdvertisementStatus: ChangeAdvertisementStatusOutput;
  createAccount: CreateMemberOutput;
  createAdvertisement: CreateAdvertisementOutput;
  createEvent: CreateEventOutput;
  createLive: CreateLiveOutput;
  createMainBannerLiveContents: CreateMainBannerLiveOutput;
  createNotice: CreateNoticeOutput;
  createVod: CreateVodOutput;
  deleteBoard: DeleteBoardOutput;
  deleteLive: DeleteLiveOutput;
  deleteVod: DeleteVodOutput;
  editAccount: EditMemberOutput;
  editAdvertisement: EditAdvertisementOutput;
  editEvent: EditEventOutput;
  editLive: EditLiveOutput;
  editMemberById: EditMemberOutput;
  editNotice: EditNoticeOutput;
  editVod: EditVodOutput;
  events: EventsOutput;
  lives: LivesOutput;
  login: LoginOutput;
  logout: LogoutOutput;
  members: MembersOutput;
  notices: NoticesOutput;
  vods: VodsOutput;
};


export type MutationAdvertisementsArgs = {
  input: AdvertisementsInput;
};


export type MutationChangeAdvertisementStatusArgs = {
  input: ChangeAdvertisementStatusInput;
};


export type MutationCreateAccountArgs = {
  input: CreateMemberInput;
};


export type MutationCreateAdvertisementArgs = {
  input: CreateAdvertisementInput;
};


export type MutationCreateEventArgs = {
  input: CreateEventInput;
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


export type MutationEditAccountArgs = {
  input: EditMemberInput;
};


export type MutationEditAdvertisementArgs = {
  input: EditAdvertisementInput;
};


export type MutationEditEventArgs = {
  input: EditEventInput;
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


export type MutationLivesArgs = {
  input: LivesInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationMembersArgs = {
  input: MembersInput;
};


export type MutationNoticesArgs = {
  input: NoticesInput;
};


export type MutationVodsArgs = {
  input: VodsInput;
};

export type NoticesInput = {
  page?: Maybe<Scalars['Int']>;
  pageView?: Maybe<Scalars['Int']>;
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

export type UploadImageInfoInputType = {
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
  storageTotalCount?: Maybe<Scalars['Float']>;
  title: Scalars['String'];
  updateDate: Scalars['DateTime'];
  viewCount?: Maybe<Scalars['Float']>;
  vodLinkInfo: Array<VodLinkInfo>;
  vodShareInfo: VodShareInfo;
  vodStatus: VodStatus;
};

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


export type MembersMutation = { __typename?: 'Mutation', members: { __typename?: 'MembersOutput', ok: boolean, totalResults?: number | null | undefined, totalPages?: number | null | undefined, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, members?: Array<{ __typename?: 'Member', _id: string, email: string, nickName: string, memberStatus: MemberStatus, memberType: MemberType, point: { __typename?: 'Point', totalPoint: number, paidPoint: number, freePoint: number } }> | null | undefined } };

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


export type LivesMutation = { __typename?: 'Mutation', lives: { __typename?: 'LivesOutput', ok: boolean, totalPages?: number | null | undefined, totalResults?: number | null | undefined, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, lives?: Array<{ __typename?: 'Live', _id: string, title: string, content?: string | null | undefined, hostName: string, paymentAmount: number, livePreviewDate: any, liveStartDate?: any | null | undefined, liveEndDate?: any | null | undefined, mainImageName: string, viewCount?: number | null | undefined, delayedEntryTime: number, likeCount?: number | null | undefined, liveStatus: LiveStatus, vodId?: string | null | undefined, liveLinkInfo: Array<{ __typename?: 'LiveLinkInfo', linkPath?: string | null | undefined, playingImageName?: string | null | undefined, listingOrder: number }> }> | null | undefined } };

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


export type VodsMutation = { __typename?: 'Mutation', vods: { __typename?: 'VodsOutput', ok: boolean, totalPages?: number | null | undefined, totalResults?: number | null | undefined, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, vods?: Array<{ __typename?: 'Vod', _id: string, title: string, content?: string | null | undefined, paymentAmount: number, viewCount?: number | null | undefined, storageTotalCount?: number | null | undefined, mainImageName: string, liveId?: string | null | undefined, vodStatus: VodStatus }> | null | undefined } };

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


export type AdvertisementsMutation = { __typename?: 'Mutation', advertisements: { __typename?: 'AdvertisementsOutput', ok: boolean, totalPages?: number | null | undefined, totalResults?: number | null | undefined, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, advertisements?: Array<{ __typename?: 'Advertisement', _id: string, advertiseStatus: AdvertiseStatus, displayType: DisplayType, title: string, content?: string | null | undefined, linkType: LinkType, linkUrl: string, startDate: any, endDate: any }> | null | undefined } };

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

export type MyQueryVariables = Exact<{ [key: string]: never; }>;


export type MyQuery = { __typename?: 'Query', my: { __typename?: 'Member', _id: string, email: string, password: string, nickName: string, profileImageName?: string | null | undefined, memberStatus: MemberStatus, memberType: MemberType, refreshToken?: string | null | undefined, lastLoginDate?: any | null | undefined } };

export type FindMemberByIdQueryVariables = Exact<{
  memberInput: MemberInput;
}>;


export type FindMemberByIdQuery = { __typename?: 'Query', findMemberById: { __typename?: 'MemberOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, member?: { __typename?: 'Member', email: string, nickName: string, memberStatus: MemberStatus, memberType: MemberType, createDate: any, point: { __typename?: 'Point', totalPoint: number, paidPoint: number, freePoint: number } } | null | undefined } };

export type FindMembersByTypeQueryVariables = Exact<{
  membersByTypeInput: MembersByTypeInput;
}>;


export type FindMembersByTypeQuery = { __typename?: 'Query', findMembersByType: { __typename?: 'MembersByTypeOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, members: Array<{ __typename?: 'Member', _id: string, nickName: string, memberStatus: MemberStatus, memberType: MemberType }> } };

export type FindLiveByIdQueryVariables = Exact<{
  liveInput: LiveInput;
}>;


export type FindLiveByIdQuery = { __typename?: 'Query', findLiveById: { __typename?: 'LiveOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, live?: { __typename?: 'Live', _id: string, title: string, content?: string | null | undefined, hostName: string, paymentAmount: number, livePreviewDate: any, liveStartDate?: any | null | undefined, liveEndDate?: any | null | undefined, mainImageName: string, viewCount?: number | null | undefined, delayedEntryTime: number, likeCount?: number | null | undefined, liveStatus: LiveStatus, vodId?: string | null | undefined, createDate: any, updateDate: any, liveLinkInfo: Array<{ __typename?: 'LiveLinkInfo', linkPath?: string | null | undefined, playingImageName?: string | null | undefined, listingOrder: number }>, liveShareInfo: { __typename?: 'LiveShareInfo', shareApplyDate?: any | null | undefined, liveId: string, memberShareInfo: Array<{ __typename?: 'MemberShareInfo', memberId: string, nickName: string, priorityShare: number, directShare: number }> } } | null | undefined } };

export type FindVodByIdQueryVariables = Exact<{
  vodInput: FindVodByIdInput;
}>;


export type FindVodByIdQuery = { __typename?: 'Query', findVodById: { __typename?: 'FindVodByIdOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, vod?: { __typename?: 'Vod', _id: string, title: string, content?: string | null | undefined, paymentAmount: number, mainImageName: string, storageTotalCount?: number | null | undefined, vodStatus: VodStatus, liveId?: string | null | undefined, createDate: any, updateDate: any, vodLinkInfo: Array<{ __typename?: 'VodLinkInfo', linkPath: string, introImageName: string, playingImageName?: string | null | undefined, transcodeStatus: TranscodeStatus, listingOrder: number }>, vodShareInfo: { __typename?: 'VodShareInfo', shareApplyDate?: any | null | undefined, vodId: string, memberShareInfo: Array<{ __typename?: 'MemberShareInfo', memberId: string, nickName: string, priorityShare: number, directShare: number }> } } | null | undefined } };

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


export type FindBoardByIdQuery = { __typename?: 'Query', findBoardById: { __typename?: 'BoardOutput', ok: boolean, error?: { __typename?: 'LangErrorMessage', ko: string, en: string } | null | undefined, board?: { __typename?: 'Board', title: string, content: string, boardStatus: BoardStatus } | null | undefined } };


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
      point {
        totalPoint
        paidPoint
        freePoint
      }
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
      createDate
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
      title
      content
      boardStatus
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