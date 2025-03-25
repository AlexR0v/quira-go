export type TSignInRequest = {
  email: string;
  password: string;
}

export type TSignUpRequest = {
  email: string;
  name: string;
  password: string;
}

export type TSignInResponse = {
  access_token: string;
}

export type TSignUpResponse = {
  access_token: string;
}