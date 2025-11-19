import React from "react";
import { GetStaticProps } from "next";
import GetAllProducts from "../../components/Products/GetAllProducts";
import IconBox from "../../components/IconBox/IconBox";
import Error from "next/error";
import ProductModel from "../../models/productModelClass";
import Head from "next/head";
import getAllProduct from "../../lib/helpers/productHelpers/getAllProduct";

const ShowAllProducts: React.FC<{ allProducts: ProductModel[]; status: number; message: string }> = (props) => {
  if (props.status > 300) {
    return <Error statusCode={props.status} title={props.message} />;
  }
  return (
    <div>
      <Head>
        <title>All Product Page</title>
        <meta name="description" content="Showing whole menu for Eatsy Food App" />
      </Head>
      <h1 className="pageHeader">Eatsy Menu</h1>
      <IconBox />
      <GetAllProducts allProducts={props.allProducts} />
    </div>
  );
};

export const getServerSideProps = async () => {
  const productResult = await getAllProduct();
  // Ensure all values are defined and serializable - use JSON.parse/stringify to ensure plain objects
  const allProducts = Array.isArray(productResult?.body) ? JSON.parse(JSON.stringify(productResult.body)) : [];
  const status = typeof productResult?.status === 'number' ? productResult.status : 200;
  const message = typeof productResult?.message === 'string' ? productResult.message : '';
  
  return {
    props: { allProducts, status, message },
  };
}; // need to grab from database all the products and put logic in here to render all product before page loads up.

export default ShowAllProducts;
