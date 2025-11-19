import React from "react";
import classes from "./GetAllProducts.module.css";
import ProductModel from "../../models/productModelClass";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cart";
import { CardContent, Button, Typography, Card, CardActionArea, Grid } from "@mui/material";
import { icons } from "../../public/CountryIcons";

const CatProductsList: React.FC<{ productsInCat: ProductModel[] }> = (props) => {
  const dispatch = useDispatch();
  const [imageErrors, setImageErrors] = React.useState<{ [key: string]: boolean }>({});
  return (
    <div>
      <Grid container justifyContent="center">
        {props.productsInCat
          .sort((a, b) => a.productName.localeCompare(b.productName))
          .map((product) => {
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
            <Grid key={product._id} item xs={4} sm={3} md={4} lg={3}>
              <Card className={classes.card}>
                <CardActionArea disableRipple={true} component="div" sx={{ cursor: "auto" }}>
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
                  <CardContent className={classes.cardContent}>
                    <Typography noWrap variant="h5" component="div" className={classes.productName}>
                      {product.productName}
                    </Typography>
                    <div className={classes.countryIconButton}>
                      <img src={icons.find((element) => element.includes(product.productCategory.replace(/ /g, "")))} alt="" className={classes.countryImage} />
                    </div>
                    <Typography noWrap variant="body2" color="text.secondary" className={classes.description}>
                      {product.productDescription}
                      <br />
                      <br />
                      <br />
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className={classes.price}>
                      ${product.productPrice}
                    </Typography>
                    <Button
                      onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        dispatch(addToCart(product));
                      }}
                      className={classes.cartButton}
                    >
                      Add to Cart
                    </Button>
                    <Button href={"/products/" + product._id} className={classes.detailsButton}>
                      Details
                    </Button>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            );
          })}
      </Grid>
    </div>
  );
};

export default CatProductsList;
