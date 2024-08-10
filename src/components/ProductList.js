// src/components/ProductList.js
import React, { useState, useEffect } from "react";
import productData from "../data/productos.json";
import categoryData from "../data/categorias.json";
import "./ProductList.css";

const ProductList = ({ onAddToCart }) => {
  const [productDetails, setProductDetails] = useState([]);
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Cargar productos y categorías
    setProductDetails(
      productData.map((product) => ({
        ...product,
        quantity: 1,
        selectedExtras: [],
      }))
    );
    setCategories(categoryData);

    // Cargar carrito desde localStorage
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    // Guardar carrito en localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const categorizedProducts = productDetails.reduce((acc, product) => {
    const category = categories.find(
      (cat) => cat.id === parseInt(product.categoria)
    );
    if (category) {
      if (!acc[category.nombre]) {
        acc[category.nombre] = [];
      }
      acc[category.nombre].push(product);
    }
    return acc;
  }, {});

  const handleQuantityChange = (productId, change) => {
    setProductDetails((prevDetails) =>
      prevDetails.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const handleExtraChange = (productId, extra, isChecked) => {
    setProductDetails((prevDetails) =>
      prevDetails.map((item) =>
        item.id === productId
          ? {
              ...item,
              selectedExtras: isChecked
                ? item.selectedExtras.length < (item.extras_seleccionables || 0)
                  ? [...item.selectedExtras, extra]
                  : item.selectedExtras
                : item.selectedExtras.filter((e) => e !== extra),
            }
          : item
      )
    );
  };

  const handleAddToCart = (product, quantity, selectedExtras) => {
    onAddToCart(product, quantity, selectedExtras); // Usar la prop para añadir al carrito
    setNotification(`"${product.nombre}" se agregó correctamente.`);
    setTimeout(() => setNotification(null), 3000);
  };

  const getTotalPrice = (product, quantity, selectedExtras) => {
    const extrasCount = selectedExtras.length;
    const extrasCost =
      (product.costo_extras || 0) *
      Math.ceil(extrasCount / (product.extras_seleccionables || 1));
    return (product.precio + extrasCost) * quantity;
  };

  const renderExtras = (product) => {
    if (!product.extras) return null;

    const selectedExtras =
      productDetails.find((item) => item.id === product.id)?.selectedExtras ||
      [];

    return (
      <div className="extras">
        <h3>
          Extras (max {product.extras_seleccionables}) (+${product.costo_extras}
          ):
        </h3>
        <ul>
          {product.extras.map((extra, index) => (
            <li key={index}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedExtras.includes(extra)}
                  disabled={
                    selectedExtras.length >=
                      (product.extras_seleccionables || 0) &&
                    !selectedExtras.includes(extra)
                  }
                  onChange={(e) =>
                    handleExtraChange(product.id, extra, e.target.checked)
                  }
                />
                {extra}
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="product-list">
      {notification && <div className="notification">{notification}</div>}
      {Object.keys(categorizedProducts).map((category) => (
        <div key={category} className="category-section">
          <h2 className="category-title">{category}</h2>
          {categorizedProducts[category].map((product) => {
            const productDetail = productDetails.find(
              (item) => item.id === product.id
            );
            const quantity = productDetail ? productDetail.quantity : 1;
            const selectedExtras = productDetail
              ? productDetail.selectedExtras
              : [];

            return (
              <div key={product.id} className="product-item">
                <div className="product-details">
                  <h3 className="product-name">{product.nombre}</h3>
                  <p className="product-ingredients">{product.ingredientes}</p>
                  {renderExtras(product)}
                  <div className="product-footer">
                    <span className="product-price">
                      ${getTotalPrice(product, quantity, selectedExtras)}
                    </span>
                    <div className="quantity-controls">
                      <button
                        className="quantity-button"
                        onClick={() => handleQuantityChange(product.id, -1)}
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="quantity">{quantity}</span>
                      <button
                        className="quantity-button"
                        onClick={() => handleQuantityChange(product.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="add-to-cart-button"
                      onClick={() =>
                        handleAddToCart(product, quantity, selectedExtras)
                      }
                    >
                      <i className="fas fa-shopping-cart"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
