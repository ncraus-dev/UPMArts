package etsisi.upm.logica.modelos;

import etsisi.upm.logica.Disciplina;

import java.util.ArrayList;
import java.util.List;

public class Participante extends Usuario {

    protected String DNI;
    protected String tarjeta;
    protected List<Disciplina> disciplinas;
    private final String rol = "Externo";

    public Participante(String nick, String nombre, String correo, String contrasenya, String DNI, String tarjeta) {
        super(nick, contrasenya, correo, nombre);

        this.DNI = DNI;
        this.tarjeta = tarjeta;
        this.disciplinas = new ArrayList<>();
    }

    public String getDNI() {
        return DNI;
    }

    public void setDNI(String DNI) {
        this.DNI = DNI;
    }

    public String getTarjeta() {
        return tarjeta;
    }

    public void setTarjeta(String tarjeta) {
        this.tarjeta = tarjeta;
    }

    public List<Disciplina> getPreferencias() {
        return disciplinas;
    }

    public void setPreferencias(List<Disciplina> preferencias) {
        this.disciplinas = preferencias;
    }

    public double calcularDescuento() {
        return 0.0;
    }

    @Override
    public String toString() {
        return  rol + ';' + nick + ';' + nombre + ';' +  email + ';' + contrasenia + ';' + DNI + ';' + tarjeta + ';' + disciplinas + ";" + calcularDescuento()+"%";

    }

}