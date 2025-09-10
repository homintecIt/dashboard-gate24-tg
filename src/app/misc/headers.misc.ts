import { HttpHeaders } from "@angular/common/http";
import { storageHelper } from "./storage.misc";
import { APIKEY, jwtTokenIdentifier } from "./utilities.misc";

export const getAuthToken = () => {
    let authToken = `${storageHelper.local.get(`${jwtTokenIdentifier}`) ?? ""}`;
    return authToken;
}

export const headers = {
    formData: { headers: { "bodyType": "form-data" } },

    json: { headers: { "Content-Type": "application/json", "Accept": "application/json", "api-key": `${APIKEY}` } },
    file: () => {
        let headers = new HttpHeaders({
          "bodyType": "form-data",
          "preventIntercept": "true",
          "api-key": `${APIKEY}`,
          "Authorization": `Bearer ${getAuthToken()}`
        });
        return { headers: headers };
    },
    bare: () => {
        let headers = new HttpHeaders({
            "Content-Type": "application/json",
            "Accept": "application/json",
            "api-key": `${APIKEY}`
        });
        return { headers: headers };
    },
    authenticated: () => {
        let headers = new HttpHeaders({
            "Content-Type": "application/json",
            "Accept": "application/json",
            "api-key": `${APIKEY}`,
            "Authorization": `Bearer ${getAuthToken()}`
        });
        return { headers: headers };
    }
}
