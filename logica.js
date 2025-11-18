let carrito = [];

function agregarAlCarrito(nombre, precio) {
  carrito.push({ nombre, precio: Number(precio) });
  actualizarCarrito();
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1); // 🔹 Elimina el producto en esa posición
  actualizarCarrito();
}

function actualizarCarrito() {
  const lista = document.getElementById('lista-carrito');
  const total = document.getElementById('total');
  lista.innerHTML = '';
  let totalCompra = 0;

  carrito.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.nombre} - $${item.precio} MXN 
      <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">Eliminar</button>
    `;
    lista.appendChild(li);
    totalCompra += item.precio;
  });

  total.textContent = `Total: $${totalCompra.toFixed(2)} MXN`;

  renderizarBotonPayPal(totalCompra);
}

function renderizarBotonPayPal(total) {
  if (isNaN(total) || total <= 0) {
    document.getElementById('paypal-button-container').innerHTML = '';
    return;
  }

  document.getElementById('paypal-button-container').innerHTML = '';

  paypal.Buttons({
    createOrder: function (data, actions) {
      const totalUSD = (Number(total) / 18).toFixed(2);
      return actions.order.create({
        purchase_units: [{
          amount: { value: totalUSD, currency_code: 'USD' }
        }]
      });
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (details) {
        alert('Gracias por tu compra, ' + details.payer.name.given_name + '!');
        carrito = [];
        actualizarCarrito();
      });
    }
  }).render('#paypal-button-container');
}
