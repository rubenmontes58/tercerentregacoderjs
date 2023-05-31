import productos from './productos.js';

// Variables globales
let carrito = [];
let total = 0;

// crear las tarjetas de los productos con map
const tarjetas = productos.map(producto => {
  return `
    <div class="card" style="width: 12rem;">
      <img class="card-img-top" src="${producto.img}" alt="${producto.nombre}">
      <div class="card-body">
        <h5 class="card-title">${producto.nombre}</h5>
        <p class="card-text">${producto.descripcion}</p>
        <p class="card-text">${producto.precio}</p>         
      </div>
      <button class="btn btn-primary agregar-carrito" data-nombre="${producto.nombre}" data-precio="${producto.precio}">Agregar al carrito</button>
    </div>
  `;
});

// agregar las tarjetas al html y ver todas con join
const tarjetasProducto = document.getElementById('tarjetas-producto');
tarjetasProducto.innerHTML = tarjetas.join('');

// obtener los elementos del html
const detalleCarrito = document.querySelector('#detalle-carrito');
const vaciarCarrito = document.getElementById('vaciar-carrito');
const totalCarrito = document.getElementById('total-carrito');
const efectivo = document.getElementById('efectivo');
const transferencia = document.getElementById('transferencia');
const tarjeta = document.getElementById('tarjeta');
const botonEnvio = document.getElementById('calcular-envio');

// evento clic del botón vaciar carrito
vaciarCarrito.addEventListener('click', () => {
  carrito.length = 0;  
  total = 0;  
  renderizarCarrito();
  renderizarEnvio('', 0);  
});

// evento clic de los botones agregar 
const botones = document.querySelectorAll('.agregar-carrito');
botones.forEach(boton => {
  boton.addEventListener('click', () => {
    const producto = obtenerProducto(boton);       
    agregarCarrito(producto);
    calcularTotal();
    renderizarCarrito();       
  }); 
});

// cambios en los elementos del metodo de pago
efectivo.addEventListener('change', () => {
  // Aplicar un descuento del 10% si se paga en efectivo
  const descuento = total * 0.10;
  const totalConDescuento = total - descuento;

  // actualizar el valor del carrito 
  const totalElemento = document.getElementById('total');
  totalElemento.innerText = `Total: $${totalConDescuento}`;

  // Mostrar los detalles del pago
  const detallesPago = document.getElementById('detallesPago');
  detallesPago.innerText = `Método de pago: Efectivo o tarjeta débito `;
  const descuentoEfectivo = document.getElementById('descuentoEfectivo');
  descuentoEfectivo.innerText = `Descuento: $${descuento}`;
});

transferencia.addEventListener('change', () => {
  // 10% si se paga por transferencia
  const descuento = total * 0.10;
  const totalConDescuento = total - descuento;

  // actualizar el valor del carrito
  const totalElemento = document.getElementById('total');
  totalElemento.innerText = `Total: $${totalConDescuento}`;

  // muestra los detalles del pago con transferencia
  const detallesPago = document.getElementById('detallesPago');
  detallesPago.innerText = `Método de pago: Transferencia bancaria`;
 
  descuentoTransferencia.innerText = `Descuento: $${descuento}`;
});

tarjeta.addEventListener('change', () => {
  // toma el valor total del carrito y suma 60%
  const recargo = total * 0.60;
  const totalConRecargo = total + recargo;

  // calcular el valor de cada cuota en 12 pagos 
  const valorCuota = totalConRecargo / 12;

  // actualizarel valor del carrito 
  const totalElemento = document.getElementById('total');
  totalElemento.innerText = `Total: $${totalConRecargo} en 12 cuotas de $${valorCuota.toFixed(2)}`;

  // Muestra detalles del pago con tarjeta
  const detallesPago = document.getElementById('detallesPago');
  detallesPago.innerText = `Método de pago: Tarjeta de crédito`;
  const recargoTarjeta = document.getElementById('recargoTarjeta');
  recargoTarjeta.innerText = `Recargo: $${recargo}`;
});

// evento clic del botón calcular envio y sweet alert
function calcularEnvio() { 
  if (total >= 30000) {
    Swal.fire(
      '¡Felicidades!',
      'Tienes envío gratis!',
      'success'
    )(" ");
  } else {
    Swal.fire(
      'Tienes un costo extra de $6000 en concepto de transporte!',
      'Envio gratis a partir de $30000, sigue comprando',
      'warning'
    )(" ");
    total += 6000;  
  }
}

botonEnvio.addEventListener('click', calcularEnvio );

// obtener los datos del producto a partir del botón agregar al carrito
function obtenerProducto(boton) {
  const producto = {    
    nombre: boton.dataset.nombre,
    precio:(boton.dataset.precio), 

  }
  return producto; 
}

// agregar un producto al carrito
function agregarCarrito(producto) {
  const existe = carrito.some(prod => prod.nombre === producto.nombre);

  if(existe){
    const prod = carrito.map(prod => {
      if(prod.nombre === producto.nombre){
        prod.cantidad++;       
        return prod;   
      }else{
        return prod;
      }
    })
    carrito = prod;
  }else{
    producto.cantidad = 1;       
    carrito.push(producto);   
  }

  // guardar carrito en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// calcular el total del carrito
function calcularTotal() {
  total = 0;
  carrito.forEach(producto => {
    total += producto.precio * producto.cantidad;
  }) 
  totalCarrito.innerText = `Total: $${total}`;
}

// eliminar un producto del carrito
function eliminarProducto(nombre) {
  carrito = carrito.filter(producto => producto.nombre !== nombre);
}

// obtener los datos del producto a partir del botón eliminar
function obtenerProductoeliminar(boton) {
  const producto = {
    nombre: boton.dataset.nombre
  }
  return producto;
} 

// renderizar el carrito 
function renderizarCarrito(){  
  detalleCarrito.innerHTML = '';
  carrito.forEach(producto => {
    const col = document.createElement('tr');
    col.innerHTML = `
      <td>Tipo de Producto: ${producto.nombre}</td>
      <td>Precio: $${producto.precio}</td>
      <td>Cantidad: ${producto.cantidad}</td>
      <td><button class="btn btn-primary eliminar" data-nombre="${producto.nombre}">Eliminar</button></td>
    `; 
    detalleCarrito.appendChild(col);
  });

  // evento clic del boton eliminar
  const botoneseliminar = document.querySelectorAll('.eliminar');
  botoneseliminar.forEach(boton => {
    boton.addEventListener('click', () => {
      const producto = obtenerProductoeliminar(boton);
      eliminarProducto(producto.nombre);
      calcularTotal();
      renderizarCarrito();
    })
  })
}

// renderizar tipo de envio
function renderizarEnvio(mensaje, costo) {
  const envioElemento = document.getElementById('envio');
  if (mensaje === '') {
    envioElemento.innerText = '';
  } else {
    envioElemento.innerText = `${mensaje}: $${costo}`;
  }
}

// cargar el carrito desde localStorage
if(localStorage.getItem('carrito')) {
  carrito = JSON.parse(localStorage.getItem('carrito'));
  renderizarCarrito();
}





