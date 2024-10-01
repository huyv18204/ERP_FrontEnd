import React, { useEffect, useState, useCallback } from "react";
import { Layout, theme, Table } from "antd";
import { useColumnSearch } from "../../hooks/useColumnSearch";
import { Form, Input, Select } from "antd";
import * as PDOrdersService from "../../services/production_orders";
import * as linesService from "../../services/lines";
import * as factoriesService from "../../services/factories";
import * as productsService from "../../services/products";
import { useMessage } from "../../hooks/useMessage";
import BtnSave from "../../components/Button/BtnSave";
import BtnDelete from "../../components/Button/BtnDelete";
import BtnAddRow from "../../components/Button/BtnAddRow";
import { useSelector } from "react-redux";

const ProductionOrderRegister = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const [original, setOriginal] = useState([]);
  const [PDOrders, setPDOrders] = useState([]);
  const [lines, setLines] = useState([]);
  const [factories, setFactories] = useState([]);
  const [product, setProduct] = useState([]);
  const { Message, contextHolder } = useMessage();
  const { getColumnSearch } = useColumnSearch();
  const { Content } = Layout;
  const { Option } = Select;

  const res = useSelector((item) => item.productionOrder.saleOrderItems);

  useEffect(() => {
    if (res) {
      const data = res.map((item) => ({
        sale_order_id: item.sale_order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        key: item.id,
        start_date: "",
        end_date: "",
        description: "",
        factory_id: null,
        line_id: null,
      }));
      setPDOrders(data);
      setIsSaved(true);
    }
  }, [res]);

  const handleInputTableChange = (e, key, column) => {
    const newValue = [...PDOrders];
    const index = newValue.findIndex((item) => key === item.key);
    newValue[index][column] = e.target.value;
    setPDOrders(newValue);
  };

  const handleOptionTableChange = (value, key, column) => {
    const newValue = [...PDOrders];
    const index = newValue.findIndex((item) => key === item.key);
    if (index !== -1) {
      newValue[index][column] = value;
      setPDOrders(newValue);
    }
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "product_id",
      key: "product_id",
      width: "16%",

      ...getColumnSearch("product_id"),
      render: (value, record) => (
        <Select
          disabled={true}
          name={`product_id[${record.key}]`}
          placeholder="Select a product"
          onChange={(newValue) =>
            handleOptionTableChange(newValue, record.key, "product_id")
          }
          allowClear
          value={record.product_id}
          style={{ width: 150 }}
        >
          {product.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      ),
    },

    {
      title: "Line",
      dataIndex: "line_id",
      key: "line_id",
      width: "16%",
      ...getColumnSearch("line_id"),
      render: (value, record) => (
        <Select
          name={`line_id[${record.key}]`}
          placeholder="Select a line"
          onChange={(newValue) =>
            handleOptionTableChange(newValue, record.key, "line_id")
          }
          allowClear
          value={record.line_id}
          style={{ width: 150 }}
        >
          {lines.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      ),
    },

    {
      title: "Factory",
      dataIndex: "factory_id",
      key: "factory_id",
      width: "16%",
      ...getColumnSearch("factory_id"),
      render: (value, record) => (
        <Select
          name={`factory_id[${record.key}]`}
          placeholder="Select a line"
          onChange={(newValue) =>
            handleOptionTableChange(newValue, record.key, "factory_id")
          }
          allowClear
          value={record.factory_id}
          style={{ width: 150 }}
        >
          {factories.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      ),
    },

    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      width: "15%",
      ...getColumnSearch("start_date"),
      render: (value, record) => (
        <Input
          name={`start_date[${record.key}]`}
          type="date"
          value={value}
          onChange={(e) => handleInputTableChange(e, record.key, "start_date")}
        />
      ),
    },

    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      width: "15%",
      ...getColumnSearch("end_date"),
      render: (value, record) => (
        <Input
          name={`end_date[${record.key}]`}
          type="date"
          value={value}
          onChange={(e) => handleInputTableChange(e, record.key, "end_date")}
        />
      ),
    },

    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ...getColumnSearch("description"),
      render: (value, record) => (
        <Input
          name={`description[${record.key}]`}
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
      fixed: "right",
      render: (_, record) => (
        <BtnDelete event={() => handleDelete(record.id, record.key)} />
      ),
    },
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleSave = useCallback(async () => {
    const dataSave = PDOrders.filter((item) => item.id === undefined);
    const dataUpdate = PDOrders.filter((item) => item.id !== undefined);
    if (dataSave.length > 0) {
      try {
        if (dataSave) {
          const response = await PDOrdersService.store({
            PDOrders: [...dataSave],
          });
          setPDOrders(response.data);
          setIsSaved(true);
          setOriginal(JSON.parse(JSON.stringify([...response.data])));
          Message(response.type, response.message);
        } else {
          Message("error", "Please fill in required fields");
        }
      } catch (error) {
        Message(
          "error",
          "Error saving data: " +
            (error.response ? error.response.data : error.message)
        );
      }
    }

    if (dataUpdate.length > 0) {
      const modifiedRecords = dataUpdate.filter((item) => {
        const originalItem = original.find(
          (original) => original.id === item.id
        );
        return (
          originalItem &&
          (originalItem.line_id !== item.line_id ||
            originalItem.description !== item.description ||
            originalItem.factory_id !== item.factory_id ||
            originalItem.start_date !== item.start_date ||
            originalItem.end_date !== item.end_date)
        );
      });

      if (modifiedRecords.length > 0) {
        try {
          await Promise.all(
            modifiedRecords.map(async (item) => {
              const response = await PDOrdersService.update(item.id, {
                line_id: item.line_id,
                description: item.description,
                factory_id: item.factory_id,
                start_date: item.start_date,
                end_date: item.end_date,
              });
              const newValue = [...PDOrders];
              const index = newValue.findIndex((items) => items.id === item.id);
              newValue[index] = { ...response.data, key: response.data.id };
              setPDOrders(newValue);
              setOriginal(JSON.parse(JSON.stringify([...newValue])));
              return response;
            })
          );

          Message("success", "Items updated successfully");
        } catch (error) {
          Message("error", "Error updating items: " + error.message);
        }
      }
    }
  }, [PDOrders]);

  const handleDelete = async (id, key) => {
    if (id) {
      const response = await PDOrdersService.destroy(id);
      const updatedPDOrders = PDOrders.filter((item) => item.key !== key);
      setPDOrders(updatedPDOrders);
      Message(response.type, response.message);
    } else {
      const updatedPDOrders = PDOrders.filter((item) => item.key !== key);
      setPDOrders(updatedPDOrders);
      Message("success", "Delete row successfully");
    }
  };

  const getLines = async () => {
    const data = await linesService.index();
    setLines(data);
  };

  const getFactories = async () => {
    const data = await factoriesService.index();
    setFactories(data);
  };

  const getProduct = async () => {
    const data = await productsService.index();
    setProduct(data);
  };

  const handleAddRow = async () => {
    const newKey = PDOrders.length + 1;
    const newRow = {
      key: newKey,
      product_id: null,
      line_id: null,
      factory_id: null,
      quantity: null,
      start_date: "",
      end_date: "",
      description: "",
    };

    setPDOrders([...PDOrders, newRow]);
  };
  useEffect(() => {
    getFactories();
    getLines();
    getProduct();
  }, []);

  return (
    <div>
      <Content
        style={{
          margin: "10px 16px",
          padding: 10,
          paddingLeft: 24,
          minHeight: 10,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <BtnSave event={handleSave} />
        {!isSaved && <BtnAddRow className="ms-2" event={handleAddRow} />}
      </Content>

      <Content
        style={{
          margin: "18px 16px",
          padding: 24,
          paddingTop: 20,
          paddingBottom: 20,
          // minHeight: 510,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Table
          size="small"
          pagination={{
            current: currentPage,
            pageSize: 7,
            total: PDOrders.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          columns={columns}
          dataSource={PDOrders}
        />
      </Content>

      {contextHolder}
    </div>
  );
};

export default ProductionOrderRegister;
