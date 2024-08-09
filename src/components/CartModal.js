import React, { useEffect, useState } from "react";
import "./CartModal.css";
import categorias from "../data/categorias.json"; // Importa el archivo JSON

const CartModal = ({ cart, onClose }) => {
  const [localCart, setLocalCart] = useState(cart);

  // Mapa para acceder rápidamente a los nombres de las categorías
  const categoryMap = categorias.reduce((map, category) => {
    map[category.id] = category.nombre;
    return map;
  }, {});

  useEffect(() => {
    // Añadir clase para bloquear el scroll del fondo
    document.body.classList.add("modal-open");

    // Limpiar cuando el componente se desmonte
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  useEffect(() => {
    // Sincronizar el carrito local con el carrito pasado como prop
    setLocalCart(cart);
  }, [cart]);

  const getUniqueKey = (item, index) => {
    // Crea una clave única combinando id del producto, los extras seleccionados y el índice
    return `${item.id}-${item.selectedExtras.join("-")}-${
      item.quantity
    }-${index}`;
  };

  const getTotalPrice = (item) => {
    const extrasCount = item.selectedExtras.length;
    const extrasCost =
      (item.costo_extras || 0) *
      Math.ceil(extrasCount / (item.extras_seleccionables || 1));
    return (item.precio + extrasCost) * item.quantity;
  };

  const getGrandTotal = () => {
    return localCart.reduce((total, item) => total + getTotalPrice(item), 0);
  };

  const handleQuantityChange = (itemKey, change) => {
    setLocalCart((prevCart) => {
      const updatedCart = prevCart.map((item, index) => {
        const uniqueKey = getUniqueKey(item, index);
        if (uniqueKey === itemKey) {
          return {
            ...item,
            quantity: Math.max(1, item.quantity + change),
          };
        }
        return item;
      });
      // Actualizar el localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const handleRemove = (itemKey) => {
    setLocalCart((prevCart) => {
      const updatedCart = prevCart.filter((item, index) => {
        const uniqueKey = getUniqueKey(item, index);
        return uniqueKey !== itemKey;
      });
      // Actualizar el localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const formatMessage = () => {
    const today = new Date();
    const date = today.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const time = today.toLocaleTimeString("es-ES");
    const userName = localStorage.getItem("nombre") || "Invitado";
    const userDirection = localStorage.getItem("direccion") || "Conocido";
    let message = `¡Hola! Soy *${userName}* quiero hacer el siguiente pedido:\n\n`;
    message += `***** DETALLE DE LA ORDEN *****\n`;
    message += `*Fecha:* ${date}\n`;
    message += `*Hora:* ${time}\n\n`;

    // Agrupar productos por categoría
    const groupedItems = localCart.reduce((acc, item) => {
      const categoryId = item.categoria || "Sin Categoría";
      const categoryName = categoryMap[categoryId] || "Sin Categoría";
      if (!acc[categoryName]) acc[categoryName] = [];
      acc[categoryName].push(item);
      return acc;
    }, {});

    message += `***PEDIDO***\n`;
    Object.keys(groupedItems).forEach((category) => {
      message += `    ${category}:\n`;
      groupedItems[category].forEach((item) => {
        const extrasInfo = item.selectedExtras.length > 0 ? " (+ extras)" : "";
        message += `        ${item.nombre}${extrasInfo}: ${
          item.quantity
        } = $${getTotalPrice(item)}\n`;
      });
      message += `\n`;
    });

    const subtotal = getGrandTotal();
    message += `***\n*Enviar a: ${userDirection}* \n\n*Subtotal: $${subtotal}*\n*Envío: Gratis*\n*Total de la orden: $${subtotal}*`;

    return message;
  };

  const handleSendMessage = () => {
    const message = encodeURIComponent(formatMessage());
    const phoneNumber = "9681123673"; // Reemplaza con el número de teléfono de WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
          <h2 className="title-model">Mi pedido</h2>
        </div>
        <div className="modal-body">
          {localCart.length === 0 ? (
            <p>El carrito está vacío.</p>
          ) : (
            <>
              <ul className="cart-items">
                {localCart.map((item, index) => (
                  <li key={getUniqueKey(item, index)} className="cart-item">
                    <div className="cart-item-header">
                      <span className="product-name">{item.nombre}</span>
                      <span className="product-price">${item.precio}</span>
                    </div>
                    <div className="product-ingredients">
                      <span>{item.ingredientes}</span>
                      {item.selectedExtras.length > 0 && (
                        <div className="product-extras">
                          <strong>Extras: (${item.costo_extras})</strong>
                          <ul>
                            {item.selectedExtras.map((extra, idx) => (
                              <li key={idx}>{extra}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="cart-item-footer">
                      <div className="cart-item-actions">
                        <div className="quantity-controls">
                          <button
                            className="quantity-button"
                            onClick={() =>
                              handleQuantityChange(
                                getUniqueKey(item, index),
                                -1
                              )
                            }
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button
                            className="quantity-button"
                            onClick={() =>
                              handleQuantityChange(getUniqueKey(item, index), 1)
                            }
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="delete-button"
                          onClick={() =>
                            handleRemove(getUniqueKey(item, index))
                          }
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
                      <span className="cart-item-total">
                        ${getTotalPrice(item)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cart-total">
                Total:
                <span>${getGrandTotal()}</span>
              </div>
              <button
                className="send-whatsapp-button"
                onClick={handleSendMessage}
              >
                <i className="fab fa-whatsapp"></i>
                ENVIAR PEDIDO AHORA
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
