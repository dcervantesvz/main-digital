import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import ProductList from "./ProductList";
import CartModal from "./CartModal";
import ProfileModal from "./ProfileModal";
import "./MenuScreen.css";
import { isMobile } from "react-device-detect";
import useWindowSize from "../utils/useWindowSize";

const MenuScreen = () => {
  const { width } = useWindowSize();
  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // Nuevo estado para el modal de perfil
  const [cart, setCart] = useState([]);
  const [isLogoVisible, setIsLogoVisible] = useState(false);

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

  useEffect(() => {
    setIsLogoVisible(true);
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

  const handleGoToProfile = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  if (!isMobile && width > 650) {
    return (
      <div>
        <p>Esta aplicación solo está disponible para dispositivos móviles.</p>
      </div>
    );
  }

  return (
    <div className={`menu-screen ${isLogoVisible ? "show-logo" : ""}`}>
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <img
          src={logo}
          alt="Logo"
          className={`logo-background ${isLogoVisible ? "animate" : ""}`}
        />
        <div className="header-content">
          <button className="profile-button" onClick={handleGoToProfile}>
            <i className="fas fa-user"></i>
          </button>
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
      {isProfileModalOpen && <ProfileModal onClose={closeProfileModal} />}{" "}
    </div>
  );
};

export default MenuScreen;
