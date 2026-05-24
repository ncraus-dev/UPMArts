package etsisi.upm.logica;
import etsisi.upm.logica.modelos.Usuario;
import etsisi.upm.persistencia.IUsuarioRepository;
import etsisi.upm.persistencia.UsuarioRepository;
import utilidades.Cifrado;

public class ControladorUsuario implements IControladorUsuario { ;
    private static ControladorUsuario instancia;
    private FactoryUsuario factoryUsuario;
    private IUsuarioRepository usuarioRepository;
    private ValidadorUsuarios validador;


    private ControladorUsuario() {
        this.usuarioRepository = new UsuarioRepository();
        this.factoryUsuario = new FactoryUsuario();
        this.validador = ValidadorUsuarios.getInstance();
    }


    public static ControladorUsuario getInstancia() {

        if(instancia==null)
            instancia=new ControladorUsuario();
        return instancia;
    }

    public String[] login(String correo, String contrasenia) {
        String contrasena_cifrada = Cifrado.cifrar(contrasenia, Cifrado.Tipo.SHA);
        String[] datos = usuarioRepository.buscarDatosUsuarioPorCorreo(correo);
        if (datos == null) {
            throw new IllegalArgumentException("El correo electronico no esta registrado.");
        }
        String contrasena = datos[4];

        String[] datosLogin = new String[2];
        if(contrasena.equals(contrasena_cifrada)){
            datosLogin[0] = datos[0];
            datosLogin[1] = datos[1];

            return datosLogin;
        }
        throw new IllegalArgumentException("Datos invalidos");
    }

    public boolean registrarEstudiante(String nick, String nombre, String correo, String pass, String dni, String tarjeta, String matricula) {
        String contrasena_cifrada = Cifrado.cifrar(pass, Cifrado.Tipo.SHA);
        Usuario usuario = factoryUsuario.crearEstudiante(nick, nombre, correo, contrasena_cifrada, dni, tarjeta, matricula);

        if (!validador.esContrasenaValida(pass)||!validador.esNickValido(nick) || !validador.esCorreoValido(correo) || !validador.esDNIValido(dni) || !validador.esTarjetaValida(tarjeta)){
            return false;
        }

        if(usuario!=null){
            usuarioRepository.guardar(usuario.toString());
            validador.addNickProhibidos(nick);
            validador.addCorreoProhibidos(correo);
            validador.addDNIProhibidos(dni);

            return true;
        } else {
            return false;
        }
    }

    public boolean registrarPersonal(String nick, String nombre, String correo, String pass, String dni, String tarjeta, int antiguedad) {
        String contrasena_cifrada = Cifrado.cifrar(pass, Cifrado.Tipo.SHA);
        Usuario usuario = factoryUsuario.crearPersonal(nick, nombre, correo, contrasena_cifrada, dni, tarjeta, antiguedad);

        if (!validador.esContrasenaValida(pass)||!validador.esNickValido(nick) || !validador.esCorreoValido(correo) || !validador.esDNIValido(dni) || !validador.esTarjetaValida(tarjeta)||!(antiguedad>0)){
            return false;
        }

        if(usuario!=null){
            usuarioRepository.guardar(usuario.toString());

            validador.addNickProhibidos(nick);
            validador.addCorreoProhibidos(correo);
            validador.addDNIProhibidos(dni);

            return true;
        } else {
            return false;
        }
    }

    public boolean registrarParticipanteExterno(String nick, String nombre, String correo, String pass, String dni, String tarjeta) {
        String contrasena_cifrada = Cifrado.cifrar(pass, Cifrado.Tipo.SHA);
        Usuario usuario = factoryUsuario.crearParticipante(nick, nombre,correo, contrasena_cifrada, dni,tarjeta);

        if (!validador.esContrasenaValida(pass)||!validador.esNickValido(nick) || !validador.esCorreoValido(correo) || !validador.esDNIValido(dni) || !validador.esTarjetaValida(tarjeta)){
            return false;
        }

        if(usuario!=null){
            usuarioRepository.guardar(usuario.toString());

            validador.addNickProhibidos(nick);
            validador.addCorreoProhibidos(correo);
            validador.addDNIProhibidos(dni);

            return true;
        } else{
            return false;
        }
    }



    public boolean registrarInstructor(String nick, String nombre,
                                String correo, String pass, String dni, String iban) {
        String contasena_cifrada = Cifrado.cifrar(pass, Cifrado.Tipo.SHA);
        Usuario usuario = factoryUsuario.crearInstructor(nick, nombre, correo , contasena_cifrada, dni, iban);
            if (!validador.esContrasenaValida(pass)||!validador.esNickValido(nick) || !validador.esCorreoValido(correo) || !validador.esDNIValido(dni) ||
                                                                        !validador.esIBANValidoEspana(iban)){
                return false;
      }

        if(usuario!=null){
            usuarioRepository.guardar(usuario.toString());
            return true;
        }
        return false;
    }


    @Override
    public boolean aniadirPreferencia(String correo, Disciplina disciplina, int nivel) {
        if (nivel < 1 || nivel > 10) {
            return false;
        }
        String[] datos = usuarioRepository.buscarDatosUsuarioPorCorreo(correo);
        if (datos == null) return false;
        String rol = datos[0];

        if (rol.equals("INSTRUCTOR") || rol.equals("ADMINISTRADOR")) {
            return false;
        }
        String nuevaPreferencia = disciplina.name() + ":" + nivel;
        return usuarioRepository.actualizarPreferenciasUsuario(correo, nuevaPreferencia);
    }

    @Override
    public boolean eliminarPreferencia(String correo, Disciplina disciplina) {
        return false;
    }

    public boolean eliminarUsuario(String email, String contrasena){
        String contrasenaCifrada = Cifrado.cifrar(contrasena, Cifrado.Tipo.SHA);
        String[] datos = usuarioRepository.buscarDatosUsuarioPorCorreo(email);
        if (datos == null) {
            throw new IllegalArgumentException("El correo electronico no esta registrado.");
        }

        String contrasenyaGuardada = datos[4];

        if(contrasenyaGuardada.equals(contrasenaCifrada)) {
            boolean borrado = usuarioRepository.eliminarUsuarioPorCorreo(email);
            if (borrado) {
                validador.removeCorreo(email);
                validador.removeNick(datos[1]);
                if(datos.length > 5) validador.removeDNI(datos[5]);
            }
            return borrado;
        } else {
            return false;
        }
    }

}
