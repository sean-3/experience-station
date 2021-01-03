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
      footer={[
        {
          text: <Button>确定</Button>,
          onPress: () => {
            handleOk();
          },
        },
        {
          text: <Button>取消</Button>,
          onPress: () => {
            handleClose();
          },
        },
      ]}
      afterClose={() => {}}
    >
      <div className="modal-content">确定生成体验报告？</div>
    </Modal>
  );
};
