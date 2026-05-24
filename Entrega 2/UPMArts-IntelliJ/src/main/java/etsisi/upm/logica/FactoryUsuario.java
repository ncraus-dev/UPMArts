package etsisi.upm.logica;
import etsisi.upm.logica.modelos.*;



public class FactoryUsuario {


    public FactoryUsuario(){

    }

    public Estudiante crearEstudiante(String nick, String nombre, String correo, String contrasena, String DNI, String tarjeta, String matricula){
        Estudiante estudiante = new Estudiante(nick, nombre, correo, contrasena, DNI, tarjeta, matricula);
        return estudiante;
    }
    public Personal crearPersonal(String nick, String nombre, String correo, String contrasena, String DNI, String tarjeta, Integer antiguedad){
        Personal personal = new Personal(nick, nombre, correo, contrasena, DNI, tarjeta, antiguedad);
        return personal;
    }
    public Participante crearParticipante(String nick, String nombre, String correo, String contrasena, String DNI, String tarjeta){
        Participante participante = new Participante(nick, nombre, correo, contrasena, DNI, tarjeta);
        return participante;
    }

    public Instructor crearInstructor(String nick, String nombre, String correo, String contrasena, String DNI, String IBAN){
        Instructor instructor = new Instructor(nick, nombre, correo, contrasena, DNI, IBAN);
        return instructor;
    }


}
