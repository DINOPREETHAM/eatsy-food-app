import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import classes from "./MovingCarousel.module.css";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cart";
import { Typography, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import StarRateIcon from "@mui/icons-material/StarRate";

const MovingCarousel: React.FC<{ accumOrderForEachProduct: any[] }> = (props) => {
  const dispatch = useDispatch();
  const [imageErrors, setImageErrors] = React.useState<{ [key: number]: boolean }>({});
  const sortProductByQuantity = props.accumOrderForEachProduct.sort((a, b) => (a[0] < b[0] ? 1 : -1));
  const displayedDishes = sortProductByQuantity.slice(0, 8);

  const sliderSettings = {
    slidesToShow: 5,
    infinite: true,
    autoplay: true,
    speed: 2200,
    autoplaySpeed: 2200,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 300,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  return (
    <div className={classes.content}>
      <Typography className={classes.title1}>EATSY FOOD</Typography>
      <Typography className={classes.title2}>TOP DISHES</Typography>
      <Slider {...sliderSettings}>
        {displayedDishes.map((product, i) => {
          // product[2] is productImage array, normalize to get image
          let imageUrl = Array.isArray(product[2]) && product[2].length > 0 
            ? product[2][0] 
            : typeof product[2] === 'string'
            ? product[2]
            : null;
          
          // Check if image URL is valid
          const isValidImage = imageUrl && 
            typeof imageUrl === 'string' && 
            imageUrl.trim() !== '' && 
            imageUrl !== 'null' && 
            imageUrl !== 'undefined' &&
            imageUrl !== '/no-image.png' &&
            !imageErrors[i];
          
          // Normalize URL: encode spaces and add extension if needed
          if (isValidImage && typeof imageUrl === 'string' && imageUrl.includes('res.cloudinary.com')) {
            imageUrl = imageUrl.replace(/ /g, '%20');
            if (!/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(imageUrl)) {
              imageUrl = imageUrl.replace(/\/$/, '') + '.jpg';
            }
          }
          
          const handleImageError = () => {
            setImageErrors(prev => ({ ...prev, [i]: true }));
          };
          
          return (
          <div key={i} className={classes.card}>
            {isValidImage ? (
              <img
                src={imageUrl}
                alt={product[1]}
                className={classes.cardImage}
                style={{ width: "100%", height: "auto" }}
                onError={handleImageError}
              />
            ) : (
              <div
                className={classes.cardImage}
                style={{
                  width: "100%",
                  height: "10rem",
                  backgroundColor: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderTopLeftRadius: "0.4rem",
                  borderTopRightRadius: "0.4rem",
                }}
              >
                <span style={{ color: "#fff", fontSize: "20px", fontWeight: "bold", textAlign: "center", padding: "1rem" }}>
                  {product[1]}
                </span>
              </div>
            )}
            <span className={classes.mealPosition}>{i + 1}</span>
            <StarRateIcon className={classes.starIcon} />
            <Typography noWrap className={classes.cardHeader}>
              {product[1]}
            </Typography>
            <br />
            <br />
            <br />
            <Button href={"/products/" + product[4]} className={classes.buttonDetails}>
              <VisibilityIcon className={classes.carouIcon} />
            </Button>
            <Button
              className={classes.buttonCart}
              onClick={(event) =>
                dispatch(
                  addToCart({
                    _id: product[4],
                    productImage: product[2],
                    productName: product[1],
                    productCategory: product[5],
                    productPrice: product[3],
                    productDescription: product[6],
                    productNote: product[7],
                  })
                )
              }
            >
              <AddShoppingCartIcon className={classes.carouIcon} />
            </Button>
            <span className={classes.spanPrice}>${product[3]}</span>
          </div>
          );
        })}
      </Slider>
    </div>
  );
};
export default MovingCarousel;
