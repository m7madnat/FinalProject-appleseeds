import React from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import Card from "react-bootstrap/Card";

export default function Product(
  props // pass props
) {
  // get product from the props
  const { product } = props;

  // // console.log(props);

  return (
    /* render card */
    <Card key={product._id}>
      {/* render link */}
      <Link to={`/product/${product.slug}`}>
        <img
          src={product.image} //
          className="card-img-top" //
          alt={product.name} //
        />
      </Link>
      {/* render Card.Body */}
      <Card.Body>
        {/* render Link */}
        <Link
          to={`/product/${product.slug}`} //
        >
          {/* render Card.Title */}
          <Card.Title as="h3">
            {product.name} {/* */}
          </Card.Title>
        </Link>
        {/* render Rating */}
        <Rating
          rating={product.rating}
          numReviews={product.numReviews}
        ></Rating>
        {/* render Card.Text */}
        <Card.Text>{product.price} €</Card.Text>
        {product.seller && product.seller.seller && (
          /* render Link */
          <Link to={`/seller/${product.seller._id}`}>
            {product.seller.seller.name}
          </Link>
        )}
      </Card.Body>
    </Card>
  );
}
