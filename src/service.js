import request from "umi-request";

export const getUseInfo = (code) => {
  return request.get(`https://test.sxjycszs.com/v1/front/wx/user?code=${code}`);
};

export const getSignature = (url) => {
  return request.get(`https://test.sxjycszs.com/v1/front/wx/config?url=${url}`);
};
