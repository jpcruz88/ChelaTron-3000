# ChelaTron 3000 — MVP  
**Especificación Funcional + Interfaz Visual**

---

## 1. Configuración del juego (Host)

El sistema **DEBE** permitir al host:
- Ingresar **tema** (texto libre).
- Seleccionar **cantidad de preguntas**.
- Seleccionar **tiempo por pregunta** (segundos).
- Activar / desactivar personalidad **Chela**.

**Acción principal:** botón **“Generar juego”**.

---

## 2. Generación automática de preguntas (IA)

El sistema **DEBE**:
- Generar exactamente la cantidad solicitada.
- Cada pregunta **DEBE** incluir:
  - Texto de la pregunta.
  - **4 opciones** de respuesta.
  - **1 respuesta correcta**.
- Mostrar estado: *“La chela está pensando…”*.

El host **DEBE** poder:
- Visualizar las preguntas generadas.
- **Aceptar** el juego o **regenerar todo**.

> No se permite edición manual de preguntas en el MVP.

---

## 3. Inicio de partida

El sistema **DEBE**:
- Generar un **código único** de acceso.
- Mostrar una **sala de espera**.

El host **DEBE** poder iniciar la partida manualmente.

---

## 4. Flujo del jugador

El jugador **DEBE**:
1. Ingresar el código.
2. Escribir su nombre.
3. Responder cada pregunta (una opción).

**Reglas:**
- No se puede cambiar la respuesta.
- No responder = **0 puntos**.

---

## 5. Puntuación

- Respuesta correcta → suma puntos.
- Respuesta más rápida → más puntos.
- Respuesta incorrecta → 0 puntos.

---

## 6. Resultados

### Después de cada pregunta
El sistema **DEBE** mostrar:
- Respuesta correcta.
- Porcentaje de aciertos.
- Ranking **Top 5**.

### Al finalizar el juego
- Ranking completo.
- Ganador.
- Mensaje final con tono Chela.

---

# Interfaz Visual (MVP)

## A. Pantalla del Host / Proyector

**DEBE mostrar:**
- Pregunta actual.
- Opciones de respuesta.
- Temporizador grande y visible.
- Ranking (cuando aplique).
- Mensajes Chela breves.

---

## B. Pantalla del Jugador (móvil)

**DEBE mostrar:**
- Opciones como botones grandes.
- Temporizador simple.
- Feedback inmediato:
  - Correcto / Incorrecto.
  - Puntos obtenidos.

---

## C. Sala de espera

**DEBE mostrar:**
- Código de acceso en grande.
- Lista de jugadores conectados.
- Mensaje animado de Chela.

---

## D. Estilo visual obligatorio

- Colores cálidos (amarillo / ámbar).
- Tipografía grande y legible.
- Animaciones cortas y claras.
- Tono visual **divertido, no infantil**.

---

## 7. Exclusiones del MVP

El sistema **NO DEBE** incluir:
- Edición manual de preguntas.
- Modos alternativos.
- Equipos.
- Chat.
- Historial de partidas.
- Cuentas de usuario.

---

## 8. Criterios de aceptación del MVP

ChelaTron 3000 cumple el MVP si:
- El host genera un juego en ≤ 1 minuto.
- Los jugadores entienden el flujo sin instrucciones.
- Una partida corre completa sin errores.
- El tono Chela es claro y consistente.
