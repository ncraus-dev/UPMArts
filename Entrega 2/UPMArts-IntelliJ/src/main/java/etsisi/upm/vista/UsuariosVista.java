package etsisi.upm.vista;

import etsisi.upm.logica.ControladorUsuario;
import etsisi.upm.logica.Disciplina;
import etsisi.upm.logica.IControladorUsuario;
import etsisi.upm.logica.ValidadorUsuarios;
import servidor.Autenticacion;
import servidor.ObtencionDeRol;

import java.util.Scanner;

public class UsuariosVista {
    private IControladorUsuario controlador;
    private Scanner entrada = new Scanner(System.in);


    public UsuariosVista() {
        this.controlador = ControladorUsuario.getInstancia();
    }

    public boolean registroNormal() {
        boolean exitoRegistro = false; // Variable para saber si se ha guardado de verdad
        System.out.println("Introduce el nick: ");
        String nick = entrada.nextLine().trim();
        // Corrección: Solo validamos, no añadimos nada a memoria todavía.

        System.out.println("Introduce el nombre: ");
        String nombre = entrada.nextLine().trim();

        System.out.println("Introduce el correo:");
        String correo = entrada.nextLine().trim();


        System.out.println("Tenga en cuenta que debe tener:\n\t-Más de 12 caracteres\n\t-1 Mayúscula\n\t-1 Minú" +
                "scula\n\t-1 Número "+"\nIntroduce la contrasenia: ");
        String contrasena = entrada.nextLine().trim();

        System.out.println("Introduce el DNI: ");
        String DNI = entrada.nextLine().trim();


        System.out.println("Introduce la tarjeta: ");
        String tarjeta = entrada.nextLine().trim();

        boolean existe = Autenticacion.existeCuentaUPMStatic(correo);


        if (existe) {
            String rol = String.valueOf(ObtencionDeRol.get_UPM_AccountRol(correo));
            if (rol.equals("ALUMNO")) {
                System.out.println("Introduce tu matricula: ");
                String matricula = entrada.nextLine().trim();
                exitoRegistro = controlador.registrarEstudiante(nick, nombre, correo, contrasena, DNI, tarjeta, matricula);


            } else if (rol.equals("PDI") || rol.equals("PAS")) {
                System.out.println("Introduce anyos trabajando");
                Integer anyos = Integer.valueOf(entrada.nextLine().trim());
                exitoRegistro = controlador.registrarPersonal(nick, nombre, correo, contrasena, DNI, tarjeta, anyos);

            }
        } else {
            exitoRegistro = controlador.registrarParticipanteExterno(nick, nombre, correo, contrasena, DNI, tarjeta);

        }
        if (exitoRegistro) {

            System.out.println("\n¿Deseas añadir una preferencia artística a tu perfil ahora mismo? (S/N)");
            String respuesta = entrada.nextLine().trim();
            if (respuesta.equalsIgnoreCase("S")) {
                menuAnadirPreferencia(correo); // Llamamos al minimenú pasándole el correo
            }

            System.out.println("\nRegistrado con éxito");
            return true;

        } else {
            System.out.println("Error interno: No se ha podido guardar el usuario.");
            return false;
        }
    }

    public String[] inicioSesion() {
            System.out.println("Introduce el correo: ");
            String correo = entrada.nextLine().trim();

            System.out.println("Introduce la contrasenia:");
            String contrasena = entrada.nextLine().trim();
            String datosLogin[] = controlador.login(correo, contrasena);
            return datosLogin;
    }

    public void darAltaInstructor() {
        System.out.println("Introduce el nick: ");
        String nick = entrada.nextLine().trim();
        // Corrección: Solo validamos, no añadimos nada a memoria todavía.

        System.out.println("Introduce el nombre: ");
        String nombre = entrada.nextLine().trim();

        System.out.println("Introduce el correo:");
        String correo = entrada.nextLine().trim();


        System.out.println("Introduce la contrasenya: ");
        String contrasena = entrada.nextLine().trim();

        System.out.println("Introduce el DNI: ");
        String DNI = entrada.nextLine().trim();

        System.out.println("Introduce el IBAN: ");
        String IBAN = entrada.nextLine().trim();


      boolean  exitoRegistro = controlador.registrarInstructor(nick, nombre, correo, contrasena, DNI, IBAN);

        if (exitoRegistro) {
            System.out.println("Registrado con exito");
        }

    }

    private void menuAnadirPreferencia(String correoUsuario) {
        System.out.println("\n--- AÑADIR PREFERENCIAS INICIALES ---");
        System.out.println("Puedes añadir hasta 3 disciplinas favoritas (nivel del 1 al 10).");

        for (int j = 1; j <= 3; j++) {
            System.out.println("\nPreferencia " + j + " de 3:");
            System.out.println("Selecciona tu disciplina favorita:");

            Disciplina[] disciplinas = Disciplina.values();
            for (int i = 0; i < disciplinas.length; i++) {
                System.out.println((i + 1) + ". " + disciplinas[i]);
            }
            System.out.println("0. Terminar de añadir preferencias y continuar");

            System.out.print("Elige una opción: ");
            int opcionDisc = Integer.parseInt(entrada.nextLine().trim());

            if (opcionDisc == 0) {
                System.out.println("Finalizando la selección de preferencias...");
                break;
            }
            if (opcionDisc < 1 || opcionDisc > disciplinas.length) {
                System.out.println("Opción inválida de disciplina. Inténtalo de nuevo.");
                j--;
                continue;
            }

            Disciplina disciplinaElegida = disciplinas[opcionDisc - 1];

            System.out.print("Introduce tu nivel de experiencia (del 1 al 10): ");
            int nivel = Integer.parseInt(entrada.nextLine().trim());

            boolean exito = controlador.aniadirPreferencia(correoUsuario, disciplinaElegida, nivel);

            if (exito) {
                System.out.println("¡Preferencia de " + disciplinaElegida.name() + " guardada correctamente!");
            } else {
                System.out.println("Error: El nivel debe estar entre 1 y 10 (o tu cuenta no permite añadir preferencias).");
                j--;
            }
        }
    }

    public boolean darseBaja(){
        System.out.println("Introduce el correo si quieres eliminar tu cuenta: ");
        String correo = entrada.nextLine().trim();

        System.out.println("Introduce la contrasenia:");
        String contrasena = entrada.nextLine().trim();

        return controlador.eliminarUsuario(correo,contrasena);
    }

}


