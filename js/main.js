class CuentaBancaria {
    constructor(numeroCuenta, titular, tipo, saldoInicial = 0, activa = true) {
        this.numeroCuenta = numeroCuenta;
        this.titular = titular;
        this.tipo = tipo; 
        this.saldo = Number(saldoInicial);
        this.activa = activa;
    }

    depositar(monto) {
        if (monto > 0) {
            this.saldo += monto;
            return true;
        }
        return false;
    }

    extraer(monto) {
        if (monto > 0 && monto <= this.saldo) {
            this.saldo -= monto;
            return true;
        }
        return false;
    }

    transferir(monto, cuentaDestino) {
        if (this.extraer(monto)) {
            cuentaDestino.depositar(monto);
            return true;
        }
        return false;
    }
}

let banco = [];
let proximoNumeroCuenta = 1;

const contenedorItems = document.getElementById("contenedor-items");
const formCuenta = document.getElementById("form-cuenta");
const inputTitular = document.getElementById("input-titular");
const selectTipo = document.getElementById("select-tipo");
const inputSaldo = document.getElementById("input-saldo");
const inputBusqueda = document.getElementById("input-busqueda");
const totalReservasElemento = document.getElementById("total-reservas");

const btnTodas = document.getElementById("btn-todas");
const btnCorrientes = document.getElementById("btn-corrientes");
const btnAhorro = document.getElementById("btn-ahorro");
const btnActivas = document.getElementById("btn-activas");
const btnInactivas = document.getElementById("btn-inactivas");
const btnPotenciales = document.getElementById("btn-potenciales");

function mostrarFeedback(mensaje, tipo = "exito") {
    const colores = {
        exito: "linear-gradient(to right, #16a34a, #22c55e)",
        error: "linear-gradient(to right, #b91c1c, #ef4444)",
        eliminado: "linear-gradient(to right, #b45309, #f59e0b)",
        info: "linear-gradient(to right, #1e3a8a, #3b82f6)"
    };

    Toastify({
        text: mensaje,
        duration: 3500,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
            background: colores[tipo],
            borderRadius: "8px",
            fontWeight: "500",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
        }
    }).showToast();
}

const sincronizarStorage = () => {
    localStorage.setItem("bancoApp_cuentas", JSON.stringify(banco));
};

function actualizarResumenBanco() {
    const totalReservas = banco.reduce((acumulador, cuenta) => acumulador + cuenta.saldo, 0);
    if (totalReservasElemento) {
        totalReservasElemento.textContent = `$${totalReservas.toFixed(2)}`;
    }
}

function renderizarCuentas(listaCuentas) {
    contenedorItems.innerHTML = "";

    if (listaCuentas.length === 0) {
        contenedorItems.innerHTML = `
            <div class="mensaje-vacio">
                <p>No se encontraron cuentas bancarias.</p>
            </div>
        `;
        return;
    }

    listaCuentas.forEach(cuenta => {
        const { numeroCuenta, titular, tipo, saldo, activa } = cuenta;
        const tarjeta = document.createElement("div");
        
        const claseEstado = activa ? "cuenta-activa" : "cuenta-inactiva";
        const estadoClaseBadge = activa ? "activa" : "inactiva";
        const estadoTexto = activa ? "Activa" : "Inactiva";

        tarjeta.className = `item-cuenta ${claseEstado}`;
        tarjeta.innerHTML = `
            <div class="cuenta-info">
                <h3>${titular}</h3>
                <p class="numero-cuenta">Cuenta N°: <strong>${numeroCuenta}</strong></p>
                <span class="etiqueta-tipo">${tipo}</span>
                <span class="estado-cuenta ${estadoClaseBadge}">${estadoTexto}</span>
                <p class="saldo-cuenta">$${saldo.toFixed(2)}</p>
            </div>
            <div class="cuenta-acciones">
                <button class="btn btn-danger btn-eliminar" data-id="${numeroCuenta}">Eliminar</button>
            </div>
        `;

        contenedorItems.appendChild(tarjeta);
    });

    actualizarResumenBanco();
    asignarEventosBotonesEliminar();
}

