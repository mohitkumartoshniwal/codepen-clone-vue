export enum LANGUAGES {
  HTML = "html",
  CSS = "css",
  JS = "javascript",
  shortJs = "JS",
}

export enum STORAGE_NAMES {
  CODE = "code",
}

export type PAYLOAD = {
  code: string;
  type: LANGUAGES;
};
