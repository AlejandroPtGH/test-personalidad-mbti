let body = document.querySelector("body");

// Guardamos aquí los datos ya descargados para no volver a pedirlos
// al servidor cada vez que se necesitan (evita fetch repetidos).
let cache = {
    preguntas: null,
    interfaz: null,
    personalidades: null,
};

// Descarga el XML de preguntas y devuelve los nodos <pregunta>.
async function obtenerPreguntas() {
    if (cache.preguntas) return cache.preguntas;

    let respuesta = await fetch("preguntas.xml");
    let texto = await respuesta.text();
    let parser = new DOMParser();
    let xml = parser.parseFromString(texto, "application/xml");

    cache.preguntas = xml.querySelectorAll("pregunta");
    return cache.preguntas;
}

// Descarga los textos de la interfaz (títulos, imágenes, etc).
async function obtenerInterfaz() {
    if (cache.interfaz) return cache.interfaz;

    let respuesta = await fetch("interfaz.json");
    cache.interfaz = await respuesta.json();
    return cache.interfaz;
}

// Descarga la lista de personalidades (tipo, descripción, foto).
async function obtenerPersonalidades() {
    if (cache.personalidades) return cache.personalidades;

    let respuesta = await fetch("personalidades.json");
    cache.personalidades = await respuesta.json();
    return cache.personalidades;
}

// Pinta la cabecera de la página: título y las dos imágenes
// que permiten ir al test o a la lista de personalidades.
async function pintarCabecera() {
    const datosInterfaz = await obtenerInterfaz();

    let header = document.createElement("header");

    let titulo = document.createElement("h1");
    titulo.textContent = datosInterfaz.interfaz.h1;
    titulo.classList.add("text-center", "margin");

    let portada = document.createElement("div");
    portada.classList.add("flex", "gap");

    let imgTest = document.createElement("img");
    imgTest.src = "./images/" + datosInterfaz.interfaz.fotosZonas[0];
    imgTest.classList.add("imgGrande", "pointer");

    let imgPerso = document.createElement("img");
    imgPerso.src = "./images/" + datosInterfaz.interfaz.fotosZonas[1];
    imgPerso.classList.add("imgGrande", "pointer");

    portada.append(imgTest, imgPerso);
    header.append(titulo, portada);
    body.append(header);

    // Al hacer click en cada imagen, mostramos una sección u otra
    imgTest.addEventListener("click", () => {
        pintarTest();
    });

    imgPerso.addEventListener("click", () => {
        pintarPersonalidades();
    });
}

// Contenedores del test, se crean una vez y se van reutilizando
// (se limpian con innerHTML = "" cada vez que se vuelve a pintar).
let divTestCompleto = document.createElement("div");

let divTestIncompletoSinTitulo = document.createElement("div");
divTestIncompletoSinTitulo.classList.add("flex");

let divTestPreguntas = document.createElement("div");
divTestPreguntas.classList.add("mediaPantalla");

let divTestResultado = document.createElement("div");
divTestResultado.classList.add("mediaPantalla");

