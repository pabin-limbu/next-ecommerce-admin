import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(assignedCategory || ""); // This is a category id. while editing
  const [goToProducts, SetGoToProducts] = useState(false);
  const [images, setImages] = useState(existingImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [productProperties, setProductProperties] = useState(
    assignedProperties || {}
  );

  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      _id,
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
    //Check if product contain _id or not , if it contain id that means it is for editing existing product.
    if (_id) {
      // UPDATE
      await axios.put("/api/products", { ...data, _id });
    } else {
      //CREATE
      const result = await axios.post("/api/products", data); // this is an async function.
    }
    SetGoToProducts(true);
  }

  // Function to upload image.
  async function uploadImages(ev) {
    //console.log(ev);
    const files = ev.target?.files;

    if (files?.length > 0) {
      setIsUploading(true); // for the spinner- start spinner
      const data = new FormData(); // this will be easier to parse in the backend.
      for (const file of files) {
        // console.log(file);
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);

      if (res.data.links.length > 0) {
        setImages((oldImages) => {
          return [...oldImages, ...res.data.links];
        });
      }
      setIsUploading(false); // for the spinner - stop the spinner.
    }
  }

  //updating image order for sortablejs.
  function updateImagesOrder(images) {
    //logic: resort the array and update the database.
    setImages(images);
  }

  if (goToProducts) {
    router.push("/products");
  }

  const propertiesToFill = [];

  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);

    propertiesToFill.push(...catInfo.properties);

    // also check the property of the parent category. since we already have category list with us we only need id to find it.
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      );
      propertiesToFill.push(...parentCat.properties);

      catInfo = parentCat; // we do this to check id the parent category also has a parent category if yes the while loop will run again.child,parents,grandparents
    }
  }

  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  return (
    <form onSubmit={saveProduct}>
      <label htmlFor="">Product Name</label>
      <input
        type="text"
        className="pabin"
        value={title}
        placeholder="Product name"
        onChange={(ev) => setTitle(ev.target.value)}
      />

      <label htmlFor="">Category</label>
      <select
        name=""
        id=""
        value={category}
        onChange={(ev) => {
          setCategory(ev.target.value);
        }}
      >
        <option value="">Uncategoriz</option>
        {categories.length > 0 &&
          categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p, index) => (
          <div className="" key={index}>
            <label className="">{p.name}</label>
            <div className="">
              <select
                onChange={(ev) => {
                  setProductProp(p.name, ev.target.value);
                }}
                value={productProperties[p.name]}
              >
                {p.values.map((v, index) => (
                  <option value={v} key={index}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

      <label htmlFor="">Photos</label>

      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable
          className="flex flex-wrap gap-1"
          list={images}
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div
                key={link}
                className="h-24 bg-white p-1 shadow-sm rounded-sm border border-gray-200 "
              >
                <img src={link} alt="" className="rounded-sm " />
              </div>
            ))}
        </ReactSortable>

        {isUploading && (
          <div className="h-24 p-1 rounder-md flex items-center">
            <Spinner />
          </div>
        )}

        <label className=" w-24 h-24 text-center cursor-pointer flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-lg bg-white border shadow-sm border-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          Add Image
          <input onChange={uploadImages} className="hidden" type="file" />
          {/* since this label has input type file when it is clicked the choose file window will show up */}
        </label>
      </div>

      <label htmlFor="">Description</label>
      <textarea
        value={description}
        placeholder="description"
        onChange={(ev) => setDescription(ev.target.value)}
      ></textarea>

      <label htmlFor="">Price in (HKD)</label>
      <input
        type="text"
        value={price}
        placeholder="price"
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
