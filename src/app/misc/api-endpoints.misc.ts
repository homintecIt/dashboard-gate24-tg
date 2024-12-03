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
  statisticsUrl: `${apiUrlBase}/statistique`,
  listesClientsUrl : `${apiUrlBase}/clients/all`,
  listesComptesUrl : `${apiUrlBase}/comptes/all`,
  getClientUrl:`${apiUrlBase}/clients/:uuid`,
  updateClientUrl:`${apiUrlBase}/clients/update/:uuid`,
  monthlyReportUrl:`${apiUrlBase}/passage/get-passages-mensuels`,
  sitePassageUrl:`${apiUrlBase}/passage/get/sites/peages`,
  periodReportUrl:`${apiUrlBase}/passage/get-passages-byInterval`,
  getFinancialDataUrl:`${apiUrlBase}/financier/get-data-financier`,
  getServerUrl:`${apiUrlBase}/get/servers`,
  UpdateServerUrl:`${apiUrlBase}/update/status/server/synchro`,
  saveServerUrl:`${apiUrlBase}/save/serve/synchro`,

}

export default apiEndpoints;
