import express from "express";
import expressAsyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import { isAdmin, isAuth, isSellerOrAdmin } from "../utils.js";

// get productRouter from express.Router()
const productRouter = express.Router();

//get all products
productRouter.get(
  "/all",
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.send(products);
  })
);

// get top products
productRouter.get(
  "/top-products",
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find()
      .populate("seller", "seller.name seller.logo")
      .sort({
        rating: -1,
      })
      .limit(4);
    res.send(products);
  })
);

productRouter.get(
  "/sellers/:id", // 1st parameter - api address
  expressAsyncHandler(
    async (
      { params }, // 1st parameter - params
      res // 2nd parameter - response
    ) => {
      // get products using Product.find
      const products = await Product.find({
        seller: params.id, // pass params.id
      }).populate(
        "seller", // 1st parameter - pass 'seller'
        "seller.name seller.logo seller.rating seller.numReviews" // 2nd parameter
      );
      /* response */
      res.send(
        products // pass products
      );
    }
  ) // 2nd parameter - expressAsyncHandler
);

// get product by slug
productRouter.get(
  "/slug/:slug", // 1st parameter - api address
  expressAsyncHandler(async ({ params }, res) => {
    const product = await Product.findOne({ slug: params.slug }).populate(
      "seller", // 1st parameter - pass seller
      "seller.name seller.logo seller.rating seller.numReviews"
    );
    // check if product is defined
    if (product) {
      // response
      res.send(
        product // pass product
      );
    } else {
      /* response| status code: 404 
      | send message */
      res.status(404).send({
        message: "Product Not Found",
      });
    }
  }) // 2nd parameter - expressAsyncHandler
);

// define PAGE_SIZE
const PAGE_SIZE = 3;
productRouter.get(
  "/", // 1st parameter - api address
  expressAsyncHandler(
    async (
      { query }, // 1st param - query
      res // 2nd param - response
    ) => {
      // define pageSize
      const pageSize = query.pageSize || PAGE_SIZE;
      // define page
      const page = query.page || 1;
      // define category
      const category = query.category || "";
      // define brand
      const brand = query.brand || "";
      // define price
      const price = query.price || "";
      // define rating
      const rating = query.rating || "";
      // define order
      const order = query.order || "";
      // define searchQuery
      const searchQuery = query.query || "";
      // define queryFilter
      const queryFilter =
        searchQuery && searchQuery !== "all"
          ? {
              name: {
                $regex: searchQuery,
                $options: "i",
              },
            }
          : {};
      // define categoryFilter
      const categoryFilter = category && category !== "all" ? { category } : {};
      // define brandFilter
      const brandFilter = brand && brand !== "all" ? { brand } : {};
      // define ratingFilter
      const ratingFilter =
        rating && rating !== "all"
          ? {
              rating: {
                $gte: Number(rating),
              },
            }
          : {};
      // define priceFilter
      const priceFilter =
        price && price !== "all"
          ? {
              price: {
                $gte: Number(price.split("-")[0]),
                $lte: Number(price.split("-")[1]),
              },
            }
          : {};

      // define sortOrder
      const sortOrder =
        order === "featured"
          ? { featured: -1 }
          : order === "lowest"
          ? { price: 1 }
          : order === "highest"
          ? { price: -1 }
          : order === "toprated"
          ? { rating: -1 }
          : order === "newest"
          ? { createdAt: -1 }
          : { _id: -1 };

      // define products
      const products = await Product.find({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...brandFilter,
        ...ratingFilter,
      })
        .populate("seller", "seller.name seller.logo")
        .sort(sortOrder)
        .skip(pageSize * (page - 1))
        .limit(pageSize);

      // define countProducts
      const countProducts = await Product.countDocuments({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...brandFilter,
        ...ratingFilter,
      });

      // response | send
      res.send({
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize),
      });
    }
  )
);

productRouter.get(
  "/admin", // 1st parameter - api address
  isAuth, // 2nd parameter - isAuth
  isSellerOrAdmin, // 3rd parameter - isSellerOrAdmin
  expressAsyncHandler(async ({ query, user }, res) => {
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;

    const sellerFilter = query.sellerMode ? { seller: user._id } : {};

    const products = await Product.find({
      ...sellerFilter,
    })
      .populate("seller", "seller.name seller.logo")
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...sellerFilter,
    });

    // response | send
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  }) // 4th parameter - expressAsyncHandler
);

