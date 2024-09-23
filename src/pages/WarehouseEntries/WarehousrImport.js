import React, { useEffect, useState, useCallback } from "react";
import { Layout, theme, Table } from "antd";
import { useColumnSearch } from "../../hooks/useColumnSearch";
import { Form, Select } from "antd";
import * as stocksService from "../../services/stocks";
import * as warehousesService from "../../services/warehouses";
import { useMessage } from "../../hooks/useMessage";
import BtnImport from "../../components/Button/BtnImport";
import BtnJump from "../../components/Button/BtnJump";
import { useDispatch, useSelector } from "react-redux";
import { clearWHImport } from "../../redux/actions/warehouseAction";

const WarehouseImport = () => {
  const initialWHState = {
    warehouse_id: "",
  };

  const [WHEntry, setWHEntry] = useState(initialWHState);
  const [currentPage, setCurrentPage] = useState(1);
  const [warehouses, setSuppliers] = useState([]);
  const { Message, contextHolder } = useMessage();
  const { getColumnSearch } = useColumnSearch();
  const { Content } = Layout;
  const { Option } = Select;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [warehouseImport, setWarehouseImport] = useState(
    useSelector((state) => state.warehouse.warehouseImport)
  );
  const supplier_id = useSelector((state) => state.warehouse.supplier_id);

  const columns = [
    {
      title: "Material code",
      dataIndex: "material_code",
      key: "material_code",
      width: "25%",
      ...getColumnSearch("material_code"),
    },

    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "25%",
      ...getColumnSearch("name"),
    },
    {
      title: "Unit Price",
      dataIndex: "unit_price",
      key: "unit_price",
      width: "25%",
      ...getColumnSearch("unit_price"),
    },

    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: "25%",
      ...getColumnSearch("quantity"),
    },
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleOptionFormChange = (value) => {
    setWHEntry((prev) => ({
      ...prev,
      warehouse_id: value,
    }));
  };

  const handleSave = useCallback(async () => {
    try {
      if (
        WHEntry &&
        WHEntry.warehouse_id &&
        warehouseImport &&
        warehouseImport[0].material_code &&
        warehouseImport[0].quantity &&
        warehouseImport[0].unit_price
      ) {
        const response = await stocksService.store({
          ...WHEntry,
          warehouseEntryDetail: warehouseImport,
          supplier_id: supplier_id,
        });
        setWHEntry(initialWHState);
        setWarehouseImport([]);
        dispatch(clearWHImport());
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
  }, [WHEntry]);

  const handleJump = () => {
    dispatch(clearWHImport());
  };

  const getWarehousrs = async () => {
    const data = await warehousesService.index();
    setSuppliers(data);
  };

  useEffect(() => {
    getWarehousrs();
  }, []);

  useEffect(() => {
    form.setFieldsValue(WHEntry);
  }, [WHEntry, form]);
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
        <BtnImport className="ms-2" event={handleSave} />
        <BtnJump
          onClick={handleJump}
          className="ms-2"
          title="Warehouse Entry List"
          to="/erp-system/warehouse-entries"
        />
      </Content>

      <Content
        style={{
          margin: "10px 16px",
          padding: 24,
          paddingTop: 15,
          paddingBottom: 15,
          minHeight: 100,
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
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please input supplier",
              },
            ]}
            name="warehouse_id"
            label="Warehouse"
            className="py-2"
          >
            <Select
              style={{ width: 180 }}
              name="warehouse_id"
              placeholder="Select a Warehouse"
              onChange={handleOptionFormChange}
              allowClear
            >
              {warehouses.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
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
            total: warehouseImport.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          columns={columns}
          dataSource={warehouseImport}
        />
      </Content>

      {contextHolder}
    </div>
  );
};

export default WarehouseImport;
