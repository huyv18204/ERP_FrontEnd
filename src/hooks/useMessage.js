import { message } from "antd";

export const useMessage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const Message = (type, content) => {
    messageApi.open({
      type,
      content,
    });
  };

  return { Message, contextHolder };
};
