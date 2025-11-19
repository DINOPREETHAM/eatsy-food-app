import { Fragment, useState } from "react";
import ProductModel from "../../models/productModelClass";
import classes from "./ProductCheckoutList.module.css";
import Link from "next/link";

const ProductCheckoutList: React.FC<{ cart: ProductModel[] }> = (props) => {
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});
  return (
    <Fragment>
      {props.cart === undefined ? (
        <p>Loading Cart...</p>
      ) : (
        <div>
          <div className={classes.header}>
            <div className={classes.imageTitle}>Image</div>
            <div>Dish</div>
            <div className={classes.priceTitle}>Price</div>
            <div className={classes.requestTitle}>Request</div>
            <div>Total</div>
          </div>
          {props.cart.map((product: ProductModel) => {
            // Safe image URL resolver: handle array, string, or fallback
            let imageUrl = Array.isArray(product.productImage)
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
              imageUrl !== '/no-image.png' &&
              !imageErrors[product._id];
            
            // Normalize URL: encode spaces and add extension if needed
            if (isValidImage && typeof imageUrl === 'string' && imageUrl.includes('res.cloudinary.com')) {
              imageUrl = imageUrl.replace(/ /g, '%20');
              if (!/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(imageUrl)) {
                imageUrl = imageUrl.replace(/\/$/, '') + '.jpg';
              }
            }
            
            const handleImageError = () => {
              setImageErrors(prev => ({ ...prev, [product._id]: true }));
            };
            
            return (
            <div className={classes.body} key={product._id}>
              <div className={classes.imageDiv}>
                {isValidImage ? (
                  <img
                    src={imageUrl}
                    alt={product.productName}
                    className={classes.image}
                    style={{ width: "100%", height: "auto" }}
                    onError={handleImageError}
                  />
                ) : (
                  <div
                    className={classes.image}
                    style={{
                      width: "100%",
                      height: "6rem",
                      backgroundColor: "#000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "0.3rem",
                    }}
                  >
                    <span style={{ color: "#fff", fontSize: "14px", fontWeight: "bold", textAlign: "center", padding: "0.5rem" }}>
                      {product.productName}
                    </span>
                  </div>
                )}
              </div>
              <p>{product.productName}</p>
              <p className={classes.priceInfo}>$ {product.productPrice}</p>
              <p className={classes.requestInfo}>{product.productNote}</p>
              <p>
                ${product.productPrice} x {product.quantity}
              </p>
            </div>
            );
          })}
          <Link href="/cartPage">
            <a className={classes.backCartButton}>Back to Cart</a>
          </Link>
        </div>
      )}
    </Fragment>
  );
};

export default ProductCheckoutList;
