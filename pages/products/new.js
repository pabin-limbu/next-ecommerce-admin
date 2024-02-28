// this page is for adding new products.

import Layout from "@/components/Layout";
import React, { useState } from "react";

import { Router, useRouter } from "next/router";
import ProductForm from "@/components/ProductForm";

export default function NewProduct() {
  return (
    <Layout>
      <h1>Add product</h1>
      <ProductForm />
    </Layout>
  );
}
