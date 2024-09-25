// import React, { useEffect, useState, useCallback } from "react";
// import { Layout, theme, Table } from "antd";
// import { useColumnSearch } from "../../hooks/useColumnSearch";
// import { Form, Input, Select } from "antd";
// import * as saleOrdersService from "../../services/sale_orders";
// import * as saleOrderItemsService from "../../services/sale_order_items";
// import * as customerService from "../../services/customers";
// import * as productsService from "../../services/products";
// import { useMessage } from "../../hooks/useMessage";
// import BtnNew from "../../components/Button/BtnNew";
// import BtnSave from "../../components/Button/BtnSave";
// import BtnDelete from "../../components/Button/BtnDelete";
// import BtnAddRow from "../../components/Button/BtnAddRow";

// const SaleOrderRegister = () => {
//   const initialSaleOrderState = {
//     customer_id: null,
//   };

//   const initialSaleOrderItemState = [
//     {
//       key: 1,
//       product_id: null,
//       delivery_date: "",
//       description: "",
//     },
//   ];

//   const [saleOrder, setSaleOrder] = useState(initialSaleOrderState);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isSaved, setIsSaved] = useState(false);
//   const [originalProductItems, setOriginalProductItems] = useState([]);
//   const [saleOrderItems, setSaleOrderItems] = useState(
//     initialSaleOrderItemState
//   );
//   const [customers, setCustomers] = useState([]);
//   const [product, setProduct] = useState([]);
//   const { Message, contextHolder } = useMessage();
//   const { getColumnSearch } = useColumnSearch();
//   const { Content } = Layout;
//   const { Option } = Select;
//   const [form] = Form.useForm();

//   const handleInputTableChange = (e, key, column) => {
//     const newSaleOrders = [...saleOrderItems];
//     const index = newSaleOrders.findIndex((item) => key === item.key);
//     newSaleOrders[index][column] = e.target.value;
//     setSaleOrderItems(newSaleOrders);
//   };

//   const handleOptionTableChange = (value, key, column) => {
//     const newSaleOrders = [...saleOrderItems];
//     const index = newSaleOrders.findIndex((item) => key === item.key);
//     if (index !== -1) {
//       newSaleOrders[index][column] = value;
//       setSaleOrderItems(newSaleOrders);
//     }
//   };

//   const getSaleOrderItem = async (saleOrderId) => {
//     if (saleOrderId) {
//       try {
//         const response = await saleOrderItemsService.show(saleOrderId);
//         if (response.data.data.length > 0) {
//           setSaleOrderItems(response.data.data);
//           setOriginalProductItems(
//             JSON.parse(JSON.stringify(response.data.data))
//           );
//         } else {
//           setSaleOrderItems([]);
//         }
//       } catch (error) {
//         Message("error", "Error fetching product items: " + error.message);
//       }
//     }
//   };

//   const columns = [
//     {
//       title: "Product Name",
//       dataIndex: "product_id",
//       key: "product_id",
//       width: "16%",
//       ...getColumnSearch("product_id"),
//       render: (value, record) => (
//         <Select
//           name={`product_id[${record.key}]`}
//           placeholder="Select a product"
//           onChange={(newValue) =>
//             handleOptionTableChange(newValue, record.key, "product_id")
//           }
//           allowClear
//           value={record.product_id}
//           style={{ width: 150 }}
//         >
//           {product.map((item) => (
//             <Option key={item.id} value={item.id}>
//               {item.name}
//             </Option>
//           ))}
//         </Select>
//       ),
//     },

//     {
//       title: "Customer",
//       dataIndex: "customer_id",
//       key: "customer_id",
//       width: "16%",
//       ...getColumnSearch("customer_id"),
//       render: (value, record) => (
//         <Select
//           name={`customer_id[${record.key}]`}
//           placeholder="Select a product"
//           onChange={(newValue) =>
//             handleOptionTableChange(newValue, record.key, "customer_id")
//           }
//           allowClear
//           value={record.customer_id}
//           style={{ width: 150 }}
//         >
//           {product.map((item) => (
//             <Option key={item.id} value={item.id}>
//               {item.name}
//             </Option>
//           ))}
//         </Select>
//       ),
//     },

