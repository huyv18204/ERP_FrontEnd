import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { closeModalProductProcess } from "../../../redux/actions/modalAction";
import React, { useEffect, useState } from "react";
import { Layout, theme, Table, Select } from "antd";
import { Form, Input } from "antd";
import { useMessage } from "../../../hooks/useMessage";
import * as processesService from "../../../services/processes";
import * as productProcessService from "../../../services/product_processes";
import BtnAddRow from "../../../components/Button/BtnAddRow";
import BtnSave from "../../../components/Button/BtnSave";
import BtnDelete from "../../../components/Button/BtnDelete";
const SizeColorModal = () => {
  const [productProcess, setProductProcess] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [originalProductProcess, setOriginalProductProcess] = useState([]);
  const [process, setProcess] = useState([]);
  const { Message, contextHolder } = useMessage();
  const { Content } = Layout;
  const [form] = Form.useForm();
  const { Option } = Select;
  const dispatch = useDispatch();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const isModalOpen = useSelector((state) => state.modal.isOpenProductProcess);
  const saleOrderItem = useSelector((state) => state.modal.saleOrder);

  const getProductProcess = async (saleOrderItemId) => {
    if (saleOrderItemId) {
      try {
        const response = await productProcessService.show(saleOrderItemId);
        if (response.data.data.length > 0) {
          setProductProcess(response.data.data);
          setOriginalProductProcess(
            JSON.parse(JSON.stringify(response.data.data))
          );
        } else {
          setProductProcess([]);
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
    dispatch(closeModalProductProcess());
    setProductProcess([]);
  };

  const handleOk = () => {
    handleCloseModal();
  };

  const handleSave = async () => {
    const dataSave = productProcess.filter((item) => item.id === undefined);
    const dataUpdate = productProcess.filter((item) => item.id !== undefined);

    if (dataSave.length > 0) {
      try {
        const response = await productProcessService.store({
          product_process: dataSave,
          sale_order_item_id: saleOrderItem[0].id,
        });
        Message(response.type, response.message);
      } catch (error) {
        Message("error", "Error saving new items: " + error.message);
      }
    }

    if (dataUpdate.length > 0) {
      const modifiedRecords = dataUpdate.filter((item) => {
        const originalItem = originalProductProcess.find(
          (original) => original.id === item.id
        );
        return (
          originalItem &&
          (originalItem.process_id !== item.process_id ||
            originalItem.std_workTime !== item.std_workTime ||
            originalItem.description !== item.description)
        );
      });

      if (modifiedRecords.length > 0) {
        try {
          await Promise.all(
            modifiedRecords.map((item) =>
              productProcessService.update(item.id, {
                process_id: item.process_id,
                std_workTime: item.std_workTime,
                description: item.description,
              })
            )
          );
          Message("success", "Items updated successfully");
        } catch (error) {
          Message("error", "Error updating items: " + error.message);
        }
      }
    }
    getProductProcess(saleOrderItem[0]?.id);
  };

  const handleInputTableChange = (e, key, column) => {
    const newProductProcess = [...productProcess];
    const index = newProductProcess.findIndex((item) => key === item.key);
    newProductProcess[index][column] = e.target.value;
    setProductProcess(newProductProcess);
  };

  const handleOptionTableChange = (value, key, column) => {
    const newProductProcess = [...productProcess];
    const index = newProductProcess.findIndex((item) => key === item.key);
    if (index !== -1) {
      newProductProcess[index][column] = value;
      setProductProcess(newProductProcess);
    }
  };

  const getProcesses = async () => {
    try {
      const response = await processesService.index(null);
      const data = response?.map((items, index) => ({
        ...items,
        key: index,
      }));

      setProcess(data);
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
      getProductProcess(saleOrderItem[0]?.id);
      getProcesses();
    } else {
      setProductProcess([]);
    }
  }, [saleOrderItem, isModalOpen]);

  const columns = [
    {
      title: "Process",
      dataIndex: "process_id",
      key: "process_id",
      width: "12%",
      render: (value, record) => (
        <Select
          name={`process_id[${record.key}]`}
          placeholder="Select a process"
          onChange={(newValue) =>
            handleOptionTableChange(newValue, record.key, "process_id")
          }
          allowClear
          value={record.process_id}
          style={{ width: "100%" }}
        >
          {process.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Std Work Time",
      dataIndex: "std_workTime",
      key: "std_workTime",
      width: "13%",
      render: (value, record) => (
        <Input
          name={`std_workTime[${record.id}]`}
          type="number"
          value={value}
          onChange={(e) =>
            handleInputTableChange(e, record.key, "std_workTime")
          }
        />
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
        await productProcessService.destroy(id);
        setProductProcess(productProcess.filter((item) => item.id !== id));
      } else {
        setProductProcess(productProcess.filter((item) => item.key !== key));
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
    const newKey = productProcess.length + 1;
    const newRow = {
      key: newKey,
      process_id: null,
      std_workTime: null,
      description: "",
    };
    setProductProcess([...productProcess, newRow]);
  };

  return (
    <>
      <Modal
        title="Routing"
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
            size="small"
            pagination={{
              current: currentPage,
              pageSize: 5,
              total: productProcess.length,
              onChange: (page) => {
                setCurrentPage(page);
              },
            }}
            columns={columns}
            dataSource={productProcess}
          />
        </Content>

        {contextHolder}
      </Modal>
    </>
  );
};

export default SizeColorModal;
