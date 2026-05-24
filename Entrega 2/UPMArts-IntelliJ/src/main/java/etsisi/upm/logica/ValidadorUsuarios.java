package etsisi.upm.logica;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class ValidadorUsuarios {
   private static Set<String> UsuariosProhibidos;
   private static ValidadorUsuarios instance;
   private Set<String> diccionarioUsuarios;
   private Set<String> diccionariosCorreos;
   private Set<String> diccionarioDNI;

   public static ValidadorUsuarios getInstance(){
       if(instance==null){
       instance=new ValidadorUsuarios();
       }
        return instance;

   }

    private ValidadorUsuarios(){
        UsuariosProhibidos= cargarUsuariosProhibidos("forbidden-usernames.txt");
        diccionarioUsuarios=cargarUsuariosActuales("usuarios.txt");
        diccionariosCorreos=cargarCorreoActuales("usuarios.txt");
        diccionarioDNI=cargarDNIActuales("usuarios.txt");
    }

    private static Set<String> cargarUsuariosProhibidos(String rutaArchivo) {

        try (Stream<String> lineas = Files.lines(Paths.get(rutaArchivo))) {
            return lineas
                    .filter(linea -> !linea.trim().isEmpty()) // Descartar líneas en blanco
                    .map(linea -> linea.trim().toLowerCase()) // Quitar espacios y pasar a minúsculas
                    .collect(Collectors.toSet());             // Almacenar en un HashSet ultra rápido

        } catch (IOException e) {
            System.err.println("Error leyendo el archivo txt: " + e.getMessage());
            return new HashSet<>(); // Retornar conjunto vacío para que no explote la app si falla
        }
    }
    private static Set<String> cargarUsuariosActuales(String rutaArchivo) {
            try (Stream<String> lineas = Files.lines(Paths.get(rutaArchivo))) {
                return lineas
                        .filter(linea -> !linea.trim().isEmpty()) // 1. Descartar líneas en blanco
                        .map(linea -> linea.split(";")[1].trim()) // 2. Cortar por ';' y guardar SOLO la primera posición (índice 0)
                        .collect(Collectors.toSet());             // 3. Almacenar esos fragmentos en el HashSet

            } catch (IOException e) {
                System.err.println("Error leyendo el archivo txt: " + e.getMessage());
                return new HashSet<>(); // Retornar conjunto vacío en caso de error
            }
    }
    private static Set<String> cargarCorreoActuales(String rutaArchivo) {
        try (Stream<String> lineas = Files.lines(Paths.get(rutaArchivo))) {
            return lineas
                    .filter(linea -> !linea.trim().isEmpty()) // 1. Descartar líneas en blanco
                    .map(linea -> linea.split(";")[3].trim()) // 2. Cortar por ';' y guardar SOLO la primera posición (índice 0)
                    .collect(Collectors.toSet());             // 3. Almacenar esos fragmentos en el HashSet

        } catch (IOException e) {
            System.err.println("Error leyendo el archivo txt: " + e.getMessage());
            return new HashSet<>(); // Retornar conjunto vacío en caso de error
        }
    }
    private static Set<String> cargarDNIActuales(String rutaArchivo) {
        try (Stream<String> lineas = Files.lines(Paths.get(rutaArchivo))) {
            return lineas
                    .filter(linea -> !linea.trim().isEmpty()) // 1. Descartar líneas en blanco
                    .map(linea -> linea.split(";")[5].trim()) // 2. Cortar por ';' y guardar SOLO la primera posición (índice 0)
                    .collect(Collectors.toSet());             // 3. Almacenar esos fragmentos en el HashSet

        } catch (IOException e) {
            System.err.println("Error leyendo el archivo txt: " + e.getMessage());
            return new HashSet<>(); // Retornar conjunto vacío en caso de error
        }
    }


    public void addNickProhibidos(String string){
       diccionarioUsuarios.add(string);


    }
    public void addCorreoProhibidos(String string){
        diccionariosCorreos.add(string);}
    public void addDNIProhibidos(String string){
        diccionarioDNI.add(string);
    }


    /**
     * Comprueba si el usuario es válido comparándolo contra el Set en memoria.
     */
    public  boolean esNickValido(String nuevoUsuario) {
        if (nuevoUsuario == null || nuevoUsuario.trim().isEmpty()) {
            return false;
        }
        return !(UsuariosProhibidos.contains(nuevoUsuario)||diccionarioUsuarios.contains(nuevoUsuario));
    }
    public boolean esTarjetaValida(String tarjeta) {
        return tarjeta.length()==16&&tarjeta.matches("\\d{16}");}

    public boolean esDNIValido(String dni) {
        String LETRAS_DNI = "TRWAGMYFPDXBNJZSQVHLCKE";

        if (dni == null || dni.length() != 9) {
            return false; // Longitud incorrecta
        }

        // Separar número y letra
        String numeroStr = dni.substring(0, 8);
        char letra = Character.toUpperCase(dni.charAt(8));

        // Comprobar que los 8 primeros son dígitos
        if (!numeroStr.matches("\\d{8}")) {
            return false;
        }

        try {
            int numero = Integer.parseInt(numeroStr);
            char letraCorrecta = LETRAS_DNI.charAt(numero % 23);
            return (letra == letraCorrecta)&&!diccionarioDNI.contains(dni);
        } catch (NumberFormatException e) {
            return false;
        }
    }
    public boolean esCorreoValido(String correo) {

        if (correo == null || correo.trim().isEmpty()) {
            return false;
        }
        return !(diccionariosCorreos.contains(correo));
    }

    public boolean esIBANValidoEspana(String iban) {
        if (iban == null) {
            return false;
        }
        iban = iban.replaceAll("\\s+", "").toUpperCase();

        if (!iban.matches("^ES\\d{22}$")) {
            return false;
        }

        return true;
    }

    public boolean esContrasenaValida(String password) {
        if (password == null || password.length() < 12) {
            return false;        }
        boolean tieneMayuscula = false;
        boolean tieneMinuscula = false;
        boolean tieneNumero = false;
        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) {
                tieneMayuscula = true;
            } else if (Character.isLowerCase(c)) {
                tieneMinuscula = true;
            } else if (Character.isDigit(c)) {
                tieneNumero = true;
            }
            if (tieneMayuscula && tieneMinuscula && tieneNumero) {
                return true;}
        }
        return tieneMayuscula && tieneMinuscula && tieneNumero;
    }

    public void removeNick(String string) { diccionarioUsuarios.remove(string); }
    public void removeCorreo(String string) { diccionariosCorreos.remove(string); }
    public void removeDNI(String string) { diccionarioDNI.remove(string); }


}