import {  type UploadFile } from "antd";


export const normalizeFile = (e: UploadFile[] | { fileList: UploadFile[] } | undefined): UploadFile[] | undefined => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
