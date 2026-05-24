package etsisi.upm.logica;

import etsisi.upm.logica.modelos.*;
import etsisi.upm.logica.Disciplina;


public interface IControladorUsuario {

    String[] login(String correo, String contrasena);

       boolean registrarEstudiante(String nick, String nombre, String correo, String pass,
                                String dni, String tarjeta, String matricula);

    boolean registrarPersonal(String nick, String nombre, String correo, String pass,
                              String dni, String tarjeta, int antiguedad);

    boolean registrarParticipanteExterno(String nick, String nombre, String correo,
                                         String pass, String dni, String tarjeta);

    boolean registrarInstructor(String nick, String nombre,
                                String correo, String pass, String dni, String iban);

    boolean aniadirPreferencia(String correo, Disciplina disciplina, int nivel);

    boolean eliminarPreferencia(String correo, Disciplina disciplina);
    public boolean eliminarUsuario(String email,String contrasena);
}