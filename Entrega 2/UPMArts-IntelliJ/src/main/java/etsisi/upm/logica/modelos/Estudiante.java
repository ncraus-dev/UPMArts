package etsisi.upm.logica.modelos;

public class Estudiante extends MiembroUPM {
    private String matricula;
    private final String rol = "Estudiante";

    public Estudiante(String nick, String nombre, String correo, String contrasenia, String dni, String tarjeta, String matricula) {
        super(nick, nombre, correo, contrasenia, dni, tarjeta);
        this.matricula = matricula;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    @Override
    public double calcularDescuento() {
        // Los estudiantes tienen un descuento fijo del 25%
        return 25.0;
    }

    @Override
    public String toString() {
        return rol + ';' + nick + ';' + nombre + ';' +  email + ';' + contrasenia + ';' + DNI + ';' + tarjeta + ';' +
               matricula + ';' + disciplinas+";" + calcularDescuento()+"%";

    }
}
