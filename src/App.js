import axios from 'axios';
import React, { useState, useEffect } from 'react';

const productsUrl =
  'https://services.odata.org/Experimental/OData/OData.svc/Products';
const detailsUrl =
  'https://services.odata.org/Experimental/OData/OData.svc/ProductDetails';

function App() {
  const [products, setProducts] = useState();
  const [productDetails, setProductDetails] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, detailsResponse] = await Promise.all([
          axios.get(productsUrl),
          axios.get(detailsUrl),
        ]);
        setProducts(productsResponse.data.value);
        setProductDetails(detailsResponse.data.value);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const mergeAndSortProducts = () => {
    products?.forEach((product) => {
      productDetails?.forEach((detail) => {
        if (detail?.ProductID === product?.ID) {
          Object.assign(product, {
            Details: detail.Details,
          });
        }
      });
    });
    return (
      <ul>
        {products
          ?.sort((a, b) => a.Price - b.Price)
          ?.map((product) => (
            <li key={product.ID}>
              <p>Name: {product.Name} </p>
              <p>Description: {product.Description}</p>
              <p>ReleaseDate: {product.ReleaseDate} </p>
              <p>Price: {product.Price}</p>
              <p>Rating: {product.Rating}</p>
              <p>DiscontinuedDate: {product.DiscontinuedDate}</p>
              <p>Details: {product.Details ? product.Details : 'No details'}</p>
              <hr />
            </li>
          ))}
      </ul>
    );
  };

  if (!products && !productDetails) return null;

  return <div>{mergeAndSortProducts()}</div>;
}

export default App;
