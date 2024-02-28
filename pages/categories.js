import Layout from "@/components/Layout";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2"; // for popup when deleting the category.

function Categories({ swal }) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [editedCategory, setEditedCategory] = useState(null);
  const [properties, setProperties] = useState([]);

  // get categories when the component mounts.
  useEffect(() => {
    fetchCategories();
  }, []);
  async function fetchCategories() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }

  async function saveCategory(ev) {
    ev.preventDefault();

    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => {
        return {
          name: p.name,
          values: p.values.split(","),
        };
      }),
    };

    if (editedCategory) {
      data._id = editedCategory._id;
      //edit mode.
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setProperties([]);
    fetchCategories();
  }

  async function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent ? category.parent._id : "");
    setProperties(
      category.properties.map(({ name, values }) => ({
        name: name,
        values: values.join(","),
      }))
    ); // Because the value of property fetched from database is converted as object but we need string.
  }

  function deleteCategory(category) {
    swal
      .fire({
        title: "ARE YOU SURE?",
        text: `Do you want to delete ${category.name} ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        reverseButtons: true,
      })
      .then(async (result) => {
        // when confirmed and promise resolved...
        if (result.isConfirmed) {
          await axios.delete(`/api/categories?_id=${category._id}`);
          fetchCategories();
          swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
      })
      .catch((error) => {
        // when promise rejected...
      });
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }

  function handlePropertyNameChange(index, property, newName) {
    // properties ko array lai clone garne. jun index ma change garnu parne ho tyo index ko property change garne and return back gardena.
    setProperties((prev) => {
      const tempProperties = [...prev];
      tempProperties[index].name = newName;
      return tempProperties;
    });
  }

  function handlePropertyValueChange(index, newValues) {
    // properties ko array lai clone garne. jun index ma change garnu parne ho tyo index ko property change garne and return back gardena.
    setProperties((prev) => {
      const tempProperties = [...prev];
      tempProperties[index].values = newValues;
      return tempProperties;
    });
  }

  function handleRemoveProperty(indexToRemove) {
    setProperties((prev) => {
      const newProperty = [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove; // filter the index and return remaining.
      });

      return newProperty;
    });
  }

  return (
    <Layout>
      <h1>Caregories</h1>
      <label htmlFor="">
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : "Create new Category"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(ev) => {
              setName(ev.target.value);
            }}
          />
          <select
            value={parentCategory}
            onChange={(ev) => {
              //console.log(ev.target.value);
              setParentCategory(ev.target.value);
            }}
          >
            <option value="">No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label htmlFor="" className="block">
            Properties
          </label>
          <button
            type="button"
            className="btn-default text-sm mb-2"
            onClick={addProperty}
          >
            Add New Property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div className="flex gap-1 mb-2" key={index}>
                <input
                  className="mb-0"
                  type="text"
                  placeholder="Property Name (example : color)"
                  value={property.name}
                  onChange={(ev) =>
                    handlePropertyNameChange(index, property, ev.target.value)
                  }
                />
                <input
                  className="mb-0"
                  type="text"
                  placeholder="values, coma seperaateed"
                  value={property.values}
                  onChange={(ev) =>
                    handlePropertyValueChange(index, ev.target.value)
                  }
                />
                <button
                  type="button"
                  className="btn-red text-sm"
                  onClick={() => handleRemoveProperty(index)}
                >
                  Remove
                </button>
              </div>
            ))}
        </div>

        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              className="btn-red"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary py-1">
            Save
          </button>
        </div>
      </form>

      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Category Name</td>
              <td>Parent Category</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0
              ? categories.map((category) => (
                  <tr key={category._id}>
                    <td>{category.name}</td>
                    <td>{category?.parent?.name}</td>
                    <td className="flex justify-center">
                      <button
                        className="btn-primary mr-1"
                        onClick={() => {
                          editCategory(category);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-red"
                        onClick={() => {
                          deleteCategory(category);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => {
  return <Categories swal={swal} />;
});

// export default Categories;
