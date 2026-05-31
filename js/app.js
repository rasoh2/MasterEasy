/**
 * Master Easy Chile - Landing Page Corporativa Premium
 * Script de Interactividad, Validación y Animación
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Inicializar Lucide Icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // 2. Efecto de Cabecera al hacer Scroll
  const header = document.getElementById("main-header");

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Ejecutar al inicio por si carga a mitad de página

  // 3. Menú Móvil (Drawer)
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-item");

  const toggleMenu = () => {
    const isActive = mobileMenuToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
    mobileMenuToggle.setAttribute("aria-expanded", isActive);

    // Evitar el scroll del fondo cuando el menú está abierto
    document.body.style.overflow = isActive ? "hidden" : "";
  };

  mobileMenuToggle.addEventListener("click", toggleMenu);

  // Cerrar menú al hacer clic en un enlace
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("active")) {
        toggleMenu();
      }
    });
  });

  // 4. Lógica del Slider "Antes y Después"
  const initSlider = (sliderElement) => {
    if (!sliderElement) return;

    const beforeImageContainer = sliderElement.querySelector(".image-before");
    const handle = sliderElement.querySelector(".slider-handle");
    const beforeImage = beforeImageContainer.querySelector("img");

    let isDragging = false;

    // Ajustar el ancho de la imagen interna al redimensionar la ventana
    const resizeImage = () => {
      const width = sliderElement.offsetWidth;
      beforeImage.style.width = `${width}px`;
    };

    window.addEventListener("resize", resizeImage);
    // Inicializar el tamaño de la imagen interna
    setTimeout(resizeImage, 100);

    const moveSlider = (clientX) => {
      const rect = sliderElement.getBoundingClientRect();
      const positionX = clientX - rect.left;
      let percentage = (positionX / rect.width) * 100;

      // Restringir el porcentaje entre 0 y 100
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;

      // Aplicar posiciones a los elementos
      beforeImageContainer.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    };

    // Eventos del Mouse
    handle.addEventListener("mousedown", (e) => {
      isDragging = true;
      sliderElement.classList.add("dragging");
      e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      moveSlider(e.clientX);
    });

    window.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        sliderElement.classList.remove("dragging");
      }
    });

    // Eventos Táctiles (Móviles)
    handle.addEventListener("touchstart", (e) => {
      isDragging = true;
      sliderElement.classList.add("dragging");
    });

    window.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      if (e.touches.length > 0) {
        moveSlider(e.touches[0].clientX);
      }
    });

    window.addEventListener("touchend", () => {
      if (isDragging) {
        isDragging = false;
        sliderElement.classList.remove("dragging");
      }
    });
  };

  // Inicializar todos los sliders existentes en el DOM
  const allSliders = document.querySelectorAll(".comparison-slider");
  allSliders.forEach((slider) => initSlider(slider));

  // 5. Lógica de Pestañas (Tabs) de los Casos de Éxito
  const tabButtons = document.querySelectorAll(".tab-btn");
  const sliderCases = document.querySelectorAll(".slider-case");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");

      // Cambiar estados activos de botones
      tabButtons.forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-selected", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-selected", "true");

      // Cambiar el slider activo
      sliderCases.forEach((cases) => {
        cases.classList.remove("active");
        if (cases.id === targetId) {
          cases.classList.add("active");
          // Reinicializar el ajuste de imagen para el nuevo slider visible
          const activeSlider = cases.querySelector(".comparison-slider");
          if (activeSlider) {
            const beforeImg = activeSlider.querySelector(".image-before img");
            const beforeImgContainer =
              activeSlider.querySelector(".image-before");
            const handle = activeSlider.querySelector(".slider-handle");

            beforeImg.style.width = `${activeSlider.offsetWidth}px`;
            // Resetear slider al centro
            beforeImgContainer.style.width = "50%";
            handle.style.left = "50%";
          }
        }
      });
    });
  });

  // 6. Sistema de Alertas Snackbar (Material Design)
  const snackbar = document.getElementById("snackbar");
  const snackbarText = document.getElementById("snackbar-text");
  const snackbarIcon = document.getElementById("snackbar-icon");
  const snackbarAction = document.getElementById("snackbar-action");
  let snackbarTimeout = null;

  const showSnackbar = (message, type = "success") => {
    // Limpiar timeouts anteriores
    if (snackbarTimeout) clearTimeout(snackbarTimeout);

    // Configurar texto
    snackbarText.textContent = message;

    // Configurar clases visuales según tipo
    snackbar.className = "snackbar show";
    snackbarIcon.className = "snackbar-icon";

    if (type === "success") {
      snackbar.classList.add("success");
      snackbarIcon.classList.add("success");
      snackbarIcon.setAttribute("data-lucide", "check-circle2");
    } else if (type === "error") {
      snackbar.classList.add("error");
      snackbarIcon.classList.add("error");
      snackbarIcon.setAttribute("data-lucide", "alert-triangle");
    } else {
      snackbarIcon.setAttribute("data-lucide", "info");
    }

    // Re-dibujar iconos Lucide creados dinámicamente
    if (typeof lucide !== "undefined") {
      lucide.createIcons({
        attrs: {
          class: snackbarIcon.className,
        },
        nameAttr: "data-lucide",
      });
    }

    // Auto ocultar después de 5 segundos
    snackbarTimeout = setTimeout(() => {
      snackbar.classList.remove("show");
    }, 5000);
  };

  // Botón de cerrar snackbar manualmente
  snackbarAction.addEventListener("click", () => {
    snackbar.classList.remove("show");
    if (snackbarTimeout) clearTimeout(snackbarTimeout);
  });

  // 7. Validación de Formulario Corporativo en Tiempo Real
  const form = document.getElementById("lead-form");
  const nameInput = document.getElementById("form-name");
  const companyInput = document.getElementById("form-company");
  const emailInput = document.getElementById("form-email");
  const phoneInput = document.getElementById("form-phone");
  const serviceInput = document.getElementById("form-service");

  const validators = {
    name: (val) => val.trim().length >= 3,
    company: (val) => val.trim().length >= 2,
    email: (val) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(val.trim());
    },
    phone: (val) => {
      // Regex valida números chilenos básicos: +56 9 XXXX XXXX o 9 XXXX XXXX
      const cleanPhone = val.replace(/\s+/g, "");
      const phoneRegex = /^(\+?56)?9\d{8}$/;
      return phoneRegex.test(cleanPhone);
    },
    service: (val) => val !== null && val !== "",
  };

  const validateField = (input, validatorFunc, errorGroup) => {
    const isValid = validatorFunc(input.value);
    const group = input.closest(".input-group");

    if (!isValid) {
      group.classList.add("error");
    } else {
      group.classList.remove("error");
    }

    return isValid;
  };

  // Validadores dinámicos al perder el foco (blur)
  nameInput.addEventListener("blur", () =>
    validateField(nameInput, validators.name),
  );
  companyInput.addEventListener("blur", () =>
    validateField(companyInput, validators.company),
  );
  emailInput.addEventListener("blur", () =>
    validateField(emailInput, validators.email),
  );
  phoneInput.addEventListener("blur", () =>
    validateField(phoneInput, validators.phone),
  );
  serviceInput.addEventListener("change", () =>
    validateField(serviceInput, validators.service),
  );

  // Remover clase de error mientras se escribe
  const removeErrorOnInput = (input) => {
    input.addEventListener("input", () => {
      const group = input.closest(".input-group");
      group.classList.remove("error");
    });
  };

  removeErrorOnInput(nameInput);
  removeErrorOnInput(companyInput);
  removeErrorOnInput(emailInput);
  removeErrorOnInput(phoneInput);

  // 8. Envío de Formulario
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validar todos los campos antes de enviar
    const isNameValid = validateField(nameInput, validators.name);
    const isCompanyValid = validateField(companyInput, validators.company);
    const isEmailValid = validateField(emailInput, validators.email);
    const isPhoneValid = validateField(phoneInput, validators.phone);
    const isServiceValid = validateField(serviceInput, validators.service);

    if (
      isNameValid &&
      isCompanyValid &&
      isEmailValid &&
      isPhoneValid &&
      isServiceValid
    ) {
      const submitBtn = document.getElementById("submit-btn");
      const originalText = submitBtn.querySelector("span").textContent;

      // Simular carga / Procesando datos
      submitBtn.disabled = true;
      submitBtn.querySelector("span").textContent = "Procesando Solicitud...";

      const accessKey = "b977af86-2531-40bd-b4cb-39f2d33bdabc";

      const formData = {
        access_key: accessKey,
        subject: "Nuevo Lead: Solicitud de Inspección Técnica - InduSan",
        from_name: "InduSan Landing Web",
        Nombre: nameInput.value,
        Empresa: companyInput.value,
        Correo: emailInput.value,
        Telefono: phoneInput.value,
        Servicio: serviceInput.value,
      };

      fetch(`https://api.web3forms.com/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          showSnackbar(
            "Solicitud enviada con éxito. Un ingeniero sanitario se contactará en menos de 2 horas.",
            "success",
          );

          // Resetear formulario
          form.reset();
          submitBtn.disabled = false;
          submitBtn.querySelector("span").textContent = originalText;

          // Limpiar clases de error si quedaron
          document.querySelectorAll(".input-group").forEach((grp) => {
            grp.classList.remove("error");
          });
        })
        .catch((error) => {
          console.error("Error enviando formulario:", error);
          showSnackbar(
            "Hubo un error al enviar la solicitud. Por favor intenta nuevamente.",
            "error",
          );

          submitBtn.disabled = false;
          submitBtn.querySelector("span").textContent = originalText;
        });
    } else {
      showSnackbar(
        "Por favor, complete todos los campos requeridos correctamente.",
        "error",
      );

      // Hacer foco en el primer elemento con error
      const firstError = document.querySelector(
        ".input-group.error input, .input-group.error select",
      );
      if (firstError) firstError.focus();
    }
  });

  // 9. Intersection Observer para animaciones de entrada en Scroll
  const animateElements = document.querySelectorAll(".animate-on-scroll");

  if ("IntersectionObserver" in window) {
    const animationObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animated");
            observer.unobserve(entry.target); // Detener observación tras animar
          }
        });
      },
      {
        root: null, // viewport
        threshold: 0.15, // trigger when 15% of element is visible
        rootMargin: "0px 0px -50px 0px", // offset threshold bottom
      },
    );

    animateElements.forEach((elem) => animationObserver.observe(elem));
  } else {
    // Fallback en navegadores antiguos sin soporte de IntersectionObserver
    animateElements.forEach((elem) => elem.classList.add("animated"));
  }
});
