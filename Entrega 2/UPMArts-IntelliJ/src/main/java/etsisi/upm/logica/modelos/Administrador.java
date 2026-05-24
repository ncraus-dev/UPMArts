package etsisi.upm.logica.modelos;

public class Administrador extends Usuario {
    private int tfnoCorporativo;
    private final String rol = "Administrador";

    public Administrador(String nick, String contrasenia, String email, String nombre,
                         int tfnoCorporativo) {
        super(nick, contrasenia, email, nombre);
        this.tfnoCorporativo = tfnoCorporativo;
    }

    public int getTfnoCorporativo() {
        return tfnoCorporativo;
    }

    public void setTfnoCorporativo(int tfnoCorporativo) {
        this.tfnoCorporativo = tfnoCorporativo;
    }

    @Override
    public String toString() {
        return rol + ';' + nick + ';' + nombre + ';' +  email + ';' + contrasenia + ';' + tfnoCorporativo;
    }


}
