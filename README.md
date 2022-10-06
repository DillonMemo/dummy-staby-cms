# Dummy Staby CMS

로그인, 대쉬보드 화면만 정적으로 표현한 샘플 보기용 더미 사이트 입니다.

그 외의 리소스는 **[./backup_pages](https://github.com/DillonMemo/dummy-staby-cms/tree/dev/backup_pages)** 로 위치 변경.


### Challenge

- [x] login form interface 개발
- [x] login form 기능 구현
- [x] user -> member migration
- [x] NPM package refactoring 
- pagination bug
  - [x] Member
  - [x] VOD
  - [x] LIVE
  - [x] 공지사항
  - [x] 이벤트
  - [x] FAQ
  - [x] 문의
- [x] Live refactoring
- [x] VOD refactoring
- [x] apply segmented components in edit live 
- [x] apply segmented components in edit VOD 
- [x] apply progress bar

#### 메모 및 계획

- liveData의 liveInfo를 state에 init 해주기 그리고 TheO API 테스트 진행
  1. liveData의 liveInfo를 가져옴
  2. liveData의 liveInfo 프로퍼티중 linkPath를 TheO API (Get channel status)로 상태 확인
  3. on/off 여부와 linkPath, listingOrder를 liveInfo state에 set initialized
