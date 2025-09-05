import React, { useState } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(<App />);


function AddProduct() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

const addProduct = () => {
  if (!name || !price || !description) {
    alert("Please fill all product details before adding.");
    return; // stop execution
  }else{

  const newProduct = {
    id: uuidv4(),
    name,
    price: parseFloat(price),
    description,
  };

  setProducts([...products, newProduct]);
  setName("");
  setPrice("");
  setDescription("");
};
}

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Add Product</h2>
      <div className="flex gap-4 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
          className="px-3 py-2 text-black rounded"
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          type="number"
          className="px-3 py-2 text-black rounded"
        />
        <button onClick={addProduct} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
          Add
        </button>
      </div>

      <h3 className="text-xl mb-3">Products</h3>
      <ul>
        {products.map((p) => (
          <li key={p.id} className="mb-2">
            {p.name} - Rs.{p.price} | Barcode: {p.barcode}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddProduct;
