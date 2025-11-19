import React, { useEffect, useState } from "react";
import classes from "./GetAllProducts.module.css";
import ProductModel from "../../models/productModelClass";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cart";
import { clearSearchState } from "../../redux/search";
import { Grid } from "@mui/material";
import { icons } from "../../public/CountryIcons";
import { useSelector } from "react-redux";

const GetAllProducts: React.FC<{ allProducts: ProductModel[] }> = (props) => {
  const [searchResult, setSearchResult] = useState<ProductModel[] | null>(null);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});
  useEffect(() => {
    const btnScrollUp: any = document.querySelector("#btnScrollUp");

    btnScrollUp.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    });
    window.addEventListener("scroll", (e) => {
      btnScrollUp.style.display = window.scrollY > 100 ? "block" : "none";
    });
  }, []); // useEffect for btnScrollUp. At the top of the page, it will hide itself.

  const dispatch = useDispatch();
  const searchData = useSelector((state: any) => state.search);

  if (searchData.length !== 0) {
    // search data is the state pulled from redux. It contains the field of search results. dont get confuse with searchArray is the product array extracted from searchData.
    if (searchData[0].fieldSelect !== "productPrice") {
      const searchArray = props.allProducts.filter((product: any) =>
        product[searchData[0].fieldSelect].toLowerCase().includes(searchData[0].fieldParameter.toLowerCase())
      );
      dispatch(clearSearchState(searchData[0]));
      if (searchArray.length > 0) setSearchResult(searchArray);
      else setSearchResult([]);
    } else {
      if (searchData[0].greaterOrLessThanPrice === "greaterThan") {
        const searchArray = props.allProducts.filter((product: any) => product[searchData[0].fieldSelect] > searchData[0].fieldParameter);
        dispatch(clearSearchState(searchData[0]));
        if (searchArray.length > 0) setSearchResult(searchArray);
        else setSearchResult([]);
      } else if (searchData[0].greaterOrLessThanPrice === "lesserThan") {
        const searchArray = props.allProducts.filter((product: any) => product[searchData[0].fieldSelect] < searchData[0].fieldParameter);
        dispatch(clearSearchState(searchData[0]));
        if (searchArray.length > 0) setSearchResult(searchArray);
        else setSearchResult([]);
      } else {
        const searchArray = props.allProducts.filter((product: any) => product[searchData[0].fieldSelect] == searchData[0].fieldParameter);
        dispatch(clearSearchState(searchData[0]));
        if (searchArray.length > 0) setSearchResult(searchArray);
        else setSearchResult([]);
      }
    }
  } // this whole block of code is the  search logic to filter the menu base on search parameters.

  const Products: ProductModel[] = searchResult !== null ? searchResult : props.allProducts;

  return (
    <div className={classes.container}>
      {searchResult !== null && searchResult.length === 0 ? (
        <h3 className={classes.searchMessage}>We are sorry. There are no matching results generated for your search request.</h3>
      ) : (
        ""
      )}
      <button id="btnScrollUp">
        <ArrowUpwardIcon fontSize="large" />
      </button>
      {searchResult !== null ? (
        <button onClick={() => setSearchResult(null)} className={classes.clearSearchBtn}>
          Clear Search
        </button>
      ) : (
        ""
      )}
      <div className={classes.flexContainer}>
        {Products.sort((a, b) => a.productName.localeCompare(b.productName)).map((product) => {
          // Safe image URL resolver: handle array, string, or fallback
          const imageUrl = Array.isArray(product.productImage)
            ? product.productImage[0]
            : typeof product.productImage === 'string'
            ? product.productImage
            : null;
          
          // Check if image URL is valid
          const isValidImage = imageUrl && 
            typeof imageUrl === 'string' && 
            imageUrl.trim() !== '' && 
            imageUrl !== 'null' && 
            imageUrl !== 'undefined' &&
            !imageErrors[product._id];
          
          // Normalize URL: encode spaces and add extension if needed
          let normalizedUrl = imageUrl;
          if (isValidImage && typeof normalizedUrl === 'string' && normalizedUrl.includes('res.cloudinary.com')) {
            normalizedUrl = normalizedUrl.replace(/ /g, '%20');
            if (!/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(normalizedUrl)) {
              normalizedUrl = normalizedUrl.replace(/\/$/, '') + '.jpg';
            }
          }
          
          const handleImageError = () => {
            setImageErrors(prev => ({ ...prev, [product._id]: true }));
          };
          
          return (
          <div key={product._id}>
            <div className={classes.card}>
              <div className={classes.cardArea}>
                {isValidImage ? (
                  <img
                    src={normalizedUrl}
                    alt={product.productName}
                    className={classes.productImage}
                    style={{ width: "100%", height: "auto" }}
                    onError={handleImageError}
                  />
                ) : (
                  <div
                    className={classes.productImage}
                    style={{
                      width: "100%",
                      height: "12rem",
                      backgroundColor: "#000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "0.3rem 0.3rem 0 0",
                    }}
                  >
                    <span style={{ color: "#fff", fontSize: "20px", fontWeight: "bold", textAlign: "center", padding: "1rem" }}>
                      {product.productName}
                    </span>
                  </div>
                )}
                <div className={classes.cardContent}>
                  <div className={classes.productName}>{product.productName}</div>
                  <div className={classes.countryIconButton}>
                    <img src={icons.find((element) => element.includes(product.productCategory.replace(/ /g, "")))} alt="" className={classes.countryImage} />
                  </div>
                  <span className={classes.description}>
                    {product.productDescription}
                    <br />
                    <br />
                    <br />
                  </span>
                  <span className={classes.price}>${product.productPrice}</span>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      event.preventDefault();
                      dispatch(addToCart(product));
                    }}
                    className={classes.cartButton}
                  >
                    Add to Cart
                  </button>
                  <Link href={"/products/" + product._id}>
                    <a className={classes.detailsButton}>Details</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default GetAllProducts;