async function inicializarApp() {
    try {
        mostrarFeedback("⏳ Conectando con el servidor...", "info");
        
        const cuentasEnStorage = JSON.parse(localStorage.getItem("bancoApp_cuentas"));
        
        if (cuentasEnStorage && cuentasEnStorage.length > 0) {
            banco = cuentasEnStorage.map(c => new CuentaBancaria(c.numeroCuenta, c.titular, c.tipo, c.saldo, c.activa));
            mostrarFeedback("✅ Datos recuperados de sesión anterior.", "exito");
        } else {
            const response = await fetch("./data.json");
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            banco = data.map(c => new CuentaBancaria(c.numeroCuenta, c.titular, c.tipo, c.saldo, c.activa));
            sincronizarStorage();
            mostrarFeedback("✅ Base de datos cargada correctamente.", "exito");
        }

        proximoNumeroCuenta = banco.length > 0 ? Math.max(...banco.map(c => c.numeroCuenta)) + 1 : 1;
        renderizarCuentas(banco);

    } catch (error) {
        mostrarFeedback(`❌ Falla crítica de conexión: ${error.message}`, "error");
        contenedorItems.innerHTML = `<div class="mensaje-vacio"><p style="color:#dc2626;">Error al cargar los datos del servidor.</p></div>`;
    }
}

formCuenta.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombreTitular = inputTitular.value.trim();
    const tipoCuenta = selectTipo.value;
    const saldoInicial = parseFloat(inputSaldo.value);

    try {
        if (nombreTitular === "") throw new Error("El titular no puede estar vacío.");
        if (isNaN(saldoInicial) || saldoInicial < 0) throw new Error("Saldo inicial inválido.");

        const nuevaCuenta = new CuentaBancaria(proximoNumeroCuenta++, nombreTitular, tipoCuenta, saldoInicial, true);
        banco.push(nuevaCuenta);
        sincronizarStorage();
        renderizarCuentas(banco);
        
        mostrarFeedback(`Cuenta N° ${nuevaCuenta.numeroCuenta} registrada con éxito.`, "exito");
        formCuenta.reset();
        inputTitular.focus();
    } catch (error) {
        mostrarFeedback(`⚠️ ${error.message}`, "error");
    }
});

inputBusqueda.addEventListener("keyup", (e) => {
    const termino = e.target.value.toLowerCase().trim();
    renderizarCuentas(banco.filter(c => c.titular.toLowerCase().includes(termino)));
});

function asignarEventosBotonesEliminar() {
    document.querySelectorAll(".btn-eliminar").forEach(boton => {
        boton.addEventListener("click", (e) => {
            const numeroAEliminar = parseInt(e.target.dataset.id);
            const cuenta = banco.find(c => c.numeroCuenta === numeroAEliminar);

            if (cuenta) {
                banco = banco.filter(c => c.numeroCuenta !== numeroAEliminar);
                sincronizarStorage();
                
                const textoActual = inputBusqueda.value.toLowerCase().trim();
                renderizarCuentas(textoActual ? banco.filter(c => c.titular.toLowerCase().includes(textoActual)) : banco);
                
                mostrarFeedback(`Se eliminó la cuenta N° ${numeroAEliminar} (${cuenta.titular}).`, "eliminado");
            }
        });
    });
}

btnTodas?.addEventListener("click", () => { inputBusqueda.value = ""; renderizarCuentas(banco); });
btnCorrientes?.addEventListener("click", () => renderizarCuentas(banco.filter(c => c.tipo === "Cuenta Corriente")));
btnAhorro?.addEventListener("click", () => renderizarCuentas(banco.filter(c => c.tipo === "Caja de Ahorro")));
btnActivas?.addEventListener("click", () => renderizarCuentas(banco.filter(c => c.activa)));
btnInactivas?.addEventListener("click", () => renderizarCuentas(banco.filter(c => !c.activa)));
btnPotenciales?.addEventListener("click", () => renderizarCuentas(banco.filter(c => c.saldo > 500000)));

inicializarApp();