import React, { useEffect, useState, useCallback } from "react";
import { Layout, theme, Table } from "antd";
import { useColumnSearch } from "../../hooks/useColumnSearch";
import { Form, Input, Select } from "antd";
import * as PRService from "../../services/purchase_requisitions";
import * as PRItemsService from "../../services/purchase_requisition_items";
import * as materialsService from "../../services/materials";
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

const PurchaseRequisitionRegister = () => {
  const initialState = {
    notes: "",
  };

  const [PR, setPR] = useState(initialState);
  const [materials, setMaterials] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const [original, setOriginal] = useState([]);
  const [PRItem, setPRItem] = useState([]);
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
    const newValues = [...PRItem];
    const index = newValues.findIndex((item) => key === item.key);
    newValues[index][column] = e.target.value;
    setPRItem(newValues);
  };
  const handleOptionTableChange = (value, key, column) => {
    const newValue = [...PRItem];
    const index = newValue.findIndex((item) => key === item.key);
    if (index !== -1) {
      newValue[index][column] = value;
      setPRItem(newValue);
    }
  };
  const getPRItem = async (WHEntryId) => {
    if (WHEntryId) {
      try {
        const response = await PRItemsService.show(WHEntryId);
        if (response.data.data.length > 0) {
          setPRItem(response.data.data);
          setOriginal(JSON.parse(JSON.stringify(response.data.data)));
        } else {
          setPRItem([]);
        }
      } catch (error) {
        Message("error", "Error fetching product items: " + error.message);
      }
    }
  };

  const columns = [
    {
      title: "Material",
      dataIndex: "material_id",
      key: "material_id",
      width: "20%",
      ...getColumnSearch("material_id"),
      render: (value, record) => (
        <Select
          name={`material_id[${record.key}]`}
          placeholder="Select a product"
          onChange={(newValue) =>
            handleOptionTableChange(newValue, record.key, "material_id")
          }
          allowClear
          value={record.material_id}
          style={{ width: "100%" }}
        >
          {materials.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
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
          onChange={(e) => handleInputTableChange(e, record.key, "quantity")}
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

  const getMaterials = async () => {
    const data = await materialsService.index();
    setMaterials(data);
  };

  const handleSave = useCallback(async () => {
    const dataSave = PRItem.filter((item) => item.id === undefined);
    const dataUpdate = PRItem.filter((item) => item.id !== undefined);
    if (dataSave.length > 0) {
      try {
        if (!isSaved) {
          if (dataSave && dataSave[0].material_id && dataSave[0].quantity) {
            const response = await PRService.store({
              ...PR,
              PRs: [...dataSave],
            });
            setIsSaved(true);
            getPRItem(response.data.PR.id);
            setPR(response.data.PR);
            Message(response.type, response.message);
          } else {
            Message("error", "Please fill in required fields");
          }
        } else {
          if (dataSave && dataSave[0].material_id && dataSave[0].quantity) {
            const response = await PRItemsService.store({
              ...PR,
              PRs: [...dataSave],
            });
            getPRItem(PR.id);
            setPR(response.data.PR);
            Message(response.type, response.message);
          } else {
            Message("error", "Please fill in required fields");
          }
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
          (originalItem.material_id !== item.material_id ||
            originalItem.quantity !== item.quantity)
        );
      });

      if (modifiedRecords.length > 0) {
        try {
          await Promise.all(
            modifiedRecords.map((item) =>
              PRItemsService.update(item.id, {
                material_id: item.material_id,
                quantity: item.quantity,
              })
            )
          );
          getPRItem(PR.id);
          Message("success", "Items updated successfully");
        } catch (error) {
          Message("error", "Error updating items: " + error.message);
        }
      }
    }
  }, [PR, PRItem]);

  const handleDelete = async (id, key) => {
    if (id) {
      const response = await PRItemsService.destroy(id);
      const updatedValue = PRItem.filter((item) => item.key !== key);
      setPRItem(updatedValue);
      Message(response.type, response.message);
    } else {
      const updatedValue = PRItem.filter((item) => item.key !== key);
      setPRItem(updatedValue);
      Message("success", "Delete row successfully");
    }
  };

  const handleNew = () => {
    setIsSaved(false);
    setPRItem([]);
    setPR(initialState);
    dispatch(clearWHCreate());
    form.resetFields();
  };

  const handleJump = () => {
    if (isSaved) {
      dispatch(
        jumpWHImport({
          PRItem: PRItem,
          supplier_id: PR.supplier_id,
        })
      );
      dispatch(clearWHCreate());
    }
  };

  const handleInputFormChange = (e) => {
    const { name, value } = e.target;
    setPR((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAddRow = async () => {
    const newKey = PRItem.length + 1;
    const newRow = {
      key: newKey,
      material_id: "",
      quantity: "",
    };

    setPRItem([...PRItem, newRow]);
  };

  useEffect(() => {
    if (warehouseEntry.length > 0) {
      setPR({ ...warehouseEntry });
      form.setFieldsValue({ ...warehouseEntry });
      setIsSaved(true);
      if (warehouseEntryDetials) {
        setPRItem([...warehouseEntryDetials]);
        setOriginal(JSON.parse(JSON.stringify([...warehouseEntryDetials])));
      }
    }
  }, [warehouseEntry, warehouseEntryDetials, form]);

  useEffect(() => {
    form.setFieldsValue(PR);
  }, [PR, form]);

  useEffect(() => {
    getMaterials();
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
          <Form.Item name="notes" label="Note" className="py-2">
            <Input
              name="notes"
              onChange={handleInputFormChange}
              type="text"
              value={PR.notes}
            />
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
            total: PRItem.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          columns={columns}
          dataSource={PRItem}
        />
      </Content>

      {contextHolder}
    </div>
  );
};

export default PurchaseRequisitionRegister;
