import { Link } from "react-router-dom";

const AllProduct = () => {
  return (
    <div className="homeText">
      <h1 className="textHome">Check Our All Products</h1>
      <h3 className="textHome2">
        The online football store of the footieshop , you will find the
        most famous football brands on the planet such as Nike, adidas,
        Puma.
      </h3>
      <Link className="btnHome" to="/search?category=all">
        Products
      </Link>
    </div>
  );
};

export default AllProduct;
