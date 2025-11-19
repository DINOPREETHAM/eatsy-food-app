import React from "react";
import Carousel from "react-material-ui-carousel";
import classes from "./HomeCarousel.module.css";
import Link from "next/link";
import { Button } from "@mui/material";
import ProductModel from "../../models/productModelClass";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cart";
import { useSession } from "next-auth/react";

const HomeCarousel: React.FC<{ selectedCarousel: ProductModel[] }> = (props) => {
  const dispatch = useDispatch();
  const session = useSession();

  return (
    <>
      <Carousel
        className={classes.carousel}
        navButtonsAlwaysVisible
        navButtonsProps={{
          className: classes.carouNav,
          style: {
            backgroundColor: "rgb(255, 219, 88)",
            color: "brown",
            width: "3rem",
            height: "3rem",
            borderRadius: 0,
          },
        }}
        autoPlay={false}
      >
        <div className={classes.heroContainer}>
          <img src="/eatsyIcons/EatsyCarouImage.jpeg" alt="eatsyCarouImage" className={classes.eatsyIcon} />
          <img src="/carousel/pieChart.png" alt="Carousel Image" className={classes.imagePrimary} />
          <Button href="/products" className={classes.titlePrimaryButton}>
            See our menu
          </Button>
        </div>
        <div style={{ backgroundColor: "#000", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", color: "#fff", paddingLeft: "1.5rem", paddingRight: "1.5rem", paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1rem" }}>Authentic Japanese Cuisine</h1>
          <p style={{ fontSize: "1.5rem", opacity: 0.8, maxWidth: "48rem" }}>Experience traditional flavors crafted with passion.</p>
        </div>
        <div style={{ backgroundColor: "#000", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", color: "#fff", paddingLeft: "1.5rem", paddingRight: "1.5rem", paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1rem" }}>Fresh North American Classics</h1>
          <p style={{ fontSize: "1.5rem", opacity: 0.8, maxWidth: "48rem" }}>Delicious comfort food made with premium ingredients.</p>
        </div>
        <div style={{ backgroundColor: "#000", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", color: "#fff", paddingLeft: "1.5rem", paddingRight: "1.5rem", paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1rem" }}>Vibrant South American Dishes</h1>
          <p style={{ fontSize: "1.5rem", opacity: 0.8, maxWidth: "48rem" }}>Bold spices and rich culture on every plate.</p>
        </div>
        <div style={{ backgroundColor: "#000", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", color: "#fff", paddingLeft: "1.5rem", paddingRight: "1.5rem", paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1rem" }}>Exotic South East Asian Meals</h1>
          <p style={{ fontSize: "1.5rem", opacity: 0.8, maxWidth: "48rem" }}>A fusion of herbs, aromas, and unforgettable taste.</p>
        </div>
      </Carousel>
      {session.data?.role === "admin" ? (
        <button className={classes.selectCarouselSpan}>
          <Button href="/carouselPage" color="success" className={classes.selectCarouselButton}>
            Select Carousel To Display
          </Button>
        </button>
      ) : (
        ""
      )}
    </>
  );
};

export default HomeCarousel;
