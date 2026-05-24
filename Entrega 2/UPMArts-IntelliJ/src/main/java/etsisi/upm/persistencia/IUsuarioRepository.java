package etsisi.upm.persistencia;

import java.util.List;

public interface IUsuarioRepository {

    void guardar(String lineaUsuario);

    List<String> obtenerTodasLasLineas();

    void reescribirFichero(List<String> todasLasLineas);

    public String[] buscarDatosUsuarioPorCorreo(String correo);

    boolean actualizarPreferenciasUsuario(String correo, String preferenciasCodificadas);
    boolean eliminarUsuarioPorCorreo(String correo);
}