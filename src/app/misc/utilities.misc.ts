import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

export enum UserRoleName {
  USER = 'USER',
  ADMIN='ADMIN',
  DIRECTOR='DIRECTEUR',
  AGENT='AGENT',
  CLINET='CLIENT',
}

export enum StatutUserCompte {
  actif='ACTIF',
  inactif='INACTIF',
}


export enum TransactionType {
  INPUT='ENTREE',
  OUTPUT='SORTIE',
}

export enum RequestStatus {
  INPUT='DEMANDE',
  OUTPUT='SORTIE',
}

export enum PaiementMode {
  ESPECE='ESPECE',
  OUTPUT='SORTIE',
}

export enum TransactionStatus {
  SUCCES='SUCCES',
  PAIDING='PAIDING',
  ERROR='ERROR',
  CANCEL='CANCEL',
}

export enum TransactionType {
  RECHARGEMENT='RECHARGEMENT',
}

export enum TransactionMethod {
  CREDIT='CREDIT',
}

export const userMenus: { name: string, route: string, icon: string, show?: boolean }[] = [
  { name: "Tableau de bord", route: "/dashboard", icon: "bx bx-home-alt", show: true },
  { name: "Réabonnement", route: "/dashboard/", icon: "rotate-ccw", show: true },
  { name: "Liste Entrées", route: "/dashboard/parking-types", icon: "arrow-right-circle", show: true },
  { name: "Liste Sorties", route: "/dashboard/parking-types", icon: "arrow-left-circle", show: true },
  { name: "Abonnés", route: "/dashboard/subscribers", icon: "user-check", show: true },
  { name: "Utilisateurs Système", route: "/dashboard/system-users", icon: "users", show: true }
]

export const SSID = "104773056590-mvedvfdqopcc07h14llstuhp6pt070e6.apps.googleusercontent.com";
export const APIKEY = "2272b613-efd0-41ba-85a5-4f13821c4b9d";
export const jwtTokenIdentifier = "tgms-YDUWCw_LMus8UcgSjIlqfUZqmSZBxBbYwaZAOXQGwQHey9gAg7Mx5_xB35rdn2C5ae9tM6YdUwiAocGaQF9d6ALfGRwii7DdJgwrRhYpcFb1n28_9plkUfEIviWG6ZdFJJbx9WtyMU6pHse115UNuk6wWuiRtFgLAFJ_eu9Zimc0FWdgHggs8lqpqZlrgAAH2fmoWskq_FQp_g2VZFIxB3PaDZo6CqfCxjwyUJOiMP7FpaTsiTuPudgprTCCbIclGMWfGVJDXeWAnZj1DU1HgraLypvZJfJIinLIvERWgrT0Y8cYfqb3Zg7uO3eDmKApCtUfrl6nBdJenAQ7xLTP"
export const userIdentifier = "tgms-7WZEZG88a7S0Dbc3U0vy3ZcyscqdyxmRpv25vKw1tykdemtIpt1635i3MLBerB5TiDHHI-mJ6WePYuRiKeLMI2F4E4iG2wsqIpa6rvrgAz4qWuxlv8_myV97dvv3RYgFyK-uTDrKjowYvSGTmZ576TheM22TdvuXCuRo5dOcPCZcuZ9AwXUjRaRdt7PcXeBbfds"
export const otpTokenIdentifier = "tgms-z3mMTKcTdoVBcMbfz32xkmDIqVOBUyjW8pKu6Bl9evSBR8X3XmSvDyQkLfea1UgUEHRMAEqa1u8ob5pCWzM4hV1o2atgaTphtT8MHWSAg7MxcAUJIkEmevcfcAMk8OoEXRVdPt988mZRKaM3ucaIrqbHThSh09zKCwT579sk8KM3tWwShORJZGT0XrQqHirveamWgKSuw4rfocIW4QoqttVywqMBW2uRxv7mUHx1HWrGopjzD5O1MXApLF4Z73Fi"
export const authTokenIdentifier = "tgms-9uz1o1aWbYHFXpOTK3VZ2mKwcO62JV3Fr8D1v4MTzQxBvulvDu9lW9IZC63qUL67r4lhfKx5Ag7Mxgdroxl9E8WG9MlJzp1cwYB3dkVlpEY5pGWH9EiLY2Upxul98syoyEK7U3kXiGhBswF2DoDEoYyY9lS9PcWalbvDuP6SHJTCwGxSdIFxhib5GVlMhaMKJlKdcb1IlKzYKkjz4ozm98tEyHHEbv590QZZpgdQbOIz56dIFptxRAyQuV7fuOzv"
export const resetPasswordTokenIdentifier = "tgms-rSyeh5RwFAjPaDXGHLaPx7RGXIkLop3yEfmITCtMUU58Ag7MxbX2jwCIuvVK9zZxmq4A5fFxLfywwzU9xulDFxdGRZC8T2frVUpG5IfUbHwcOVvtFDTHw9O5tSZCDwbf"
export const resetPasswordUserIdentifier = "tgms-XkuMdMgXAuETPUZS5lQDu5PZaIwwpVx7JSZBSYvX36UPMVy0RsaAvvEDbXFftbvHMdWgszYogbyFby0Bb6U6MAg7Mx01Rm0y0r5Dz54WAervRJtYcOSXMleJxj8fuHQC"
export const locale = "tgms-zFk3JLwQj6MdFMbOw48XlojG1YvLmohRR2zAYgJTTO87PCg3tgQuJv7Khh2srJ0ZAg7MxtgqMDpl8IqhTEmuXeE4c4j5xkewCvMRjRuI4P5Y1jRe86PK5IdqCeX5RmQT"


export const swalAnimation: any = {
  showClass: {
    popup: 'animate__animated animate__fadeInDown'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutUp'
  }
}

export function formatDate(date: Date | string, dateFormat: string): string {
  const now = new Date();
  const diffInMinutes = (now.getTime() - new Date(date).getTime()) / (1000 * 60);
  const locale = dateFormat === 'fr' ? fr : enUS;

  if (diffInMinutes < 1) {
    return dateFormat === 'fr' ? 'à l\'instant' : 'just now';
  } else if (diffInMinutes < 15) {
    return dateFormat === 'fr' ? `${Math.floor(diffInMinutes)} min` : `${Math.floor(diffInMinutes)} min`;
  } else {
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale });
  }
}

export function formatDateList(date: Date | string, dateFormat: string): string {
  const now = new Date();
  const diffInMinutes = (now.getTime() - new Date(date).getTime()) / (1000 * 60);
  const locale = dateFormat === 'fr' ? fr : enUS;

  if (diffInMinutes < 60) {
    return format(new Date(date), 'HH:mm', { locale });
  } else if (diffInMinutes < 48 * 60) {
    return dateFormat === 'fr' ? 'hier' : 'yesterday';
  } else {
    return format(new Date(date), 'dd/MM/yyyy', { locale });
  }
}





