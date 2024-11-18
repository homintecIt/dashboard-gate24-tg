import { environment } from "src/environments/environment";

export const onlineApiUrlBase = environment.apiUrl;
export const testApiUrlBase = environment.apiTestUrl;

export const apiUrlBase = testApiUrlBase;

const apiEndpoints = {
  apiUrlBase: apiUrlBase,
  signinUrl: `${apiUrlBase}/users/login`,
  signupUrl: `${apiUrlBase}/auth/signup`,
  registerUrl: `${apiUrlBase}/auth/register`,
  signoutUrl: `${apiUrlBase}/auth/signout`,
  userUrl: `${apiUrlBase}/users`,
  forgotPasswordUrl: `${apiUrlBase}/auth/forget/password`,
  resetPasswordUrl: `${apiUrlBase}/auth/reset/password`,
  changePasswordUrl: `${apiUrlBase}/auth/change/password`,
  logoutUrl: `${apiUrlBase}/auth/logout`,
  usersUrl: `${apiUrlBase}/users`,
  uploadProfileUrl: `${apiUrlBase}/file`,
  clientsUrl: `${apiUrlBase}/clients`,
  comptesUrl: `${apiUrlBase}/comptes`,
  rechargesUrl: `${apiUrlBase}/recharges`,
  subscriptionUrl: `${apiUrlBase}/subscription`,
  searchUrl: `${apiUrlBase}/search`,

}

export default apiEndpoints;
