import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import ProductList from "./ProductList";
import CartModal from "./CartModal";
import "./MenuScreen.css";
import { isMobile } from "react-device-detect";
import useWindowSize from "../utils/useWindowSize";

const MenuScreen = () => {
  const { width } = useWindowSize();
  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80); // Cambia el estado al hacer scroll
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Cargar carrito desde localStorage
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const handleGoToCart = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddToCart = (product, quantity, selectedExtras) => {
    setCart((prevCart) => {
      const newCartItem = {
        ...product,
        quantity,
        selectedExtras,
      };

      const existingProductIndex = prevCart.findIndex(
        (item) =>
          item.id === product.id &&
          JSON.stringify(item.selectedExtras) === JSON.stringify(selectedExtras)
      );

      if (existingProductIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex] = {
          ...updatedCart[existingProductIndex],
          quantity: updatedCart[existingProductIndex].quantity + quantity,
        };
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      } else {
        const updatedCart = [...prevCart, newCartItem];
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      }
    });
  };

  if (!isMobile && width > 650) {
    return (
      <div>
        <p>Esta aplicación solo está disponible para dispositivos móviles.</p>
      </div>
    );
  }

  return (
    <div className="menu-screen">
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <img src={logo} alt="Logo" className="logo-background" />
        <div className="header-content">
          <div className="welcome-wrapper">
            <h1 className="welcome-text">
              {localStorage.getItem("nombre") || "Invitado"}
            </h1>
          </div>
          <button className="cart-button" onClick={handleGoToCart}>
            <i className="fas fa-shopping-cart cart-icon"></i>
          </button>
        </div>
      </header>
      <main>
        <ProductList onAddToCart={handleAddToCart} />
      </main>
      {isModalOpen && <CartModal cart={cart} onClose={closeModal} />}
    </div>
  );
};

export default MenuScreen;
