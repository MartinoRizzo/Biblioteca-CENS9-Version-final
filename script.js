let libros = [];
let prestamos = [];

function agregarLibro() {
    const titulo = document.getElementById('titulo').value;
    const cantidad = parseInt(document.getElementById('cantidad').value, 10);
    const rubro = document.getElementById('rubro').value;

    const libroExistente = libros.find(libro => libro.titulo === titulo);
    if (libroExistente) {
        libroExistente.cantidad += cantidad;
        alert('Libro agregado con exito');
    } else {
        libros.push({ titulo, cantidad, rubro });
        guardarLibros();
        alert('Libro agregado con exito');
    }
    mostrarLibros();
}

function darDeBaja() {
    const tituloBaja = document.getElementById('tituloBaja').value;
    const cantidadBaja = parseInt(document.getElementById('cantidadBaja').value, 10) || 0;

    const libro = libros.find(libro => libro.titulo === tituloBaja);
    if (libro) {
        if (libro.cantidad >= cantidadBaja && cantidadBaja > 0) {
            if (!prestamos.some(prestamo => prestamo.titulo === tituloBaja)) {
                libro.cantidad -= cantidadBaja;
                alert('Cantidad actualizada correctamente.');
                if (libro.cantidad === 0) {
                    libros.splice(libros.indexOf(libro), 1);
                    alert('El libro ha sido eliminado completamente del inventario.');
                }
                guardarLibros();
                mostrarLibros();
            } else {
                alert('No se puede dar de baja el libro porque hay copias prestadas.');
            }
        } else {
            alert('La cantidad a dar de baja no es válida o excede el stock disponible.');
        }
    } else {
        alert('Libro no encontrado');
    }
}

function mostrarLibros() {
    const resultado = document.getElementById('resultado');
    if (resultado) {
        resultado.innerHTML = '<h2>Listado de Libros</h2>';
        libros.forEach(libro => {
            resultado.innerHTML += `<p>${libro.titulo} - Cantidad: ${libro.cantidad} - Rubro: ${libro.rubro}</p>`;
        });
    }
}

function ordenarPorRubro() {
    libros.sort((a, b) => a.rubro.localeCompare(b.rubro));
    mostrarLibros();
}

function mostrarPrestamos() {
    const resultado = document.getElementById('resultado');
    if (resultado) {
        resultado.innerHTML = '<h2>Libros Prestados</h2>';
        prestamos.forEach(prestamo => {
            resultado.innerHTML += `<p>${prestamo.titulo} - Prestado a: ${prestamo.usuario}</p>`;
        });
    }
}

function prestarLibro() {
    const titulo = document.getElementById('tituloPrestamo').value;
    const usuario = document.getElementById('nombrePrestamo').value;

    const libro = libros.find(libro => libro.titulo === titulo);
    if (libro && libro.cantidad > 0) {
        libro.cantidad -= 1;
        prestamos.push({ titulo, usuario });
        
        mostrarLibros();
        alert('Libro prestado con exito');
    } else {
        alert('No hay suficientes libros en stock para prestar');
    }

    guardarLibros();
    guardarPrestamos();
}

function devolverLibro() {
    const titulo = document.getElementById('tituloDevolucion').value;
    const usuario = document.getElementById('nombreDevolucion').value;
    
    const prestamoIndex = prestamos.findIndex(prestamo => prestamo.titulo === titulo && prestamo.usuario === usuario);
    if (prestamoIndex > -1) {
        const libro = libros.find(libro => libro.titulo === titulo);
        if (libro) {
            libro.cantidad += 1;
            prestamos.splice(prestamoIndex, 1);
            
            mostrarLibros();
            alert('Libro devuelto con exito');
        } else {
            alert('Libro no encontrado en el inventario');
        }
    } else {
        alert('No se encontró un préstamo que coincida con esos datos');
    }

    guardarLibros();
    guardarPrestamos();
}

function guardarLibros() {
    localStorage.setItem('libros', JSON.stringify(libros));
}

function guardarPrestamos() {
    localStorage.setItem('prestamos', JSON.stringify(prestamos));
}

document.addEventListener('DOMContentLoaded', function() {
    cargarDatos();
    mostrarLibros();
    mostrarPrestamos();
});

function cargarDatos() {
    const datosLibros = localStorage.getItem('libros');
    const datosPrestamos = localStorage.getItem('prestamos');
    
    if (datosLibros) {
        libros = JSON.parse(datosLibros);
    }

    if (datosPrestamos) {
        prestamos = JSON.parse(datosPrestamos);
    }
}

function generarPDFLibros() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text('Listado de Libros', 10, 10);
    let y = 20;

    libros.forEach((libro, index) => {
        doc.text(`${index + 1}. ${libro.titulo} - Cantidad: ${libro.cantidad} - Rubro: ${libro.rubro}`, 10, y);
        y += 10;
    });

    doc.save('listado_libros.pdf');
}

function generarPDFPrestamos() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text('Listado de Préstamos', 10, 10);
    let y = 20;

    prestamos.forEach((prestamo, index) => {
        doc.text(`${index + 1}. Título: ${prestamo.titulo} - Prestado a: ${prestamo.usuario}`, 10, y);
        y += 10;
    });

    doc.save('listado_prestamos.pdf');
}

