export const storageHelper = {
  session: {
    store: (key: string, value: any) => {
      let jsonString = JSON.stringify(value);
      sessionStorage.setItem(key, jsonString);
      return 1;
    },
    get: (key: string) => {
      let value = JSON.parse(sessionStorage.getItem(key)!);
      return value ?? null;
    },
    remove: (key: string) => {
      sessionStorage.removeItem(key);
      return 1;
    },
    clear: () => {
      sessionStorage.clear();
      return 1;
    }
  },

  local: {
    store: (key: string, value: any) => {
      let jsonString = JSON.stringify(value);
      localStorage.setItem(key, jsonString);
      return 1;
    },
    get: (key: string) => {
      const element = localStorage.getItem(key);
      if (!element || element == undefined || element == "undefined") return null;
      let value = JSON.parse(element!)
      return value ?? null;
    },
    remove: (key: string) => {
      localStorage.removeItem(key);
      return 1;
    },
    clear: () => {
      localStorage.clear();
      return 1;
    }
  }
}