//     {
//       title: "Color",
//       dataIndex: "color_id",
//       key: "color_id",
//       width: "12%",
//       render: (value, record) => (
//         <Select
//           name={`color_id[${record.key}]`}
//           placeholder="Select a color"
//           onChange={(newValue) =>
//             handleOptionTableChange(newValue, record.key, "color_id")
//           }
//           allowClear
//           value={record.color_id}
//           style={{ width: "100%" }}
//         >
//           {colors.map((item) => (
//             <Option key={item.id} value={item.id}>
//               {item.name}
//             </Option>
//           ))}
//         </Select>
//       ),
//     },
//     {
//       title: "Size",
//       dataIndex: "size_id",
//       key: "size_id",
//       width: "12%",
//       render: (value, record) => (
//         <Select
//           name={`size_id[${record.key}]`}
//           placeholder="Select a size"
//           onChange={(newValue) =>
//             handleOptionTableChange(newValue, record.key, "size_id")
//           }
//           allowClear
//           value={record.size_id}
//           style={{ width: "100%" }}
//         >
//           {sizes.map((item) => (
//             <Option key={item.id} value={item.id}>
//               {item.name}
//             </Option>
//           ))}
//         </Select>
//       ),
//     },
//     {
//       title: "Quantity",
//       dataIndex: "quantity",
//       key: "quantity",
//       width: "13%",
//       render: (value, record) => (
//         <Input
//           name={`quantity[${record.id}]`}
//           type="number"
//           value={value}
//           onChange={(e) => handleInputTableChange(e, record.key, "quantity")}
//         />
//       ),
//     },

//     {
//       title: "Start Date",
//       dataIndex: "start_date",
//       key: "start_date",
//       width: "15%",
//       ...getColumnSearch("start_date"),
//       render: (value, record) => (
//         <Input
//           name={`start_date[${record.key}]`}
//           type="date"
//           value={value}
//           onChange={(e) =>
//             handleInputTableChange(e, record.key, "start_date")
//           }
//         />
//       ),
//     },

//     {
//       title: "End Date",
//       dataIndex: "end_date",
//       key: "end_date",
//       width: "15%",
//       ...getColumnSearch("end_date"),
//       render: (value, record) => (
//         <Input
//           name={`end_date[${record.key}]`}
//           type="date"
//           value={value}
//           onChange={(e) =>
//             handleInputTableChange(e, record.key, "end_date")
//           }
//         />
//       ),
//     },

//     {
//       title: "Description",
//       dataIndex: "description",
//       key: "description",
//       ...getColumnSearch("description"),
//       render: (value, record) => (
//         <Input
//           name={`description[${record.key}]`}
//           type="text"
//           value={value}
//           onChange={(e) => handleInputTableChange(e, record.key, "description")}
//         />
//       ),
//     },

//     {
//       title: "Action",
//       key: "operation",
//       width: "7%",
//       className: "text-center",
//       fixed: "right",
//       render: (_, record) => (
//         <BtnDelete event={() => handleDelete(record.id, record.key)} />
//       ),
//     },
//   ];

//   const {
//     token: { colorBgContainer, borderRadiusLG },
//   } = theme.useToken();

//   const handleOptionFormChange = (value) => {
//     setSaleOrder((prev) => ({
//       ...prev,
//       customer_id: value,
//     }));
//   };

//   const handleSave = useCallback(async () => {
//     const dataSave = saleOrderItems.filter((item) => item.id === undefined);
//     const dataUpdate = saleOrderItems.filter((item) => item.id !== undefined);
//     if (dataSave.length > 0) {
//       try {
//         if (
//           saleOrder &&
//           saleOrder.customer_id &&
//           dataSave &&
//           dataSave[0].product_id
//         ) {
//           if (!isSaved) {
//             const response = await saleOrdersService.store({
//               ...saleOrder,
//               saleOrderItem: [...dataSave],
//             });
//             getSaleOrderItem(response.data.sale_order.id);
//             setSaleOrder(response.data.sale_order);
//             setIsSaved(true);
//             Message(response.type, response.message);
//           } else {
//             const response = await saleOrderItemsService.store({
//               ...saleOrder,
//               saleOrderItem: [...dataSave],
//             });
//             getSaleOrderItem(response.data.sale_order.id);
//             setSaleOrder(response.data.sale_order);
//             Message(response.type, response.message);
//           }
//         } else {
//           Message("error", "Please fill in required fields");
//         }
//       } catch (error) {
//         Message(
//           "error",
//           "Error saving data: " +
//             (error.response ? error.response.data : error.message)
//         );
//       }
//     }