// Pinta el formulario del test: el título, una pregunta con su
// select por cada nodo del XML, y el botón para verificar.
async function pintarTest() {
    const datosInterfaz = await obtenerInterfaz();
    const preguntasXML = await obtenerPreguntas();

    // Limpiamos por si el usuario vuelve a entrar al test
    divTestCompleto.innerHTML = "";
    divTestIncompletoSinTitulo.innerHTML = "";
    divTestPreguntas.innerHTML = "";
    divTestResultado.innerHTML = "";

    let tituloTest = document.createElement("h3");
    tituloTest.textContent = datosInterfaz.interfaz.titulo_test;

    // Por cada pregunta del XML creamos su texto y su select con opciones
    preguntasXML.forEach((nodoPregunta) => {
        let pregunta = document.createElement("p");
        pregunta.textContent = nodoPregunta.getAttribute("pregunta");
        pregunta.classList.add("mt-15");
        divTestPreguntas.append(pregunta);

        let select = document.createElement("select");
        select.classList.add("select");

        let opDefault = document.createElement("option");
        opDefault.textContent = "Seleccione una opción";
        opDefault.value = "0";
        select.appendChild(opDefault);

        let opcionesXML = nodoPregunta.querySelectorAll("opcion");
        opcionesXML.forEach((nodoOpcion) => {
            let opt = document.createElement("option");
            opt.textContent = nodoOpcion.textContent;
            opt.value = nodoOpcion.getAttribute("valor");
            select.appendChild(opt);
        });

        divTestPreguntas.append(select);
    });

    let botonVerificar = document.createElement("button");
    botonVerificar.textContent = "Verificar Resultado";
    botonVerificar.classList.add("boton", "mt-15");

    let spanError = document.createElement("span");
    spanError.classList.add("error", "mb-15");

    divTestPreguntas.append(spanError, botonVerificar);
    divTestIncompletoSinTitulo.append(divTestPreguntas);
    divTestCompleto.append(tituloTest, divTestIncompletoSinTitulo);
    body.append(divTestCompleto);

    // Al pulsar el botón, juntamos el valor de cada select en una
    // palabra (ej: "ISTJ") y comprobamos que no falte ninguna respuesta.
    botonVerificar.addEventListener("click", () => {
        let palabraFormada = "";
        let todosSelects = divTestPreguntas.querySelectorAll("select");

        for (let i = 0; i < todosSelects.length; i++) {
            palabraFormada += todosSelects[i].value;
        }

        if (palabraFormada.includes("0")) {
            spanError.textContent = "Responda todas las preguntas";
            divTestResultado.innerHTML = "";
        } else {
            spanError.textContent = "";
            mostrarResultado(palabraFormada);
        }
    });
}

// Busca en el JSON de personalidades la que coincide con la palabra
// formada por el test (ej: "ISTJ") y pinta su resultado.
async function mostrarResultado(palabraFormada) {
    divTestResultado.innerHTML = "";
    const datosPersonalidades = await obtenerPersonalidades();

    let resultado = datosPersonalidades.find(
        (personalidad) => personalidad.tipo === palabraFormada,
    );

    if (!resultado) return;

    let titulo = document.createElement("h3");
    titulo.textContent = "Tu personalidad es: " + resultado.tipo;
    titulo.classList.add("text-center", "margin");

    let h2 = document.createElement("h2");
    h2.textContent = resultado.personalidad;
    h2.classList.add("text-center", "margin");

    let p = document.createElement("p");
    p.textContent = resultado.descripcion;
    p.classList.add("margin");

    let img = document.createElement("img");
    img.src = "./images/" + resultado.foto;
    img.classList.add("imgGrande");

    divTestResultado.append(titulo, h2, p, img);
    divTestIncompletoSinTitulo.append(divTestResultado);
    divTestCompleto.append(divTestIncompletoSinTitulo);
}

// Contenedores de la sección de tipos de personalidad
let divPersonalidadesCompleto = document.createElement("div");
divPersonalidadesCompleto.classList.add("mt-15");

let divImagenes = document.createElement("div");
divImagenes.classList.add("wrap", "flex");

// Pinta las tarjetas con todos los tipos de personalidad. Cada
// tarjeta muestra foto + nombre, y al hacer click se voltea para
// mostrar la descripción en vez de la foto.
async function pintarPersonalidades() {
    const datosPersonalidades = await obtenerPersonalidades();
    const datosInterfaz = await obtenerInterfaz();

    divPersonalidadesCompleto.innerHTML = "";
    divImagenes.innerHTML = "";

    let titulo = document.createElement("h3");
    titulo.textContent = datosInterfaz.interfaz.titulo_tipos;

    datosPersonalidades.forEach((nodoPersonalidad) => {
        let card = document.createElement("div");
        card.classList.add("mediaPantalla", "card");

        let img = document.createElement("img");
        img.src = "./images/" + nodoPersonalidad.foto;
        img.classList.add("imgGrande");

        let personalidad = document.createElement("h4");
        personalidad.textContent = nodoPersonalidad.personalidad;
        personalidad.classList.add("text-center");

        let descripcion = document.createElement("p");
        descripcion.textContent = nodoPersonalidad.descripcion;

        card.append(img, personalidad);
        divImagenes.append(card);

        // Guardamos el estado (volteada o no) para saber qué mostrar
        let volteado = false;

        card.addEventListener("click", () => {
            card.innerHTML = "";
            volteado = !volteado;

            if (volteado) {
                card.append(descripcion, personalidad);
            } else {
                card.append(img, personalidad);
            }
        });
    });

    divPersonalidadesCompleto.append(titulo, divImagenes);
    body.append(divPersonalidadesCompleto);
}

pintarCabecera();
