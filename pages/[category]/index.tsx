import React, { Fragment } from "react";
import Head from "next/head";
import CatProductsList from "../../components/Products/CatProductsList";
import { GetStaticProps } from "next";
import ProductModel from "../../models/productModelClass";
import Error from "next/error";
import getAllProduct from "../../lib/helpers/productHelpers/getAllProduct";

const Category: React.FC<{ category: string; allProducts: ProductModel[]; status: number; message: string }> = (props) => {
  const productsCat = props.allProducts.filter((product) => {
    return product.productCategory === props.category;
  }); // generate an array of product in the same category.
  if (props.status > 300) {
    return <Error statusCode={props.status} title={props.message} />;
  }
  return (
    <Fragment>
      <Head>
        <title>{props.category}</title>
        <meta name="description" content="Category list for React E-Shop" />
      </Head>
      <h1 className="pageHeader">{props.category}</h1>
      <CatProductsList productsInCat={productsCat} />
    </Fragment>
  );
};

export async function getStaticPaths() {
  try {
    const productResult = await getAllProduct();
    const allProducts = Array.isArray(productResult?.body) ? productResult.body : [];
    
    if (allProducts.length === 0) {
      return {
        fallback: false,
        paths: [],
      };
    }
    
    const categories = allProducts.map((product: any) => product.productCategory); // extract all categories from all the products
    const uniqueCat = categories.filter((category: string, pos: number) => {
      // create a new array with unique catagories from the products.
      return categories.indexOf(category) == pos;
    });
    return {
      fallback: false,
      paths: uniqueCat.map((cat: string) => ({
        // will return an array of objects with params to make the page rendering dynamic
        params: { category: cat },
      })),
    };
  } catch (e) {
    console.log("Error occured when retrieving all product details to create unqie category array", e);
    return {
      fallback: false,
      paths: [],
    };
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { category } = context.params!; // ! is non null assertion to tell typescript that there indeed is a value
  const productResult = await getAllProduct();
  
  // Ensure all values are defined and serializable - use JSON.parse/stringify to ensure plain objects
  const allProducts = Array.isArray(productResult?.body) ? JSON.parse(JSON.stringify(productResult.body)) : [];
  const status = typeof productResult?.status === 'number' ? productResult.status : 200;
  const message = typeof productResult?.message === 'string' ? productResult.message : '';
  const categoryStr = typeof category === 'string' ? category : '';
  
  return {
    props: { category: categoryStr, allProducts, status, message },
  };
};

export default Category;
