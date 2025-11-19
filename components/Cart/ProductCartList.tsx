import { useDispatch } from "react-redux";
import { removeFromCart, incrementQuantity, decrementQuantity } from "../../redux/cart";
import ProductModel from "../../models/productModelClass";
import classes from "./ProductCartList.module.css";
import { useState } from "react";

const ProductCartList: React.FC<{ cart: ProductModel[] }> = (props) => {
  const dispatch = useDispatch();
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  const totalPrice = props.cart.reduce((accumulator: number, product: ProductModel) => accumulator + product.quantity * product.productPrice, 0);

  return (
    <>
      {props.cart === undefined ? (
        <p>Loading Cart...</p>
      ) : (
        <div className={classes.container}>
          <div className={classes.header}>
            <div className={classes.imageTitle}>Image</div>
            <div>Dish</div>
            <div className={classes.priceTitle}>Price</div>
            <div className={classes.requestTitle}>Request</div>
            <div>Actions</div>
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
              <a href={`/products/${product._id}`} className={classes.imageLink}>
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
              </a>
              <p>
                <a href={`/products/${product._id}`}>{product.productName}</a>
              </p>
              <p className={classes.priceInfo}>${product.productPrice}</p>
              <p className={classes.requestInfo}>{product.productNote}</p>
              <div className={classes.buttons}>
                <button onClick={() => dispatch(incrementQuantity(product))}>+</button>
                <button onClick={() => dispatch(decrementQuantity(product))}>-</button>
                <button onClick={() => dispatch(removeFromCart(product))}>x</button>
              </div>
              <p>
                ${product.productPrice} x {product.quantity}
              </p>
            </div>
            );
          })}
          <h2 className={classes.finalPrice}>Grand Total: $ {totalPrice}</h2>
        </div>
      )}
    </>
  );
};

export default ProductCartList;
