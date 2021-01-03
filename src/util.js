export const getQueryVariable = (variable) => {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return false;
};

export const unique = (arr) => {
  return Array.from(new Set(arr));
};

export const moduleList = [
  { key: "01", title: "电信诈骗电话" },
  { key: "02", title: "社交软件诈骗" },
  { key: "03", title: "诈骗手段解析" },
  { key: "04", title: "个人信息保护" },
  { key: "05", title: "反诈骗知识问答" },
  { key: "06", title: "AR交警互动" },
  { key: "07", title: "毒品百科" },
  { key: "08", title: "防盗知识普及" },
  { key: "09", title: "辖区警情分析" },
  { key: "10", title: "打架斗殴与寻衅滋事的危害" },
  { key: "11", title: "VR反诈骗" },
  { key: "12", title: "禁毒光栅画" },
];
