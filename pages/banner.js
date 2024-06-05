import Layout from "@/components/Layout";
import axios from "axios";
import React, { useEffect, useState } from "react";

function Banner() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState([]);
  const [image, setImage] = useState(null);
  const [temporaryImage, setTemporaryImage] = useState(null);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    axios.get("/api/products").then((result) => {
      setProducts(result.data);
    });
    fetchBanner();
  }, []);

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
    setTemporaryImage(URL.createObjectURL(event.target.files[0]));
  };

  const saveBanner = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("bannerImage", image);
    formData.append("productId", productId);

    const result = await axios.post("/api/banner", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(result);
    if (result.status === 200) {
      fetchBanner();
      setTitle("");
      setDescription("");
      setImage(null);
      setTemporaryImage(null);
      setProductId("");
      document.getElementById("productDropdown").selectedIndex = 0;
    }
  };

  const fetchBanner = async (e) => {
    const result = await axios.get("/api/banner");
    setBanners(result.data);
  };

  const deleteBanner = async (_id) => {
    const result = await axios.delete(`api/banner?_id=${_id}`);
    if (result.status === 200) {
      console.log("delete successfull");
      fetchBanner();
    }
  };

  console.log(banners);

  return (
    <div>
      <Layout>
        <div className="">Add banner form</div>
        <form onSubmit={saveBanner}>
          <label htmlFor="">Title</label>
          <input
            type="text"
            value={title}
            placeholder="Banner Title"
            onChange={(ev) => setTitle(ev.target.value)}
          />
          <label htmlFor="">Description</label>
          <input
            type="text"
            value={description}
            placeholder="Banner Title"
            onChange={(ev) => setDescription(ev.target.value)}
          />

          <label htmlFor="">select product to link with banner</label>
          <select
            name=""
            id="productDropdown"
            value={productId}
            onChange={(ev) => {
              setProductId(ev.target.value);
            }}
          >
            <option value="">Uncategoriz</option>
            {products?.length > 0 &&
              products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.title}
                </option>
              ))}
          </select>

          <label htmlFor="">Select Banner Image</label>
          <input type="file" onChange={handleImageUpload} />
          {temporaryImage && (
            <img src={temporaryImage} alt="Selected" className="h-[200px] " />
          )}

          <button type="submit" className="btn-primary mt-6">
            Save
          </button>
        </form>

        <div className="bannersContainer">
          <h1>Banners</h1>
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="p-3 text-sm font-semibold tracking-wide text-left">
                  Title
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-left">
                  Control
                </th>
              </tr>
            </thead>
            <tbody>
              {banners?.map((banner) => {
                return (
                  <tr
                    key={banner._id}
                    className="bg-white border-b-2 border-ray-200"
                  >
                    <td className="p-3  text-sm text-gray-700">
                      {banner.title}
                    </td>
                    <td className="p-3  text-sm text-gray-700">
                      <button
                        className="  bg-red-500 px-4 py-1 rounded-sm text-white"
                        onClick={() => deleteBanner(banner._id)}
                      >
                        delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button onClick={fetchBanner}>test</button>
        </div>
      </Layout>
    </div>
  );
}

export default Banner;