//     if (dataUpdate.length > 0) {
//       const modifiedRecords = dataUpdate.filter((item) => {
//         const originalItem = originalProductItems.find(
//           (original) => original.id === item.id
//         );
//         return (
//           originalItem &&
//           (originalItem.product_id !== item.product_id ||
//             originalItem.delivery_date !== item.delivery_date ||
//             originalItem.description !== item.description)
//         );
//       });

//       if (modifiedRecords.length > 0) {
//         try {
//           await Promise.all(
//             modifiedRecords.map((item) =>
//               saleOrderItemsService.update(item.id, {
//                 product_id: item.product_id,
//                 delivery_date: item.delivery_date,
//                 description: item.description,
//               })
//             )
//           );
//           getSaleOrderItem(saleOrder.id);
//           Message("success", "Items updated successfully");
//         } catch (error) {
//           Message("error", "Error updating items: " + error.message);
//         }
//       }
//     }
//   }, [saleOrder, saleOrderItems]);

//   const handleDelete = async (id, key) => {
//     if (id) {
//       const response = await saleOrderItemsService.destroy(id);
//       const updatedSaleOrders = saleOrderItems.filter(
//         (item) => item.key !== key
//       );
//       setSaleOrderItems(updatedSaleOrders);
//       Message(response.type, response.message);
//     } else {
//       const updatedSaleOrders = saleOrderItems.filter(
//         (item) => item.key !== key
//       );
//       setSaleOrderItems(updatedSaleOrders);
//       Message("success", "Delete row successfully");
//     }
//   };

//   const handleNew = () => {
//     setIsSaved(false);
//     setSaleOrderItems(initialSaleOrderItemState);
//     setSaleOrder(initialSaleOrderState);
//     form.resetFields();
//   };
//   const getCustomer = async () => {
//     const data = await customerService.index();
//     setCustomers(data);
//   };

//   const getProduct = async () => {
//     const data = await productsService.index();
//     setProduct(data);
//   };

//   const handleAddRow = async () => {
//     const newKey = saleOrderItems.length + 1;
//     const newRow = {
//       key: newKey,
//       product_id: "",
//       description: "",
//       delivery_date: "",
//     };

//     setSaleOrderItems([...saleOrderItems, newRow]);
//   };
//   useEffect(() => {
//     getCustomer();
//     getProduct();
//   }, []);

//   useEffect(() => {
//     form.setFieldsValue(saleOrder);
//   }, [saleOrder, form]);
//   return (
//     <div>
//       <Content
//         style={{
//           margin: "10px 16px",
//           padding: 10,
//           paddingLeft: 24,
//           minHeight: 10,
//           background: colorBgContainer,
//           borderRadius: borderRadiusLG,
//         }}
//       >
//         <BtnNew event={handleNew} />
//         <BtnSave className="ms-2" event={handleSave} />
//         <BtnAddRow className="ms-2" event={handleAddRow} />
//       </Content>

//       <Content
//         style={{
//           margin: "10px 16px",
//           padding: 24,
//           paddingTop: 15,
//           paddingBottom: 15,
//           minHeight: 100,
//           background: colorBgContainer,
//           borderRadius: borderRadiusLG,
//         }}
//       >
//         <Form
//           layout="inline"
//           form={form}
//           style={{
//             maxWidth: "none",
//           }}
//         >
//           <Form.Item
//             rules={[
//               {
//                 required: true,
//                 message: "Please input customer",
//               },
//             ]}
//             name="customer"
//             label="Customer"
//             className="py-2"
//           >
//             <Select
//               disabled={isSaved}
//               style={{ width: 180 }}
//               name="customer_id"
//               placeholder="Select a customer"
//               onChange={handleOptionFormChange}
//               allowClear
//             >
//               {customers.map((item) => (
//                 <Option key={item.id} value={item.id}>
//                   {item.name}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>
//         </Form>
//       </Content>

//       <Content
//         style={{
//           margin: "18px 16px",
//           padding: 24,
//           paddingTop: 20,
//           paddingBottom: 20,
//           // minHeight: 510,
//           background: colorBgContainer,
//           borderRadius: borderRadiusLG,
//         }}
//       >
//         <Table
//           size="small"
//           pagination={{
//             current: currentPage,
//             pageSize: 7,
//             total: saleOrderItems.length,
//             onChange: (page) => {
//               setCurrentPage(page);
//             },
//           }}
//           columns={columns}
//           dataSource={saleOrderItems}
//         />
//       </Content>

//       {contextHolder}
//     </div>
//   );
// };

// export default SaleOrderRegister;
