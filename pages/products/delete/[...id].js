import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function DeleteProduct() {
  const router = useRouter(); //router is used to get the url information.
  const [productInfo, setProductInfo] = useState();
  const { id } = router.query;

  useEffect(() => {
    // if no id is available return back.
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((res) => {
      setProductInfo(res.data);
    });
  }, [id]);

  function goBack() {
    // if user press no go back to the product.
    router.push("/products");
  }

  async function deleteProduct() {
    // delete the product using the id.
    await axios.delete("/api/products?id=" + id);
    //go back to the product page after deleting it.
    goBack();
  }

  return (
    <Layout>
      <h1 className="text-center">
        Do you really want to delete this &nbsp;&quot;
        {productInfo?.title}&quot;?
      </h1>

      <div className="flex gap-2 justify-center">
        <button className="btn-red" onClick={deleteProduct}>
          Yes
        </button>
        <button onClick={goBack} className="btn-default">
          No
        </button>
      </div>
    </Layout>
  );
}
