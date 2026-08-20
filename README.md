# Test de Personalidad MBTI

Test interactivo de personalidad estilo MBTI desarrollado en **JavaScript vanilla**. Carga preguntas desde XML parseado con `DOMParser`, textos de interfaz y personalidades desde JSON, con sistema de caché en memoria para evitar peticiones repetidas al servidor. Generación dinámica del DOM (preguntas, selects, tarjetas volteables) mediante event listeners, y cálculo de resultado combinando las respuestas del usuario en un tipo de personalidad (ej. `ISTJ`, `ENFP`...).

## 🛠️ Tecnologías

- JavaScript (vanilla)
- HTML5 / CSS3
- Fetch API
- DOMParser (XML)
- JSON

## Funcionalidades

- Carga de preguntas desde un archivo XML (`preguntas.xml`)
- Interfaz y personalidades cargadas dinámicamente desde JSON
- Sistema de caché en memoria para evitar peticiones repetidas
- Generación de preguntas y opciones (selects) de forma dinámica
- Validación de formulario (todas las preguntas deben responderse)
- Cálculo del resultado según las respuestas seleccionadas
- Sección de tipos de personalidad con tarjetas interactivas (flip on click)

## 📂 Estructura del proyecto

```
├── css/
├── images/
├── js/
├── di.html
├── interfaz.json
├── personalidades.json
└── preguntas.xml
```

## 🚀 Cómo ejecutarlo

Al usar `fetch` para cargar los archivos XML/JSON, es necesario servir el proyecto desde un servidor local (no abrir `di.html` directamente con doble clic).

```bash
# Con Python
python -m http.server

# O con la extensión Live Server de VS Code
```

Luego abre `di.html` en el navegador.

##  Autor

José Alejandro Pampa Taguada
