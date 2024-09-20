import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { closeModalProductNG } from "../../../redux/actions/modalAction";
import React, { useEffect, useState } from "react";
import { Layout, theme, Table, Select } from "antd";
import { Form, Input } from "antd";
import { useMessage } from "../../../hooks/useMessage";
import * as NGService from "../../../services/ngs";
import * as productNGService from "../../../services/product_ngs";
import BtnAddRow from "../../../components/Button/BtnAddRow";
import BtnSave from "../../../components/Button/BtnSave";
import BtnDelete from "../../../components/Button/BtnDelete";
const NGModal = () => {
  const [productNG, setProductNG] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [NG, setNG] = useState([]);
  const { Message, contextHolder } = useMessage();
  const { Content } = Layout;
  const [form] = Form.useForm();
  const { Option } = Select;
  const dispatch = useDispatch();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const isModalOpen = useSelector((state) => state.modal.isOpenProductNg);
  const saleOrderItem = useSelector((state) => state.modal.saleOrder);

  const getProductNG = async (saleOrderItemId) => {
    if (saleOrderItemId) {
      try {
        const response = await productNGService.show(saleOrderItemId);
        if (response.data.data.length > 0) {
          setProductNG(response.data.data);
        } else {
          setProductNG([]);
        }
      } catch (error) {
        Message("error", "Error fetching product items: " + error.message);
      }
    }
  };

  useEffect(() => {
    if (saleOrderItem && saleOrderItem.length > 0) {
      const updatedSaleOrder = {
        code: saleOrderItem[0]?.code,
        product: saleOrderItem[0]?.product,
      };
      form.setFieldsValue(updatedSaleOrder);
    }
  }, [saleOrderItem, form]);

  const handleCloseModal = () => {
    dispatch(closeModalProductNG());
    setProductNG([]);
  };

  const handleOk = () => {
    handleCloseModal();
  };

  const handleSave = async () => {
    const dataSave = productNG.filter((item) => item.id === undefined);
    const dataUpdate = productNG.filter((item) => item.id !== undefined);

    if (dataSave.length > 0 && dataSave[0].ng_type_id) {
      try {
        const response = await productNGService.store({
          product_ng: dataSave,
          sale_order_item_id: saleOrderItem[0].id,
        });
        getProductNG();
        Message(response.type, response.message);
      } catch (error) {
        Message("error", "Error saving new items: " + error.message);
      }
    }

    if (dataUpdate.length > 0) {
      const hasInvalidItemsUpdate = dataUpdate.some((item) => !item.ng_type_id);

      if (hasInvalidItemsUpdate) {
        Message("error", "Please fill in required fields for existing items");
        return;
      }

      try {
        await Promise.all(
          dataUpdate.map((item) =>
            productNGService.update(item.id, {
              ng_type_id: item.ng_type_id,
              description: item.description,
            })
          )
        );
        Message("success", "Items updated successfully");
      } catch (error) {
        Message("error", "Error updating items: " + error.message);
      }
    }
  };

  const handleInputTableChange = (e, key, column) => {
    const newProductProcess = [...productNG];
    const index = newProductProcess.findIndex((item) => key === item.key);
    newProductProcess[index][column] = e.target.value;
    setProductNG(newProductProcess);
  };

  const handleOptionTableChange = (value, key, column) => {
    const newProductProcess = [...productNG];
    const index = newProductProcess.findIndex((item) => key === item.key);
    if (index !== -1) {
      newProductProcess[index][column] = value;
      setProductNG(newProductProcess);
    }
  };

  const getNGs = async () => {
    try {
      const response = await NGService.index(null);
      const data = response?.map((items, index) => ({
        ...items,
        key: index,
      }));

      setNG(data);
    } catch (error) {
      Message(
        "error",
        "Error fetching sizes: " +
          (error.response ? error.response.data : error.message)
      );
    }
  };

  useEffect(() => {
    if (isModalOpen && saleOrderItem && saleOrderItem.length > 0) {
      getProductNG(saleOrderItem[0]?.id);
      getNGs();
    } else {
      setProductNG([]);
    }
  }, [saleOrderItem, isModalOpen]);

  const columns = [
    {
      title: "NG Type",
      dataIndex: "ng_type_id",
      key: "ng_type_id",
      width: "12%",
      render: (value, record) => (
        <Select
          name={`ng_type_id[${record.key}]`}
          placeholder="Select a NG"
          onChange={(newValue) =>
            handleOptionTableChange(newValue, record.key, "ng_type_id")
          }
          allowClear
          value={record.ng_type_id}
          style={{ width: "100%" }}
        >
          {NG.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "13%",
      render: (value, record) => (
        <Input
          name={`description[${record.id}]`}
          type="text"
          value={value}
          onChange={(e) => handleInputTableChange(e, record.key, "description")}
        />
      ),
    },
    {
      title: "Action",
      key: "operation",
      width: "7%",
      className: "text-center",
      render: (_, record) => (
        <BtnDelete event={() => handleDelete(record.id, record.key)} />
      ),
    },
  ];

  const handleDelete = async (id, key) => {
    try {
      if (id) {
        await productNGService.destroy(id);
        setProductNG(productNG.filter((item) => item.id !== id));
      } else {
        setProductNG(productNG.filter((item) => item.key !== key));
      }
      Message("success", "Delete success");
    } catch (error) {
      Message(
        "error",
        "Error deleting data: " +
          (error.response ? error.response.data : error.message)
      );
    }
  };

  const handleAddRow = async () => {
    const newKey = productNG.length + 1;
    const newRow = {
      key: newKey,
      ng_type_id: null,
      description: "",
    };
    setProductNG([...productNG, newRow]);
  };

  return (
    <>
      <Modal
        title="NG Type"
        open={isModalOpen}
        onOk={handleOk}
        width={1000}
        onCancel={handleCloseModal}
      >
        <Content
          style={{
            margin: "10px 16px",
            paddingTop: 10,
            minHeight: 10,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <BtnAddRow className="ms-2" event={handleAddRow} />
          <BtnSave className="ms-2" event={handleSave} />
        </Content>

        <Content
          style={{
            margin: "10px 16px",
            padding: 15,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Form
            layout="inline"
            form={form}
            style={{
              maxWidth: "none",
            }}
          >
            <Form.Item name="code" label="No." className="py-2">
              <Input name="code" type="text" readOnly />
            </Form.Item>
          </Form>
        </Content>

        <Content
          style={{
            margin: "18px 16px",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Table
            pagination={{
              current: currentPage,
              pageSize: 3,
              total: productNG.length,
              onChange: (page) => {
                setCurrentPage(page);
              },
            }}
            columns={columns}
            dataSource={productNG}
          />
        </Content>

        {contextHolder}
      </Modal>
    </>
  );
};

export default NGModal;