// get categories
productRouter.get(
  "/categories", // 1st parameter - api address
  expressAsyncHandler(
    async (
      req, // 1st param - request
      res // 2nd param - response
    ) => {
      // get categories using Product.find
      const categories = await Product.find().distinct("category");

      // response | send | categories
      res.send(
        categories // pass parameter
      );
    }
  ) // 2nd parameter - expressAsyncHandler
);

// get product by id
productRouter.get(
  "/:id", // 1st parameter - api address
  expressAsyncHandler(
    async (
      req, // 1st param - request
      res // 2nd param - response
    ) => {
      const product = await Product.findById(req.params.id).populate(
        "seller",
        "seller.name seller.logo seller.rating seller.numReviews"
      );
      if (product) {
        // response | send | product
        res.send(
          product // pass parameter
        );
      } else {
        // response | status 404 | send | message
        res.status(404).send({ message: "Product Not Found" });
      }
    }
  ) // 2nd parameter - expressAsyncHandler
);

// create product
productRouter.post(
  "/", // 1st parameter - api address
  isAuth, // 2nd parameter - isAuth
  isSellerOrAdmin, // 3rd parameter - isSellerOrAdmin
  expressAsyncHandler(
    async (
      req, // 1st param - request
      res // 2nd param - response
    ) => {
      // get product
      const product = new Product({
        name: "sample name " + Date.now(),
        slug: "sample-name-" + Date.now(),
        seller: req.user._id,
        image: "/images/p1.jpg",
        price: 0,
        category: "sample category",
        brand: "sample brand",
        countInStock: 0,
        rating: 0,
        numReviews: 0,
        description: "sample description",
      });
      const createdProduct = await product.save();
      res.send({
        message: "Product Created",
        product: createdProduct,
      });
    }
  ) // 4th parameter - expressAsyncHandler
);

// edit product
productRouter.put(
  "/:id", // 1st parameter - api address
  isAuth, // 2nd parameter - isAuth
  isSellerOrAdmin, // 3rd parameter - isSellerOrAdmin
  expressAsyncHandler(
    async (
      req, // 1st param - request
      res // 2nd param - response
    ) => {
      // get productId from request params.id
      const productId = req.params.id;
      // get product using Product.findById
      const product = await Product.findById(
        productId // pass productId
      );
      // check if product exist
      if (product) {
        product.name = req.body.name;
        product.slug = req.body.slug;
        product.price = req.body.price;
        product.image = req.body.image;
        product.images = req.body.images;
        product.category = req.body.category;
        product.brand = req.body.brand;
        product.countInStock = req.body.countInStock;
        product.description = req.body.description;

        const updatedProduct = await product.save();
        // response: send message
        res.send({
          message: "Product Updated",
          product: updatedProduct,
        });
      } else {
        // response | status 404 | send message |
        res.status(404).send({ message: "Product Not Found" });
      }
    }
  )
);

// delete product
productRouter.delete(
  "/:id", // 1st parameter - api address
  isAuth, // 2nd parameter - isAuth
  isAdmin, // 3rd parameter - isAdmin
  expressAsyncHandler(
    async (
      req, // 1st param - request
      res // 2nd param - response
    ) => {
      // get product using Product.findById
      const product = await Product.findById(
        req.params.id // pass id
      );
      // check product
      if (product) {
        // delete product
        const deleteProduct = await product.remove();

        // response | send | message | product
        res.send({
          message: "Product Deleted",
          product: deleteProduct,
        });
      } else {
        // response | status 404 | send | message
        res.status(404).send({
          message: "Product Not Found",
        });
      }
    }
  )
);

// submit product review
productRouter.post(
  "/:id/reviews", // 1st parameter - api address
  isAuth, // 2nd parameter
  expressAsyncHandler(
    async (
      req, // 1st param - request
      res // 2nd param - response
    ) => {
      // get productId from request params.id
      const productId = req.params.id;
      const product = await Product.findById(productId);
      if (product) {
        if (product.reviews.find((x) => x.name === req.user.name)) {
          return res
            .status(400)
            .send({ message: "You already submitted a review" });
        }
        const review = {
          name: req.user.name,
          rating: Number(req.body.rating),
          comment: req.body.comment,
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
          product.reviews.reduce((a, c) => c.rating + a, 0) /
          product.reviews.length;
        const updatedProduct = await product.save();
        res.status(201).send({
          message: "Review Created",
          review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
          numReviews: product.numReviews,
          rating: product.numReviews,
        });
      } else {
        // response | status 404 | send | message
        res.status(404).send({
          message: "Product Not Found",
        });
      }
    }
  )
);

// export productRouter
export default productRouter;
