# PixelFreud

Prototipo estático de la interfaz móvil de PixelFreud, rehecho para funcionar como una app de una sola pantalla visible a la vez.

## Qué incluye esta iteración

- Pantalla principal con gabinete de intérpretes arriba, nueva nota al centro e historial debajo.
- Pantalla separada para sueño abierto, que sustituye por completo a la principal.
- PixelFreud activo por defecto y PixelJung / PixelLacan / PixelNeuro visibles como módulos premium.
- Opción visible para desbloquear los tres intérpretes extra por `9.99`.
- Datos simulados para sueños e interpretaciones, sin backend ni compras reales.

## Cómo probarlo localmente

```bash
python3 -m http.server 4173
```

Luego abre `http://localhost:4173`.

## Qué revisar al probar

1. En la pantalla inicial sólo debe verse la escena principal.
2. Al tocar `Nuevo Sueño`, debe abrirse la vista de nota y desaparecer la principal.
3. Al tocar un sueño anterior, debe abrirse esa misma vista de detalle.
4. Los botones `Interpretar sueño` e `Interpretar con historial` deben añadir lecturas debajo del texto.
5. Al cerrar la nota, debes volver a la pantalla principal.
