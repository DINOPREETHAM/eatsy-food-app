import React from "react";
import ProductModel from "../models/productModelClass";
import { GetStaticProps } from "next";
import CarouselForm from "../components/Carousel/CarouselForm";
import getAllProduct from "../lib/helpers/productHelpers/getAllProduct";

const CarouselPage: React.FC<{ allProducts: ProductModel[] }> = (props) => {
  return <CarouselForm allProducts={props.allProducts} />;
};

export const getStaticProps: GetStaticProps = async () => {
  // Get all products with fallback to empty array - use JSON.parse/stringify to ensure plain objects
  const productResult = await getAllProduct();
  const allProducts = Array.isArray(productResult?.body) ? JSON.parse(JSON.stringify(productResult.body)) : [];
  
  return {
    props: { allProducts },
  };
}; // need to grab from database all the products and put logic in here to render all product before page loads up.

export default CarouselPage;
