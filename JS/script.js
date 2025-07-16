// Devuelve el prefijo correcto según la ruta: "" si está en raíz, "../" si está en carpeta
function rutaBase() {
    // window.location.pathname = "/Postres/Dulces.html"
    const partes = window.location.pathname.split('/');
    // Ej: ["", "Postres", "Dulces.html"] -> longitud 3 (raíz sería 2)
    return partes.length > 2 ? "../" : "";
}


//---- Menu Hamburger -------
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// --- Carrito ---
function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function obtenerCarrito() {
  return JSON.parse(localStorage.getItem('carrito')) || [];
}

document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll(".agregar-carrito").forEach(boton => {
    boton.addEventListener("click", function() {
      const nombre = this.getAttribute("data-nombre");
      const precio = parseFloat(this.getAttribute("data-precio"));
      const img = this.getAttribute("data-img");

      let cantidad = prompt(`¿Cuántos "${nombre}" deseas agregar?`, "1");
      cantidad = parseInt(cantidad);

      if (isNaN(cantidad) || cantidad <= 0) {
        alert("Por favor, ingresa una cantidad válida.");
        return;
      }

      let carrito = obtenerCarrito();
      let existente = carrito.find(item => item.nombre === nombre);

      if (existente) {
        existente.cantidad += cantidad;
      } else {
        carrito.push({ nombre, precio, cantidad, img });
      }

      guardarCarrito(carrito);
      alert(`¡Agregaste ${cantidad} "${nombre}" al carrito!`);
    });
  });
});


// ------ Mostrar el carrito ------

function obtenerCarrito() {
  return JSON.parse(localStorage.getItem('carrito')) || [];
}

function mostrarCarrito() {
  const carrito = obtenerCarrito();
  const contenedor = document.getElementById('carrito-contenido');
  const totalSpan = document.getElementById('total');

  contenedor.innerHTML = '';
  let total = 0;

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>El carrito está vacío.</p>";
    totalSpan.textContent = "0.00";
    return;
  }
  // Cabecera tipo tabla
  const cabecera = document.createElement('div');
  cabecera.classList.add('tabla-cabecera');
  cabecera.innerHTML = `
    <span class="col-nombre">Producto</span>
    <span class="col-info">Cantidad</span>
    <span class="col-info">Precio</span>
    <span class="col-info">Subtotal</span>
    <span class="col-accion"></span>
  `;
  contenedor.appendChild(cabecera);

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const fila = document.createElement('div');
    fila.classList.add('tabla-producto');
    fila.innerHTML = `
      <div class="col-nombre">
        <img src="${item.img}" alt="${item.nombre}" class="img-producto-carrito">
        <span>${item.nombre}</span>
      </div>
      <div class="col-info cantidad-control" data-nombre="${item.nombre}">
        <button class="btn-cantidad restar">−</button>
        <span class="valor-cantidad">${item.cantidad}</span>
        <button class="btn-cantidad sumar">+</button>
      </div>

      <div class="col-info">S/${item.precio.toFixed(2)}</div>
      <div class="col-info">S/${subtotal.toFixed(2)}</div>
      <div class="col-accion">
        <button class="eliminar-item" data-nombre="${item.nombre}" title="Eliminar">
        <img src="../img/eliminar.png" class="icono-eliminar"
        </button>
      </div>
      
      
    `;
    contenedor.appendChild(fila);
  });

  totalSpan.textContent = total.toFixed(2);


  // Eventos de eliminar por producto
  document.querySelectorAll('.eliminar-item').forEach(boton => {
    boton.addEventListener('click', function () {
      const nombre = this.getAttribute('data-nombre');
      let carrito = obtenerCarrito();
      carrito = carrito.filter(item => item.nombre !== nombre);
      guardarCarrito(carrito);
      mostrarCarrito();
    });
  });

  // Aumentar o disminuir cantidad
  document.querySelectorAll('.btn-cantidad').forEach(btn => {
    btn.addEventListener('click', function () {
      const esSumar = this.classList.contains('sumar');
      const nombre = this.closest('.cantidad-control').getAttribute('data-nombre');

      let carrito = obtenerCarrito();
      let producto = carrito.find(item => item.nombre === nombre);

      if (producto) {
        if (esSumar) {
          producto.cantidad++;
        } else {
          if (producto.cantidad > 1) {
            producto.cantidad--;
          } else {
            // Si llega a 1 y presiona "-";
            return;
          }
        }
        guardarCarrito(carrito);
        mostrarCarrito();
      }
    });
  });

  totalSpan.textContent = total.toFixed(2);
}

