package etsisi.upm.persistencia;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class UsuarioRepository implements IUsuarioRepository {
    private static final String FILE_NAME = "usuarios.txt";

    @Override
    public void guardar(String lineaUsuario) {
        try (PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter(FILE_NAME, true)))) {
            out.print("\n"+lineaUsuario);
        } catch (IOException e) {
            System.out.println("Error al guardar: " + e.getMessage());
        }
    }

    @Override
    public List<String> obtenerTodasLasLineas() {
        List<String> lineas = new ArrayList<>();
        File file = new File(FILE_NAME);
        if (!file.exists()) return lineas;

        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String linea;
            while ((linea = br.readLine()) != null) {
                if (!linea.trim().isEmpty()) {
                    lineas.add(linea);
                }
            }
        } catch (IOException e) {
            System.out.println("Error al leer: " + e.getMessage());
        }
        return lineas;
    }

    @Override
    public void reescribirFichero(List<String> todasLasLineas) {
        try (PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter(FILE_NAME, false)))) {
            for (int i = 0; i < todasLasLineas.size(); i++) {
                out.print(todasLasLineas.get(i));


                if (i < todasLasLineas.size() - 1) {
                    out.print("\n");
                }
            }
        } catch (IOException e) {
            System.out.println("Error al reescribir: " + e.getMessage());
        }
    }
    public String[] buscarDatosUsuarioPorCorreo(String correo) {
        List<String> lineas = obtenerTodasLasLineas();

        for (String linea : lineas) {
            String[] datos = linea.trim().split(";");
            if (datos.length > 3 && datos[3].equals(correo)) {
                return datos;
            }
        }
        return null;
    }

    @Override
    public boolean actualizarPreferenciasUsuario(String correo, String preferenciasCodificadas) {
        List<String> lineas = obtenerTodasLasLineas();
        int indice = buscarIndicePorCorreo(lineas, correo);

        if (indice != -1) {
            String[] datos = lineas.get(indice).split(";");
            StringBuilder nuevaLinea = new StringBuilder();

            for (int j = 0; j < datos.length-2; j++) {
                if (datos[j].contains(":")) break;
                if (j > 0) nuevaLinea.append(";");
                nuevaLinea.append(datos[j]);
            }
            nuevaLinea.append(";").append("["+preferenciasCodificadas+";]").append(datos[datos.length-1]);

            lineas.set(indice, nuevaLinea.toString());
            reescribirFichero(lineas);
            return true;
        }
        return false;
    }

    private int buscarIndicePorCorreo(List<String> lineas, String correo) {
        for (int i = 0; i < lineas.size(); i++) {
            String[] datos = lineas.get(i).split(";");
            if (datos.length > 3 && datos[3].equals(correo)) {
                return i;
            }
        }
        return -1;
    }
    @Override
    public boolean eliminarUsuarioPorCorreo(String correo) {
        List<String> lineas = obtenerTodasLasLineas();
        int indice = buscarIndicePorCorreo(lineas, correo);

        if (indice != -1) {
            lineas.remove(indice);
            reescribirFichero(lineas);
            return true;
        }
        return false;
    }

}
