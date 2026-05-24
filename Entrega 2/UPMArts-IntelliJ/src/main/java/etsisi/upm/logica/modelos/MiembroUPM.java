package etsisi.upm.logica.modelos;

import etsisi.upm.logica.modelos.Participante;

public abstract class MiembroUPM extends Participante {

    public MiembroUPM(String nick, String nombre, String correo, String contrasenia, String dni, String tarjeta) {
        super(nick, nombre, correo, contrasenia, dni, tarjeta);
    }

    // Método que cada subclase implementará según sus reglas
    public abstract double calcularDescuento();
}