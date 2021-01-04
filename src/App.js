import React, { useState, useEffect } from "react";
import { Button } from "antd-mobile";
import QRCode from "qrcode.react";
import ConfirmModal from "./ConfirmModal";
import starIcon from "./assets/star.png";
import nostarIcon from "./assets/nostar.png";
import logo from "./assets/logo.png";
import { moduleList, getQueryVariable, unique } from "./util";
import { getUseInfo, getSignature } from "./service";
import "./App.css";

function App() {
  const [visible, setVisible] = useState(false);
  const [grade, setGrade] = useState(localStorage.getItem("grade"));
  const [nickname, setNickname] = useState("");
  const currentKey = getQueryVariable("moduleKey");
  const code = getQueryVariable("code");

  useEffect(() => {
    getUseInfo(code).then((res) => {
      if (res.resultData) {
        setNickname(res.resultData.nickname);
      }
    });
  }, [code]);

  useEffect(() => {
    getSignature(
      "https%3a%2f%2fcoding-pages-bucket-3413143-8194751-9772-444098-1301636502.cos-website.ap-guangzhou.myqcloud.com"
    ).then((res) => {
      if (res.resultStatus) {
        window.wx.config({
          debug: true,
          ...res.resultData,
          jsApiList: ["scanQRCode"],
        });
      }
    });
  }, []);

  let experiencedModules =
    JSON.parse(localStorage.getItem("experiencedModules")) || [];

  experiencedModules.push(currentKey);

  const _experiencedModules = JSON.stringify(unique(experiencedModules));

  localStorage.setItem("experiencedModules", _experiencedModules);

  const handleOk = () => {
    let res = "";
    if (_experiencedModules.length > 10) {
      res = "优秀";
    } else if (_experiencedModules.length > 8) {
      res = "良好";
    } else if (_experiencedModules.length > 6) {
      res = "及格";
    } else {
      res = "不及格";
    }
    setGrade(res);
    localStorage.setItem("grade", res);
    setVisible(false);
  };

  const experiencedModuleNames = moduleList
    .filter((i) => experiencedModules.includes(i.key))
    .map((n) => n.title);

  return (
    <div className="App">
      <div className="App-footer">东莞城市服务驿站</div>

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="App-title">
          东莞市公安局
          <br />
          厚街分局
        </div>
        <div className="App-slogan">
          体育路警务工作站 <br />
          欢迎您，{nickname}
        </div>
        <div className="App-tip">注：点亮展项卡片，积分拿礼品</div>
      </header>

      <div className="content">
        {grade ? (
          <div className="qrcode-container">
            <div className="qrcode-tip">
              完整的体验报告已生成 <br />
              请至前台扫描二维码获取
            </div>
            <div className="qrcode-image">
              <QRCode
                size={200}
                value={`${nickname}#${experiencedModuleNames.join(
                  "#"
                )}#${grade}`}
              />
            </div>
          </div>
        ) : (
          <div>
            {moduleList.map((item) => {
              return (
                <div
                  className="module"
                  key={item.key}
                  onClick={() => {
                    if (!experiencedModules.includes(item.key)) {
                      window.wx.scanQRCode({
                        needResult: 0,
                        scanType: ["qrCode", "barCode"],
                        success: function (res) {
                          console.log(res.resultStr);
                        },
                      });
                    }
                  }}
                >
                  <div className="module-title">
                    <span>{item.title}</span>
                  </div>
                  <div className="opration">
                    <img
                      src={
                        experiencedModules.includes(item.key)
                          ? starIcon
                          : nostarIcon
                      }
                      className="status-icon"
                      alt="icon"
                    />
                    <Button
                      className={`status-btn ${
                        experiencedModules.includes(item.key) ? "active" : ""
                      }`}
                      size="small"
                    >
                      {experiencedModules.includes(item.key)
                        ? " 已点亮"
                        : "扫一扫点亮"}
                    </Button>
                  </div>
                </div>
              );
            })}
            <Button
              className="submit-btn"
              onClick={() => {
                setVisible(true);
              }}
            >
              结束展馆体验
            </Button>
          </div>
        )}
      </div>

      <ConfirmModal
        visible={visible}
        handleClose={() => {
          setVisible(false);
        }}
        handleOk={handleOk}
      />
    </div>
  );
}

export default App;

// https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6ac3baea53cef467&redirect_uri=https%3a%2f%2fcoding-pages-bucket-3413143-8194751-9772-444098-1301636502.cos-website.ap-guangzhou.myqcloud.com%3fmoduleKey%3d02&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect
