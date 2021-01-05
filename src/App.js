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
  const code = getQueryVariable("code");

  const [visible, setVisible] = useState(false);
  const [grade, setGrade] = useState(localStorage.getItem("grade"));
  const [nickname, setNickname] = useState(
    localStorage.getItem("nickname") || ""
  );

  const [experiencedModules, setExperiencedModules] = useState(
    JSON.parse(localStorage.getItem("experiencedModules")) || []
  );

  useEffect(() => {
    if (!nickname) {
      getUseInfo(code).then((res) => {
        if (res.resultData) {
          setNickname(res.resultData.nickname);
          localStorage.setItem("nickname", res.resultData.nickname);
        }
      });
    }
  }, [code]);

  useEffect(() => {
    getSignature(encodeURIComponent(window.location.href.split("#")[0])).then(
      (res) => {
        if (res.resultStatus) {
          const { appId, timestamp, nonceStr, signature } = res.resultData;
          window.wx.config({
            //debug: true,
            appId: appId,
            timestamp: timestamp.toString(), // 必填，生成签名的时间戳
            nonceStr: nonceStr, // 必填，生成签名的随机串
            signature: signature, // 必填，签名
            jsApiList: ["scanQRCode"],
          });
        }
      }
    );
  }, []);

  const updateModules = (k) => {
    const _experiencedModules = JSON.stringify(
      unique([...experiencedModules, k])
    );
    localStorage.setItem("experiencedModules", _experiencedModules);
    setExperiencedModules(_experiencedModules);
  };

  useEffect(() => {
    const currentKey = getQueryVariable("moduleKey");
    if (currentKey) updateModules(currentKey);
  }, []);

  const handleOk = () => {
    let res = "";
    if (experiencedModules.length > 10) {
      res = "优秀";
    } else if (experiencedModules.length > 8) {
      res = "良好";
    } else if (experiencedModules.length > 6) {
      res = "及格";
    } else {
      res = "不及格";
    }
    setGrade(res);
    localStorage.setItem("grade", res);
    setVisible(false);
  };

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
              <QRCode size={200} value={`${nickname}#${grade}`} />
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
                        needResult: 1,
                        scanType: ["qrCode", "barCode"],
                        success: function (res) {
                          const resultStr = decodeURIComponent(res.resultStr);
                          alert(resultStr);
                          const k = getQueryVariable(
                            "moduleKey",
                            resultStr.split("?")[2]
                          );
                          alert(k);
                          updateModules(k);
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
