import Layout from "@/components/Layout";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("/api/orders").then((res) => setOrders(res.data));
  }, []);

  console.log(orders);
  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic mt-4">
        <thead>
          <tr>
            <th>Date</th>
            <th>Recipint</th>
            <th>Products</th>
            <th>Paid</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  {order.name} <br /> {order.city} <br />
                  {order.email}
                </td>
                <td>
                  {order.line_items.map((product) => (
                    <>{JSON.stringify(product.price_data.product_data.name)}</>
                  ))}
                </td>
                <td className={order.paid ? "text-green-600" : "text-red-600"}>
                  {order.paid ? "yes" : "no"}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
