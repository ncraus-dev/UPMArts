package etsisi.upm.logica.modelos;

public abstract class Usuario {
    protected String nick;
    protected String nombre;
    protected String email;
    protected String contrasenia;

    public Usuario(String nick, String contrasenia, String email, String nombre) {
        this.nick = nick;
        this.contrasenia = contrasenia;
        this.email = email;
        this.nombre = nombre;
    }

    public String getNick() {
        return nick;
    }

    public void setNick(String nick) {
        this.nick = nick;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContrasenia() {
        return contrasenia;
    }

    public void setContrasenia(String contrasenia) {
        this.contrasenia = contrasenia;
    }

    @Override
    public String toString() {
        return "Usuario{" +
                "nick='" + nick + '\'' +
                ", nombre='" + nombre + '\'' +
                ", email='" + email + '\'' +
                ", contrasenia='" + contrasenia + '\'' +
                '}';
    }
}