// ----- Botón para vaciar el carrito ------
function vaciarCarrito() {
  localStorage.removeItem('carrito');
  mostrarCarrito();
}

document.addEventListener("DOMContentLoaded", mostrarCarrito);

// --- UTILIDADES LOCALSTORAGE ---
function getUsuarios() {
  return JSON.parse(localStorage.getItem('usuariosDolcezza') || '[]');
}

function setUsuarios(usuarios) {
  localStorage.setItem('usuariosDolcezza', JSON.stringify(usuarios));
}

function guardarUsuarioActual(usuario) {
  localStorage.setItem('usuarioActualDolcezza', JSON.stringify(usuario));
}

function obtenerUsuarioActual() {
  return JSON.parse(localStorage.getItem('usuarioActualDolcezza'));
}

function cerrarSesion() {
  localStorage.removeItem('usuarioActualDolcezza');
  window.location.reload(); // Refresca para aplicar cambios en el menú
}

// --- REGISTRO ---
const formRegistro = document.getElementById('form-registro');
if(formRegistro) {
  formRegistro.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('reg-email').value.trim();
    const nombres = document.getElementById('reg-nombre').value.trim();
    const apellidos = document.getElementById('reg-apellido').value.trim();
    const pass = document.getElementById('reg-pass').value;
        
    let usuarios = getUsuarios();
    if (usuarios.find(u => u.email === email)) {
      alert('Ya existe un usuario con ese email');
      return;
    }
    const nuevoUsuario = { email, nombres, apellidos, pass };
    usuarios.push(nuevoUsuario);
    setUsuarios(usuarios);
    alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
    window.location.href = "login.html";
  });
}

// --- LOGIN ---
const formLogin = document.getElementById('form-login');
if(formLogin) {
  formLogin.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-pass').value;
    let usuarios = getUsuarios();
    const usuario = usuarios.find(u => u.email === email && u.pass === pass);
    if (!usuario) {
      alert('Usuario o contraseña incorrectos');
      return;
    }
    guardarUsuarioActual(usuario);
    window.location.href = "index.html"; // o donde quieras redirigir después de login
  });
}

// --- MENÚ USUARIO EN HEADER ---
function actualizarMenuUsuario() {
  const usuario = obtenerUsuarioActual();
  const userMenu = document.getElementById('user-menu');
  const submenu = document.getElementById('user-dropdown');
  const base = rutaBase();
  if (userMenu && submenu) {
    if (usuario) {
      userMenu.innerHTML = `
        <img src="${base}img/icon/usuario.png" alt="userIMG" class="imgUser">
        ${usuario.nombres.split(" ")[0]} ▾
        `;
      submenu.innerHTML = `
        <li><a href="#" id="cerrar-sesion-link">Cerrar Sesión</a></li>
        `;
      document.getElementById('cerrar-sesion-link').onclick = function(e) {
        e.preventDefault();
        cerrarSesion();
      };
    } else {
      userMenu.innerHTML = `
        <img src="${base}img/icon/usuario.png" alt="userIMG" class="imgUser">
        Iniciar Sesión ▾
      `;
      submenu.innerHTML = `
        <li><a href="${base}registro.html">Registrar</a></li>
        <li><a href="${base}login.html">Iniciar sesión</a></li>
      `;
    }
  }
}
document.addEventListener('DOMContentLoaded', actualizarMenuUsuario);

// ----- Modal-Tarjeta -------
function pagar() {
  const metodo = document.querySelector('input[name="pago"]:checked');
  if (!metodo) {
    alert("Por favor selecciona un método de pago");
    return;
  }

  if (metodo.value === "tarjeta") {
    abrirModal('modal-tarjeta');
    document.getElementById("form-tarjeta").reset();
  } else if (metodo.value === "yape") {
    abrirModal('modal-yape');
  }
}

// ----- Abrir/cerrar modal -------
function abrirModal(id) {
  document.getElementById(id).style.display = "flex";
}
function cerrarModal(id) {
  document.getElementById(id).style.display = "none";
}

// Validación del form Tarjeta
document.addEventListener("DOMContentLoaded", function(){
  document.getElementById("form-tarjeta").onsubmit = function(e) {
    e.preventDefault();

    alert("Pago realizado con éxito");
    cerrarModal('modal-tarjeta');
    vaciarCarrito();
  };
});

