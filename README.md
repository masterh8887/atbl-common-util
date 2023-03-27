# masterh8887/atbl-common-util
atbl common utility


:chart_with_upwards_trend: common-module

![License](https://img.shields.io/badge/license-UNLICENSED-orange.svg?style=flat)

---

## 사용방법

### 설치

```bash
npm i atbl-common-util
yarn add atbl-common-util
```

### JWT 기본 사용법

```typescript
import { JwtHelper } from "atbl-common-util";

const jwtHelper = new JwtHelper();
const jwt = jwtHelper.getJwtObject(accessToken);
```

- 억세스 토큰이 만료되었는지 여부

```typescript
jwt.isExpired();
```

- 관리자/작가/회원 번호

```typescript
jwt.getSeq();
```

- 관리자/작가/회원 접속 ID

```typescript
jwt.getId();
```



- 관리자/작가/회원 이름

```typescript
jwt.getName();
```

- 관리자/작가/회원 닉네임

```typescript
jwt.getNickName();
```

- 관리자/작가/회원 이메일

```typescript
jwt.getEmail();
```

- 사용자 권한

```typescript
jwt.getType();

TokenType.MANAGER; // 매니저 권한
TokenType.AUTHOR; // 작가 권한
TokenType.USER; // 회원 권한
```

- 관리자 메뉴 권한

```typescript
jwt.getMenuPermissions();
```

- 관리자 관리 페이지 접속 IP 방화벽

```typescript
jwt.getAclList();
```


- 접속 IP 주소

```typescript
jwt.getIp();
```
