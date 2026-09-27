# Simulador de Home Banking 🏦

¡Hola! Soy Ignacio. Este es el repositorio de mi proyecto para el curso de JavaScript (Pre-Entrega 10). 

Es un simulador de un panel de gestión bancaria donde se pueden administrar distintas cuentas, ver los saldos totales, filtrar clientes y crear cuentas nuevas. 

## ¿Qué conceptos apliqué acá?

Para esta entrega le metí varias cosas nuevas que fuimos viendo en la cursada:

- **Fetch y Async/Await:** Los datos iniciales de las cuentas ya no están clavados en el código, sino que el simulador los "pide" de un archivo local `data.json` simulando cómo funcionaría con una API real de un banco.
- **LocalStorage:** Todo lo que hagas (agregar o borrar cuentas) se guarda en el navegador. Si apretás F5 o cerrás la pestaña, no perdés nada.
- **Librería Toastify:** Chau a los `alert` nativos del navegador que son feos. Usé Toastify para que salgan notificaciones flotantes de colores cuando creás una cuenta, borrás alguien o hay un error.
- **DOM y Eventos:** Toda la interacción es gráfica mediante botones y formularios. También hay un buscador que filtra las tarjetas en tiempo real escribiendo desde el teclado.
- **Métodos de Array (HOF):** Usé `filter`, `map`, `reduce` y `find` para hacer los filtros rápidos (ej. ver solo cuentas activas) y para calcular la suma de toda la plata que tiene el banco.

## ¿Cómo hacerlo andar?

Como el proyecto usa `fetch` para traer los datos del JSON, si abrís el archivo `index.html` con doble clic directo te puede llegar a tirar un error de CORS en la consola (cosas del navegador). 

Lo mejor es abrir la carpeta en VS Code y correrlo usando la extensión **Live Server**.

---
*Cualquier feedback o sugerencia es súper bienvenido, sigo aprendiendo! 🚀*