package etsisi.upm.vista;

import utilidades.Cifrado;

import java.util.Scanner;

public class UPMArtsCLI {
    private UsuariosVista usuariosVista = new UsuariosVista();
    private static final String menu = "\n\t1. Registrarse\n\t2. Iniciar Sesion\n\t3. Volver / Salir\n";
    private static final String menuPartipantesTexto = "\n\t1.Inscribirse en curso/sesion\n\t2.Apuntarse a una asociacion\n" +
            "\t3.Añadir preferencia\n\t4.Darse de baja\n\t5.Cerrar sesion";
    private static final String menuInstructoresTexto = "\n\t1.Consultar sesiones\n\t2.Darse de baja\n\t3.Cerrar sesion\n";
    private static final String menuAdministradoresTexto = "\n\t1.Dar de Alta Instructor\n\t2.Dar de Baja\n\t3.Crear Sesion Libre\n\t" +
            "4.Crear Curso\n\t5.Registrar asociacion\n\t6.Dar de Alta espacio\n\t7.Gestionar Equipamiento\n\t8.Cerrar sesion";
private static final String bienvenida = "=====================================\n        Bienvenido a UPM Arts         \n\"=====================================";
    private Scanner entrada = new Scanner(System.in);

    public UPMArtsCLI() {
    }

    public static void main(String[] args) {
        UPMArtsCLI menu = new UPMArtsCLI();
        menu.menuSesion();
    //Contraseña de josemi.gui@admin.upm.es contrasena
    }

    public void menuSesion() {
        System.out.println(bienvenida);
        System.out.println(menu);
        int opcion = 0;
        do {
            try {
                System.out.print("Elija que desea hacer:");

                if (entrada.hasNextInt()) {
                    opcion = entrada.nextInt();
                    entrada.nextLine(); // Limpiamos el buffer del Enter

                    switch (opcion) {
                        case 1:
                            if(usuariosVista.registroNormal()){
                                String datosRegistro[] = usuariosVista.inicioSesion();
                                menuPrincipal(datosRegistro);
                            }

                            break;
                        case 2:
                            String datosLogin[] = usuariosVista.inicioSesion();
                            menuPrincipal(datosLogin);
                            break;
                        case 3:
                            System.out.println("Saliendo del módulo de usuarios...");
                            break;
                        default:
                            System.out.println("Opcion no valida. Intentalo de nuevo.");
                    }
                } else {
                    System.out.println("Por favor, introduce un numero valido.");
                    entrada.next();
                }
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        } while (opcion != 3);
    }

    public void menuPrincipal(String datosLogin[]) {

        switch (datosLogin[0]) {
            case "Estudiante":
                menuParticipantes();
                break;
            case "Administrador":
                menuAdministradores();
                break;
            case "Externo":
                menuParticipantes();
                break;
            case "Personal":
                menuParticipantes();
                break;
            case "Instructor":
                menuInstructores();
                break;
            default:
                throw new IllegalArgumentException("Datos incorrectos ");

        }


    }

    public void menuParticipantes() {
        System.out.println(menuPartipantesTexto);
        int opcion = 0;
        do {
            System.out.print("Elige una opcion: \n");

            if (entrada.hasNextInt()) {
                opcion = entrada.nextInt();
                entrada.nextLine();

                switch (opcion) {
                    case 1:
                        System.out.println("Menu cursos y sesiones");
                        break;
                    case 2:
                        System.out.println("Menu asociaciones");
                        break;
                    case 3:
                        System.out.println("Menu preferencias");
                        break;
                    case 4:
                        if(usuariosVista.darseBaja())
                        System.out.println("Dandose de baja...");
                        opcion=5;
                        System.out.println("\n" + bienvenida);
                        System.out.println(menu);
                        break;
                    case 5:
                        System.out.println("Cerrando sesion...");
                        System.out.println(bienvenida);
                        System.out.println(menu);
                        break;
                    default:
                        System.out.println("Opcion no valida. Intentalo de nuevo.");
                }
            } else {
                System.out.println("Por favor, introduce un numero valido.");
                entrada.next();
            }


        }while (opcion != 5) ;
}

    public void menuInstructores(){
        System.out.println(menuInstructoresTexto);
        int opcion = 0;
        do {
            System.out.print("Elige una opcion: \n");

            if (entrada.hasNextInt()) {
                opcion = entrada.nextInt();
                entrada.nextLine();

                switch (opcion) {
                    case 1:
                        System.out.println("Menu sesiones del Instructor");
                        break;
                    case 2:
                        System.out.println("Dandose de baja...");
                        opcion=3;
                        System.out.println(bienvenida);
                        System.out.println(menu);
                        break;
                    case 3:
                        System.out.println("Cerrando sesion...");
                        System.out.println(bienvenida);
                        System.out.println(menu);
                        break;
                    default:
                        System.out.println("Opcion no valida. Intentalo de nuevo.");
                }
            } else {
                System.out.println("Por favor, introduce un numero valido.");
                entrada.next();
            }

        }while (opcion != 3) ;
    }

    public void menuAdministradores(){
        System.out.println(menuAdministradoresTexto);
        int opcion = 0;
        do {
            System.out.print("Elige una opcion: \n");

            if (entrada.hasNextInt()) {
                opcion = entrada.nextInt();
                entrada.nextLine();

                switch (opcion) {
                    case 1:
                        usuariosVista.darAltaInstructor();
                        break;
                    case 2:
                        System.out.println("Dar de baja a alguien");
                        break;
                    case 3:
                        System.out.println("Menu crear sesiones");
                        break;
                    case 4:
                        System.out.println("Menu crear sesiones");
                        break;
                    case 5:
                        System.out.println("Menu registrar asociaciones");
                        break;
                    case 6:
                        System.out.println("Menu espacios");
                        break;
                    case 7:
                        System.out.println("Menu equipamientos");
                        break;
                    case 8:
                        System.out.println("Cerrando sesion...");
                        System.out.println(bienvenida);
                        System.out.println(menu);
                        break;
                    default:
                        System.out.println("Opcion no valida. Intentalo de nuevo.");
                }
            } else {
                System.out.println("Por favor, introduce un numero valido.");
                entrada.next();
            }

        }while (opcion != 8) ;
    }

}
