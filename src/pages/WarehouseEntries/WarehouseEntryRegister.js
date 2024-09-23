import React, { useEffect, useState, useCallback } from "react";
import { Layout, theme, Table } from "antd";
import { useColumnSearch } from "../../hooks/useColumnSearch";
import { Form, Input, Select } from "antd";
import * as WHEntryService from "../../services/warehouse_entries";
import * as WHEntryDetailService from "../../services/warehouse_entry_details";
import * as suppliersService from "../../services/suppliers";
import { useMessage } from "../../hooks/useMessage";
import BtnNew from "../../components/Button/BtnNew";
import BtnSave from "../../components/Button/BtnSave";
import BtnDelete from "../../components/Button/BtnDelete";
import BtnAddRow from "../../components/Button/BtnAddRow";
import BtnJump from "../../components/Button/BtnJump";
import { useDispatch, useSelector } from "react-redux";
import {
  clearWHCreate,
  jumpWHImport,
} from "../../redux/actions/warehouseAction";

const WarehouseEntryRegister = () => {
  const initialWHEntryState = {
    supplier_id: "",
  };

  const [WHEntry, setWHEntry] = useState(initialWHEntryState);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const [original, setOriginal] = useState([]);
  const [WHEntryDetail, setWHEntryDetail] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const { Message, contextHolder } = useMessage();
  const { getColumnSearch } = useColumnSearch();
  const dispatch = useDispatch();
  const { Content } = Layout;
  const { Option } = Select;
  const [form] = Form.useForm();

  const warehouseEntry = useSelector((state) => state.warehouse.warehouseEntry);
  const warehouseEntryDetials = useSelector(
    (state) => state.warehouse.warehouseEntryDetials
  );
  const handleInputTableChange = (e, key, column) => {
    const newValues = [...WHEntryDetail];
    const index = newValues.findIndex((item) => key === item.id);
    newValues[index][column] = e.target.value;
    setWHEntryDetail(newValues);
  };

  const getWHEntryDetails = async (WHEntryId) => {
    if (WHEntryId) {
      try {
        const response = await WHEntryDetailService.show(WHEntryId);
        if (response.data.data.length > 0) {
          setWHEntryDetail(response.data.data);
          setOriginal(JSON.parse(JSON.stringify(response.data.data)));
        } else {
          setWHEntryDetail([]);
        }
      } catch (error) {
        Message("error", "Error fetching product items: " + error.message);
      }
    }
  };

  const columns = [
    {
      title: "Material code",
      dataIndex: "material_code",
      key: "material_code",
      width: "20%",
      ...getColumnSearch("material_code"),
      render: (value, record) => (
        <Input
          name={`material_code[${record.key}]`}
          value={value}
          onChange={(e) =>
            handleInputTableChange(e, record.id, "material_code")
          }
        />
      ),
    },

    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "20%",
      ...getColumnSearch("name"),
      render: (value, record) => (
        <Input
          name={`name[${record.key}]`}
          value={value}
          onChange={(e) => handleInputTableChange(e, record.id, "name")}
        />
      ),
    },

    {
      title: "Unit Price",
      dataIndex: "unit_price",
      key: "unit_price",
      width: "20%",
      ...getColumnSearch("unit_price"),
      render: (value, record) => (
        <Input
          name={`unit_price[${record.key}]`}
          type="number"
          value={value}
          onChange={(e) => handleInputTableChange(e, record.id, "unit_price")}
        />
      ),
    },

    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: "20%",
      ...getColumnSearch("quantity"),
      render: (value, record) => (
        <Input
          name={`quantity[${record.key}]`}
          type="number"
          value={value}
          onChange={(e) => handleInputTableChange(e, record.id, "quantity")}
        />
      ),
    },

    {
      title: "Action",
      key: "operation",
      width: "20%",
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

  const handleOptionFormChange = (value) => {
    setWHEntry((prev) => ({
      ...prev,
      supplier_id: value,
    }));
  };

  const handleSave = useCallback(async () => {
    const dataSave = WHEntryDetail.filter((item) => item.id === undefined);
    const dataUpdate = WHEntryDetail.filter((item) => item.id !== undefined);
    if (dataSave.length > 0) {
      try {
        if (
          WHEntry &&
          WHEntry.supplier_id &&
          dataSave &&
          dataSave[0].material_code &&
          dataSave[0].quantity &&
          dataSave[0].name &&
          dataSave[0].unit_price
        ) {
          if (!isSaved) {
            const response = await WHEntryService.store({
              ...WHEntry,
              warehouseEntryDetail: [...dataSave],
            });
            getWHEntryDetails(response.data.wh_entry.id);
            setWHEntry(response.data.wh_entry);
            setIsSaved(true);
            Message(response.type, response.message);
          } else {
            const response = await WHEntryDetailService.store({
              ...WHEntry,
              warehouseEntryDetail: [...dataSave],
            });
            getWHEntryDetails(response.data.wh_entry.id);
            setWHEntry(response.data.wh_entry);
            Message(response.type, response.message);
          }
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
          (originalItem.material_code !== item.material_code ||
            originalItem.quantity !== item.quantity ||
            originalItem.unit_price !== item.unit_price ||
            originalItem.name !== item.name)
        );
      });

      if (modifiedRecords.length > 0) {
        try {
          await Promise.all(
            modifiedRecords.map((item) =>
              WHEntryDetailService.update(item.id, {
                material_code: item.material_code,
                quantity: item.quantity,
                unit_price: item.unit_price,
                name: item.name,
              })
            )
          );
          getWHEntryDetails(WHEntry.id);
          Message("success", "Items updated successfully");
        } catch (error) {
          Message("error", "Error updating items: " + error.message);
        }
      }
    }
  }, [WHEntry, WHEntryDetail]);

  const handleDelete = async (id, key) => {
    if (id) {
      const response = await WHEntryDetailService.destroy(id);
      const updatedValue = WHEntryDetail.filter((item) => item.key !== key);
      setWHEntryDetail(updatedValue);
      Message(response.type, response.message);
    } else {
      const updatedValue = WHEntryDetail.filter((item) => item.key !== key);
      setWHEntryDetail(updatedValue);
      Message("success", "Delete row successfully");
    }
  };

  const handleNew = () => {
    setIsSaved(false);
    setWHEntryDetail([]);
    setWHEntry(initialWHEntryState);
    dispatch(clearWHCreate());
    form.resetFields();
  };

  const handleJump = () => {
    if (isSaved) {
      dispatch(
        jumpWHImport({
          WHEntryDetail: WHEntryDetail,
          supplier_id: WHEntry.supplier_id,
        })
      );
      dispatch(clearWHCreate());
    }
  };

  const getSuppliers = async () => {
    const data = await suppliersService.index();
    setSuppliers(data);
  };

  const handleAddRow = async () => {
    const newKey = WHEntryDetail.length + 1;
    const newRow = {
      key: newKey,
      product_id: "",
      description: "",
      delivery_date: "",
    };

    setWHEntryDetail([...WHEntryDetail, newRow]);
  };
  useEffect(() => {
    getSuppliers();
  }, []);

  useEffect(() => {
    if (warehouseEntry) {
      setWHEntry({ ...warehouseEntry });
      form.setFieldsValue({ ...warehouseEntry });
      setIsSaved(true);
      if (warehouseEntryDetials) {
        setWHEntryDetail([...warehouseEntryDetials]);
        setOriginal(JSON.parse(JSON.stringify([...warehouseEntryDetials])));
      }
    }
  }, [warehouseEntry, warehouseEntryDetials, form]);

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
        <BtnNew event={handleNew} />
        <BtnSave className="ms-2" event={handleSave} />
        <BtnAddRow className="ms-2" event={handleAddRow} />
        <BtnJump
          onClick={handleJump}
          className="ms-2"
          title="Warehouse Import"
          to="/erp-system/warehouses/import"
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
            name="supplier_id"
            label="Supplier"
            className="py-2"
          >
            <Select
              style={{ width: 180 }}
              name="supplier_id"
              placeholder="Select a Supplier"
              onChange={handleOptionFormChange}
              allowClear
            >
              {suppliers.map((item) => (
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
            total: WHEntryDetail.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          columns={columns}
          dataSource={WHEntryDetail}
        />
      </Content>

      {contextHolder}
    </div>
  );
};

export default WarehouseEntryRegister;
