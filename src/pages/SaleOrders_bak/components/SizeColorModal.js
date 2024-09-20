import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { closeModalProductItem } from "../../../redux/actions/modalAction";
import React, { useEffect, useState } from "react";
import { Layout, theme, Table, Select } from "antd";
import { Form, Input } from "antd";
import { useMessage } from "../../../hooks/useMessage";
import * as sizesService from "../../../services/sizes";
import * as colorsService from "../../../services/colors";
import * as productItemService from "../../../services/product_items";
import BtnAddRow from "../../../components/Button/BtnAddRow";
import BtnSave from "../../../components/Button/BtnSave";
import BtnDelete from "../../../components/Button/BtnDelete";
const SizeColorModal = () => {
  const [productItems, setProductItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const { Message, contextHolder } = useMessage();
  const { Content } = Layout;
  const [form] = Form.useForm();
  const { Option } = Select;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const isModalOpen = useSelector((state) => state.modal.isOpenProductItem);
  const saleOrderItem = useSelector((state) => state.modal.saleOrder);

  const getProductItem = async (saleOrderItemId) => {
    if (saleOrderItemId) {
      try {
        const response = await productItemService.show(saleOrderItemId);
        if (response.data.data.length > 0) {
          setProductItems(response.data.data);
        } else {
          setProductItems([]);
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

  const dispatch = useDispatch();

  const handleCloseModal = () => {
    dispatch(closeModalProductItem());
    setProductItems([]);
  };

  const handleOk = () => {
    handleCloseModal();
  };

  const handleSave = async () => {
    const dataSave = productItems.filter((item) => item.id === undefined);
    const dataUpdate = productItems.filter((item) => item.id !== undefined);

    if (
      dataSave.length > 0 &&
      dataSave[0].size_id &&
      dataSave[0].color_id &&
      dataSave[0].quantity
    ) {
      try {
        const response = await productItemService.store({
          size_color_quantity: dataSave,
          sale_order_item_id: saleOrderItem[0].id,
        });
        getProductItem();
        Message(response.type, response.message);
      } catch (error) {
        Message("error", "Error saving new items: " + error.message);
      }
    }

    if (dataUpdate.length > 0) {
      const hasInvalidItemsUpdate = dataUpdate.some(
        (item) => !item.color_id || !item.size_id || !item.quantity
      );

      if (hasInvalidItemsUpdate) {
        Message("error", "Please fill in required fields for existing items");
        return;
      }

      try {
        await Promise.all(
          dataUpdate.map((item) =>
            productItemService.update(item.id, {
              size_id: item.size_id,
              color_id: item.color_id,
              quantity: item.quantity,
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
    const newProductItems = [...productItems];
    const index = newProductItems.findIndex((item) => key === item.key);
    newProductItems[index][column] = e.target.value;
    setProductItems(newProductItems);
  };

  const handleOptionTableChange = (value, key, column) => {
    const newProductItems = [...productItems];
    const index = newProductItems.findIndex((item) => key === item.key);
    if (index !== -1) {
      newProductItems[index][column] = value;
      setProductItems(newProductItems);
    }
  };

  const getSizes = async () => {
    try {
      const response = await sizesService.index(null);
      const data = response?.map((size, index) => ({
        ...size,
        key: index,
      }));

      setSizes(data);
    } catch (error) {
      Message(
        "error",
        "Error fetching sizes: " +
          (error.response ? error.response.data : error.message)
      );
    }
  };

  const getColors = async () => {
    try {
      const response = await colorsService.index(null);
      const data = response?.map((color, index) => ({
        ...color,
        key: index,
      }));

      setColors(data);
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
      getProductItem(saleOrderItem[0]?.id);
      getSizes();
      getColors();
    } else {
      setProductItems([]);
    }
  }, [saleOrderItem, isModalOpen]);

  const columns = [
    {
      title: "Color",
      dataIndex: "color_id",
      key: "color_id",
      width: "12%",
      render: (value, record) => (
        <Select
          name={`color_id[${record.key}]`}
          placeholder="Select a color"
          onChange={(newValue) =>
            handleOptionTableChange(newValue, record.key, "color_id")
          }
          allowClear
          value={record.color_id}
          style={{ width: "100%" }}
        >
          {colors.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Size",
      dataIndex: "size_id",
      key: "size_id",
      width: "12%",
      render: (value, record) => (
        <Select
          name={`size_id[${record.key}]`}
          placeholder="Select a size"
          onChange={(newValue) =>
            handleOptionTableChange(newValue, record.key, "size_id")
          }
          allowClear
          value={record.size_id}
          style={{ width: "100%" }}
        >
          {sizes.map((item) => (
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
      width: "13%",
      render: (value, record) => (
        <Input
          name={`quantity[${record.id}]`}
          type="number"
          value={value}
          onChange={(e) => handleInputTableChange(e, record.key, "quantity")}
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
        await productItemService.destroy(id);
        setProductItems(productItems.filter((item) => item.id !== id));
      } else {
        setProductItems(productItems.filter((item) => item.key !== key));
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
    const newKey = productItems.length + 1;
    const newRow = {
      key: newKey,
    };
    setProductItems([...productItems, newRow]);
  };

  return (
    <>
      <Modal
        title="Size Color Quantity"
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

            <Form.Item name="product" label="Product" className="py-2">
              <Input type="text" name="product" readOnly />
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
              total: productItems.length,
              onChange: (page) => {
                setCurrentPage(page);
              },
            }}
            columns={columns}
            dataSource={productItems}
          />
        </Content>

        {contextHolder}
      </Modal>
    </>
  );
};

export default SizeColorModal;
