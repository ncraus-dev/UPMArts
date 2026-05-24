package etsisi.upm.logica.modelos;

public class Personal extends MiembroUPM {
    private Integer antiguedad;
    private final String rol = "Personal";

    public Personal(String nick, String nombre, String correo, String contrasenia, String dni, String tarjeta, Integer antiguedad) {
        super(nick, nombre, correo, contrasenia, dni, tarjeta);
        this.antiguedad = antiguedad;
    }

    public Integer getAntiguedad() {
        return antiguedad;
    }

    public void setAntiguedad(Integer antiguedad) {
        this.antiguedad = antiguedad;
    }

    @Override
    public double calcularDescuento() {
        // Descuento base 25% + 3% por año trabajado
        double descuento = 25.0 + (this.antiguedad * 3.0);

        // El tope máximo es del 50%
        if (descuento > 50.0) {
            descuento = 50.0;
        }

        return descuento;
    }
    @Override
    public String toString() {
        return  rol + ';' + nick + ';' + nombre + ';' +  email + ';' + contrasenia + ';' + DNI + ';' + tarjeta + ';' +
                antiguedad + ';' + disciplinas+";" + calcularDescuento()+"%";

    }
}