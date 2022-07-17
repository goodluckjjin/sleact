import React, { useState, useCallback } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import useSWR from "swr";
import fetcher from "@utils/fetcher";

import { Success, Form, Error, Label, Input, LinkContainer, Button, Header } from "./styles";
import useInput from "@hooks/useInput";

const SignUp = () => {
  const { data, error, mutate } = useSWR("http://localhost:3095/api/users", fetcher);

  const [email, onChangeEmail, setEmail] = useInput("");
  const [nickname, onChangeNickname, setNickname] = useInput("");
  const [password, onChangePassword, setPassword] = useInput("");
  const [passwordCheck, , setPasswordCheck] = useInput("");
  const [missMatchError, , setMissMatchError] = useInput(false);
  const [signUpSuccess, , setSignUpSuccess] = useInput(false);
  const [signUpError, , setSignUpError] = useInput("");

  const onChangePasswordCheck = useCallback(
    (e: any) => {
      setPasswordCheck(e.target.value);
      setMissMatchError(e.target.value !== password);
      if (!missMatchError) console.log("서버로 회원가입하기");
    },
    [password, missMatchError],
  );

  const onSubmit = useCallback(
    (e: any) => {
      e.preventDefault();
      console.log(email, nickname, password, passwordCheck);
      setSignUpError(""); // 비동기 전 초기화시키기
      setSignUpSuccess(false); // 전에 요청보냈던 결과로부터 영향 안 받기 위함
      axios
        // .post(`/api/users`, {
        .post(`http://localhost:3095/api/users`, {
          email,
          nickname,
          password,
        })
        .then((response) => {
          console.log(response);
          setSignUpSuccess(true);
        })
        .catch((error) => {
          setSignUpError(error.response.data);
          console.log(error.response.data);
        })
        .finally(() => {});
    },
    [email, nickname, password, passwordCheck],
  );

  if (data === undefined) {
    return <div>로딩중...</div>;
  }

  if (data) {
    return <Navigate to="/workspace/sleact/channel/일반" />;
  }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {missMatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