// --- Modal del Producto ---
document.querySelectorAll(".img-producto").forEach(img => {
  img.addEventListener("click", function() {
    // Info dentro de la imagen
    const nombre = this.getAttribute("data-nombre");
    const precio = parseFloat(this.getAttribute("data-precio"));
    const imgSrc = this.getAttribute("data-img");
    const descripcion = this.getAttribute("data-descripcion");

    document.getElementById("modal-img-producto").src = imgSrc;
    document.getElementById("modal-img-producto").alt = nombre;
    document.getElementById("modal-nombre-producto").innerText = nombre;
    document.getElementById("modal-desc-producto").innerText = descripcion;
    document.getElementById("modal-precio-producto").innerText = `S/${precio.toFixed(2)}`;

    // Guarda datos para el botón
    const btn = document.getElementById("modal-btn-carrito");
    btn.setAttribute("data-nombre", nombre);
    btn.setAttribute("data-precio", precio);
    btn.setAttribute("data-img", imgSrc);

    document.getElementById("modal-producto").style.display = "flex";
  });
});

// Cerrar el modal
function cerrarModalProducto() {
  document.getElementById("modal-producto").style.display = "none";
}

// --- Botón "Agregar al carrito" dentro del modal ---
document.getElementById("modal-btn-carrito").addEventListener("click", function() {
  const nombre = this.getAttribute("data-nombre");
  const precio = parseFloat(this.getAttribute("data-precio"));
  const img = this.getAttribute("data-img");

  let cantidad = prompt(`¿Cuántos "${nombre}" deseas agregar?`, "1");
  cantidad = parseInt(cantidad);

  if (isNaN(cantidad) || cantidad <= 0) {
    alert("Por favor, ingresa una cantidad válida.");
    return;
  }

  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  let existente = carrito.find(item => item.nombre === nombre);

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({ nombre, precio, cantidad, img });
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
  alert(`¡Agregaste ${cantidad} "${nombre}" al carrito!`);
  cerrarModalProducto();
});

// -------------- Carrusel de Productos --------------

let current = 0;
const items = document.querySelectorAll('.carousel-item');
let interval = null;

// Movil/Tablet
function isMobile() {
  return window.innerWidth <= 900;
}

// Evento para pantalla pequeñas
function addMobileClick() {
  items.forEach(item => {
    item.onclick = null;
    if (item.classList.contains('active') && isMobile()) {
      item.onclick = function(e) {
        const bounds = this.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        if (x < bounds.width / 2) {
          // Click lado izquierdo
          resetAutoCarousel();
          moveCarousel(-1);
        } else {
          // Click lado derecho
          resetAutoCarousel();
          moveCarousel(1);
        }
      }
      item.style.cursor = "pointer";
    }
  });
}

// Carrusel para escritorio
function addDesktopClick() {
  items.forEach((item, idx) => {
    item.onclick = null;
    item.style.cursor = "default";
    if (!isMobile()) {
      if (idx === (current - 1 + items.length) % items.length) {
        item.onclick = () => {
          resetAutoCarousel();
          moveCarousel(-1);
        };
        item.style.cursor = "pointer";
      }
      else if (idx === (current + 1) % items.length) {
        item.onclick = () => {
          resetAutoCarousel();
          moveCarousel(1);
        };
        item.style.cursor = "pointer";
      }
    }
  });
}

function updateCarousel() {
  items.forEach((item, idx) => {
    item.classList.remove('active', 'left', 'right', 'hidden');
    if (idx === current) {
      item.classList.add('active');
    } else if (idx === (current - 1 + items.length) % items.length) {
      item.classList.add('left');
    } else if (idx === (current + 1) % items.length) {
      item.classList.add('right');
    } else {
      item.classList.add('hidden');
    }
  });

  if (isMobile()) {
    addMobileClick();
  } else {
    addDesktopClick();
  }
}

// Animación automática
function moveCarousel(dir) {
  current = (current + dir + items.length) % items.length;
  updateCarousel();
}

function autoCarousel() {
  interval = setInterval(() => {
    moveCarousel(1);
  }, 30000);
}

function resetAutoCarousel() {
  clearInterval(interval);
  autoCarousel();
}

// Detecta cambio de tamaño
window.addEventListener('resize', updateCarousel);

updateCarousel();
autoCarousel();
actualizarMenuUsuario();