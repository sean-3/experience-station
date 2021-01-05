import request from "umi-request";

export const getUseInfo = (code) => {
  return request.get(
    `http://101.200.207.61:9988/v1/front/wx/user?code=${code}`
  );
};

export const getSignature = (url) => {
  return request.get(
    `http://101.200.207.61:9988/v1/front/wx/config?url=${url}`
  );
};
