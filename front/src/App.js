import React from 'react'
import { GoogleLogin } from 'react-google-login';
import Axios from 'axios';

import authAxios from './authAxios';



export default function App() {
  const responseGoogle = async res => {
    const token = res.tokenId;
    const expires = new Date(res.tokenObj.expires_at).toUTCString();

    document.cookie = `Authorization=${token};expires=${expires}`;

    const email = res.profileObj.email;
    const name = res.profileObj.name;
    const checkUser = await Axios.get(`http://localhost:3000/user/check?email=${email}`)
    if (checkUser.data.result) {
      alert("Login Success");
      // react-router-dom -> history.push('/home') redirection 할 수도 있다.
    } else if (checkUser.data.result === false) {
      // 회원가입 진행
      await Axios.post('http://localhost:3000/user/join', { name, email });
      alert('회원가입 및 로그인 성공!');
      // redirect 등 커스터마이징 가능
    } else {
      console.log(checkUser.data.error);
    }
  };
  const responseGoogleError = (response) => {
    console.log(response);
  };

  const getUser = async () => {
    const { data } = await authAxios().get('http://localhost:3000/user');
    console.log(data);
  }

  return (
    <div>
      <GoogleLogin
        clientId="779628944826-tcmn44ln7pke6sijhkg5bnlvufc09pjf.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogleError}
        cookiePolicy={'single_host_origin'}
      />
      <button onClick={getUser}>유저 정보</button>
    </div>
  )
}
