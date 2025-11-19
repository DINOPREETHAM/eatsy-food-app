import Head from "next/head";
import CategoryList from "../components/Catagory/CategoryList";
import ProductModel from "../models/productModelClass";
import HomeCarousel from "../components/Carousel/HomeCarousel";
import getSelectedCarousel from "../lib/helpers/carouselHelpers/getSelectedCarousel";
import getAllProduct from "../lib/helpers/productHelpers/getAllProduct";
import getAllUsers from "../lib/helpers/userHelpers/getAllUsers";
import FreqOrderedList from "../components/Products/FreqOrderedList";

const Home: React.FC<{ allProducts: ProductModel[]; selectedCarousels: ProductModel[]; allUsers: object[] }> = (props) => {
  const categories = props.allProducts.map((product) => product.productCategory); // extract all categories from all the products

  const cat = categories.filter((category, pos) => {
    // create a new array with unique catagories from the products.
    return categories.indexOf(category) == pos;
  });
  const uniqueCat = cat.sort();

  return (
    <div>
      <Head>
        <title>Eatsy Food App</title>
        <meta name="description" content="Eatsy Food App created by React/Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomeCarousel selectedCarousel={props.selectedCarousels} />
      <CategoryList catList={uniqueCat} />
      <FreqOrderedList allUsers={props.allUsers} />
    </div>
  );
};

export async function getStaticProps(context: any) {
  // Get all products with fallback to empty array
  const productResult = await getAllProduct();
  const allProducts = Array.isArray(productResult?.body) ? JSON.parse(JSON.stringify(productResult.body)) : [];

  // Get selected carousels with fallback to empty array
  const selectedCarousels = await getSelectedCarousel();
  const carousels = Array.isArray(selectedCarousels) ? JSON.parse(JSON.stringify(selectedCarousels)) : [];

  // Get all users with fallback to empty array
  const userResult = await getAllUsers();
  const allUsers = Array.isArray(userResult?.body) ? JSON.parse(JSON.stringify(userResult.body)) : [];

  return {
    props: {
      allProducts: allProducts,
      selectedCarousels: carousels,
      allUsers: allUsers,
    },
  };
}

export default Home;
