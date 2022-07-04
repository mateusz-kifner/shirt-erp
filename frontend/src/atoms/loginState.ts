import { atom } from "recoil"
import { LoginType } from "../types/LoginType"
import { localStorageEffect } from "./localStorageEffect"

// export const setJWTToken = () => ({_, onSet}:any) => {
//   onSet((newValue:{jwt:string}) => {
//     if (newValue.jwt.length > 0){
//       console.log(newValue.jwt)
//       axios.defaults.headers.common['Authorization'] = "Bearer " + newValue.jwt;
//     }else{
//       console.log("JWT deleted")
//       delete axios.defaults.headers.common["Authorization"];
//     }
//   });
// };

export const loginState = atom<LoginType>({
  key: "loginState",
  default: {
    user: null,
    jwt: "",
    debug: false,
    navigationCollapsed: false,
  },
  effects_UNSTABLE: [
    localStorageEffect("login"),
    // setJWTToken()
  ],
})

// export const isAuthenticatedSelector = selector({
//   key: 'isAuthenticatedSelector',
//   get: ({get}) => {
//     const loginData = get(loginState);
//     return loginData.jwt != undefined &&  loginData.jwt.length > 0;
//   },
// })
