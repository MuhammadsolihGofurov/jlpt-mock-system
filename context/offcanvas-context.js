import {
  OffcanvasComponents,
  OffcanvasWrapper,
} from "@/components/custom/offcanvas";
import React, { createContext, useContext, useState } from "react";

const OffcanvasContext = createContext();
export const useOffcanvas = () => useContext(OffcanvasContext);

export const OffcanvasProvider = ({ children }) => {
  const [offcanvas, setOffcanvas] = useState({});
  const [offcanvasClosed, setOffcanvasClosed] = useState(null);

  /**
   * Offcanvas-ni ochish
   */
  const openOffcanvas = (key, props = {}, position = "start", size = "lg") => {
    if (!OffcanvasComponents[key]) {
      console.warn(`Offcanvas with key "${key}" does not exist`);
      return;
    }

    setOffcanvas((prev) => ({
      ...prev,
      [key]: {
        isOpen: true,
        props,
        position,
        size,
      },
    }));
  };

  /**
   * Offcanvas-ni yopish
   * Animatsiya ravon ishlashi uchun avval isOpen: false qilinadi,
   * so'ngra 300ms dan keyin (CSS transition tugagach) DOM dan o'chiriladi.
   */
  const closeOffcanvas = (key, data = null) => {
    // 1. Animatsiyani boshlash (CSS translate ishga tushadi)
    setOffcanvas((prev) => ({
      ...prev,
      [key]: { ...prev[key], isOpen: false },
    }));

    if (data) setOffcanvasClosed(data);

    // 2. Animatsiya tugagach, komponentni xotiradan/DOMdan butunlay o'chirish
    setTimeout(() => {
      setOffcanvas((prev) => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
      setOffcanvasClosed(null);
    }, 300); // 300ms — bu OffcanvasWrapper dagi duration-300 ga mos kelishi kerak
  };

  return (
    <OffcanvasContext.Provider
      value={{ openOffcanvas, closeOffcanvas, offcanvasClosed }}
    >
      {children}

      {/* Diqqat: offcanvasItem.isOpen dan qat'iy nazar map qilamiz.
          Agar isOpen: false bo'lsa ham, OffcanvasWrapper ichidagi 
          "show" prop'i orqali yopilish animatsiyasi sodir bo'ladi.
      */}
      {Object.entries(offcanvas).map(([key, offcanvasItem]) => {
        const Component = OffcanvasComponents[key];

        return (
          <OffcanvasWrapper
            key={key}
            position={offcanvasItem.position}
            size={offcanvasItem.size}
            show={offcanvasItem.isOpen}
            onClose={() => closeOffcanvas(key)}
          >
            <Component
              {...offcanvasItem.props}
              // Komponent ichidan ham yopish imkoniyati uchun
              closeOffcanvas={(data) => closeOffcanvas(key, data)}
            />
          </OffcanvasWrapper>
        );
      })}
    </OffcanvasContext.Provider>
  );
};
