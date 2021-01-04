import React from "react";
import { Button, Modal } from "antd-mobile";
import "./App.css";

export default ({ visible, handleClose, handleOk }) => {
  return (
    <Modal
      className="c-modal"
      visible={visible}
      transparent
      maskClosable={false}
      onClose={handleClose}
      title="东莞厚街平安便民服务站"
      afterClose={() => {}}
    >
      <div className="modal-content">
        <div className="confirm-text">确定生成体验报告？</div>
        <div className="actions">
          <Button onClick={() => handleOk()}>确定</Button>
          <Button onClick={() => handleClose()}>取消</Button>
        </div>
      </div>
    </Modal>
  );
};
