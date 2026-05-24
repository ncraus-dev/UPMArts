import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;

import etsisi.upm.logica.ControladorUsuario;
import etsisi.upm.logica.Disciplina;
import etsisi.upm.logica.ValidadorUsuarios;

public class ControladorUsuarioTest {

    private ControladorUsuario controlador;

    private static int contadorDni = 10000000;

    @Before
    public void setUp() {
        controlador = ControladorUsuario.getInstancia();
    }

    private String getDniUnico() {
        int num = contadorDni++;
        String letras = "TRWAGMYFPDXBNJZSQVHLCKE";
        return String.format("%08d%c", num, letras.charAt(num % 23));
    }

    @Test
    public void testGetInstancia() {
        ControladorUsuario instancia1 = ControladorUsuario.getInstancia();
        ControladorUsuario instancia2 = ControladorUsuario.getInstancia();
        assertNotNull(instancia1);
        assertSame(instancia1, instancia2);
    }

    @Test
    public void testLogin_CaminoCorreoNoRegistrado() {
        try {
            controlador.login("correo_inexistente_1234@upm.es", "cualquierPass");
            fail("Debería haber fallado y lanzado IllegalArgumentException");
        } catch (IllegalArgumentException e) {
            assertEquals("El correo electronico no esta registrado.", e.getMessage());
        }
    }

    @Test
    public void testLogin_CaminoContrasenaIncorrecta() {
        try {
            controlador.login("josemi.gui@admin.upm.es", "contrasenaEquivocada");
            fail("Debería haber fallado y lanzado IllegalArgumentException");
        } catch (IllegalArgumentException e) {
            assertEquals("Datos invalidos", e.getMessage());
        }
    }

    @Test
    public void testLogin_ValoresNulos() {
        try {
            controlador.login(null, null);
            fail("Debería haber fallado al pasar valores nulos");
        } catch (IllegalArgumentException | NullPointerException e) {
            assertTrue(true);
        }
    }

    @Test
    public void testCajaBlancaEliminarUsuario_EliminaDeValidadorUsuarios() {
        String nick = "borrado" + System.currentTimeMillis();
        String correo = nick + "@alumnos.upm.es";
        String dni = getDniUnico();
        String passPlana = "TestPassword123";
        boolean registrado = controlador.registrarEstudiante(nick, "Prueba Borrado", correo, passPlana, dni, "1111222233334444", "MAT123");
        assertTrue("El usuario debería haberse registrado correctamente", registrado);
        ValidadorUsuarios validador = ValidadorUsuarios.getInstance();
        assertFalse("El nick no debería ser válido porque ya está registrado", validador.esNickValido(nick));
        assertFalse("El correo no debería ser válido porque ya está registrado", validador.esCorreoValido(correo));
        assertFalse("El DNI no debería ser válido porque ya está registrado en el diccionario", validador.esDNIValido(dni));
        boolean borrado = controlador.eliminarUsuario(correo, passPlana);
        assertTrue("El usuario debería haberse borrado correctamente", borrado);
        assertTrue("El nick debería volver a ser válido tras el borrado", validador.esNickValido(nick));
        assertTrue("El correo debería volver a ser válido tras el borrado", validador.esCorreoValido(correo));
        assertTrue("El DNI debería volver a ser válido tras el borrado", validador.esDNIValido(dni));
    }

    @Test
    public void testCajaBlanca_RegistrarEstudiante_FallaPorNickVacio() {
        boolean resultado = controlador.registrarEstudiante(
                "", "Juan", "juan.cb1@alumnos.upm.es", "PasswordValida123",
                getDniUnico(), "1111222233334444", "MAT123");
        assertFalse("Debería retornar false en la primera condición del if (nick vacío)", resultado);
    }

    @Test
    public void testCajaBlanca_RegistrarEstudiante_FallaPorCorreoVacio() {
        boolean resultado = controlador.registrarEstudiante(
                "nick_cb2", "Juan", "", "PasswordValida123",
                getDniUnico(), "1111222233334444", "MAT123");
        assertFalse("Debería retornar false en la segunda condición del if (correo vacío)", resultado);
    }

    @Test
    public void DNICajaBlancaexistente(){
        String nick = "testDNI" + System.currentTimeMillis();
        boolean resultado = controlador.registrarEstudiante(
                nick, "Nombre", nick + "@alumnos.upm.es", "PasswordValida123",
                "05944737L",
                "1111222233334444", "MAT123");

        assertFalse("Debería fallar porque la letra del DNI es falsa/existente", resultado);
    }

    @Test
    public void testCajaBlancaRegistrar_NickProhibido() {
        boolean resultado = controlador.registrarEstudiante(
                "admin", "Juan", "juan@alumnos.upm.es", "PasswordValida123",
                getDniUnico(), "1111222233334444", "MAT123");

        assertFalse("Debería fallar porque 'admin' es una palabra prohibida", resultado);
    }

    @Test
    public void testCajaBlanca_FallaPorNickYaExistente_TodosLosRoles() {
        String nickOcupado = "usuarioBase" + System.currentTimeMillis();
        String correoOcupado = nickOcupado + "@upm.es";

        controlador.registrarEstudiante(nickOcupado, "Base", correoOcupado, "PasswordValida123", getDniUnico(), "1111222233334444", "MAT123");

        assertFalse("Personal: Debería fallar porque el nick ya existe",
                controlador.registrarPersonal(nickOcupado, "Maria", "p@upm.es", "PasswordValida123", getDniUnico(), "1111222233334444", 5));

        assertFalse("Externo: Debería fallar porque el nick ya existe",
                controlador.registrarParticipanteExterno(nickOcupado, "Carlos", "ex@gmail.com", "PasswordValida123", getDniUnico(), "1111222233334444"));
    }

    @Test
    public void NickCajaBlancaIncorrecto(){
        String nick = "docs";
        boolean resultado = controlador.registrarEstudiante(
                nick, "Nombre", nick + "@upm.es", "PasswordValida123",
                getDniUnico(),
                "123456781234567",
                "MAT123");

        assertFalse("Debería fallar porque la tarjeta no tiene 16 dígitos y el nick está prohibido", resultado);
    }

    @Test
    public void testCajaNegra_RegistrarEstudiante_FallaPorTarjetaInvalida() {
        boolean resultado = controlador.registrarEstudiante(
                "nick_cb4" + System.currentTimeMillis(), "Juan", "juan.cb4@alumnos.upm.es", "PasswordValida123",
                getDniUnico(), "123", "MAT123");
        assertFalse("Debería retornar false en la cuarta condición del if (longitud Tarjeta incorrecta)", resultado);
    }

    @Test
    public void testCajaNegraRegistrar_DniLetraIncorrecta() {
        String nick = "testDNI" + System.currentTimeMillis();
        boolean resultado = controlador.registrarEstudiante(
                nick, "Nombre", nick + "@alumnos.upm.es", "PasswordValida123",
                "12345678A",
                "1111222233334444", "MAT123");

        assertFalse("Debería fallar porque la letra del DNI es falsa", resultado);
    }

    @Test
    public void testCajaNegraRegistrar_TarjetaConLetras() {
        String nick = "testTarj1" + System.currentTimeMillis();
        boolean resultado = controlador.registrarEstudiante(
                nick, "Nombre", nick + "@upm.es", "PasswordValida123",
                getDniUnico(),
                "1234ABCD1234ABCD",
                "MAT123");

        assertFalse("Debería fallar porque la tarjeta contiene letras", resultado);
    }

    @Test
    public void testCajaNegraRegistrar_TarjetaCorta() {
        String nick = "testTarj2" + System.currentTimeMillis();
        boolean resultado = controlador.registrarEstudiante(
                nick, "Nombre", nick + "@upm.es", "PasswordValida123",
                getDniUnico(),
                "123456781234567",
                "MAT123");

        assertFalse("Debería fallar porque la tarjeta no tiene 16 dígitos", resultado);
    }

    @Test
    public void testCajaNegra_RegistrarEstudiante_FallaPorDniInvalido() {
        boolean resultado = controlador.registrarEstudiante(
                "nick_cb3" + System.currentTimeMillis(), "Juan", "juan.cb3@alumnos.upm.es", "PasswordValida123",
                "123", "1111222233334444", "MAT123");
        assertFalse("Debería retornar false en la tercera condición del if (longitud DNI incorrecta)", resultado);
    }

    @Test
    public void testCajaNegraRegistrarEstudiante_DatosValidos() {
        String nick = "estud" + System.currentTimeMillis();
        boolean resultado = controlador.registrarEstudiante(
                nick, "Juan", nick + "@alumnos.upm.es", "PasswordValida123",
                getDniUnico(), "1111222233334444", "MAT123");

        assertTrue("Debería registrarse correctamente", resultado);
    }

    @Test
    public void testCajaNegraRegistrarPersonal_DatosValidos() {
        String nick = "pers" + System.currentTimeMillis();
        boolean resultado = controlador.registrarPersonal(
                nick, "Maria", nick + "@upm.es", "PasswordValida123",
                getDniUnico(), "1111222233334444", 5);

        assertTrue("Debería registrarse correctamente", resultado);
    }

    @Test
    public void testCajaNegraRegistrarPersonal_DniFalsoYTarjetaLetras() {
        String nick = "persError" + System.currentTimeMillis();
        boolean resultadoDni = controlador.registrarPersonal(
                nick, "Maria", nick + "@upm.es", "PasswordValida123",
                "12345678A", "1111222233334444", 5);
        assertFalse("Debería fallar por letra de DNI falsa", resultadoDni);

        boolean resultadoTarjeta = controlador.registrarPersonal(
                nick + "2", "Maria", nick + "2@upm.es", "PasswordValida123",
                getDniUnico(), "1111AAAA33334444", 5);
        assertFalse("Debería fallar por tarjeta con letras", resultadoTarjeta);
    }

    @Test
    public void testCajaNegraRegistrarPersonal_AtributoInvalido() {
        String nick = "persAttr" + System.currentTimeMillis();
        boolean resultado = controlador.registrarPersonal(
                nick, "Maria", nick + "@upm.es", "PasswordValida123",
                getDniUnico(), "1111222233334444", -1);

        assertFalse("Debería fallar si el atributo numérico específico de Personal es inválido", resultado);
    }

    @Test
    public void testCajaNegraRegistrarParticipanteExterno_DatosValidos() {
        String nick = "ext" + System.currentTimeMillis();
        boolean resultado = controlador.registrarParticipanteExterno(
                nick, "Carlos", nick + "@gmail.com", "PasswordValida123",
                getDniUnico(), "1111222233334444");

        assertTrue("Debería registrarse correctamente", resultado);
    }

    @Test
    public void testCajaNegraRegistrarParticipanteExterno_DniYTarjetaInvalida() {
        String nick = "extError" + System.currentTimeMillis();
        boolean resultadoDni = controlador.registrarParticipanteExterno(
                nick, "Carlos", nick + "@gmail.com", "PasswordValida123",
                "123", "1111222233334444");
        assertFalse("Debería fallar por longitud de DNI incorrecta", resultadoDni);

        boolean resultadoTarjeta = controlador.registrarParticipanteExterno(
                nick + "2", "Carlos", nick + "2@gmail.com", "PasswordValida123",
                getDniUnico(), "123");
        assertFalse("Debería fallar por tarjeta demasiado corta", resultadoTarjeta);
    }

    @Test
    public void testCajaNegraRegistrarInstructor_DatosInvalidos() {
        boolean resultado = controlador.registrarInstructor(
                "nickInst", "Instructor Falso",
                "nuevo_instructor@upm.es", "PasswordValida123", getDniUnico(), "ES123456789012");

        assertFalse("Debería retornar false por IBAN de formato incorrecto", resultado);
    }

    @Test
    public void testCajaNegraRegistrarInstructor_DniFalsoYNickVacio() {
        String ibanValido = "ES1234567890123456789012";
        boolean resultadoDni = controlador.registrarInstructor(
                "instErr1", "Instructor", "inst1@upm.es", "PasswordValida123",
                "12345678A", ibanValido);
        assertFalse("Debería fallar por letra de DNI falsa", resultadoDni);

        boolean resultadoNickVacio = controlador.registrarInstructor(
                "", "Instructor", "inst2@upm.es", "PasswordValida123",
                getDniUnico(), ibanValido);
        assertFalse("Debería fallar por Nick vacío", resultadoNickVacio);
    }

    @Test
    public void testCajaNegraLogin_CaminoExito() {
        String nick = "log" + System.currentTimeMillis();
        String correo = nick + "@alumnos.upm.es";
        String passPlana = "miPassword123";

        controlador.registrarEstudiante(nick, "Prueba Login", correo, passPlana, getDniUnico(), "1111222233334444", "MAT123");
        String[] datos = controlador.login(correo, passPlana);
        assertNotNull("Los datos de login no deberían ser nulos", datos);
        assertEquals("El primer dato debería ser el Rol", "Estudiante", datos[0]);
        assertEquals("El segundo dato debería ser el Nick", nick, datos[1]);
    }

    @Test
    public void testCajaNegraRegistrar_TarjetaLarga() {
        String nick = "testTarj3" + System.currentTimeMillis();
        boolean resultado = controlador.registrarEstudiante(
                nick, "Nombre", nick + "@upm.es", "PasswordValida123",
                getDniUnico(),
                "11112222333344445",
                "MAT123");

        assertFalse("Debería fallar porque la tarjeta tiene más de 16 dígitos", resultado);
    }

    @Test
    public void testCajaNegraRegistrarInstructor_DatosValidos() {
        String nick = "inst" + System.currentTimeMillis();
        String ibanValido = "ES1234567890123456789012";

        boolean resultado = controlador.registrarInstructor(
                nick, "Instructor Pro", nick + "@upm.es", "PasswordValida123",
                getDniUnico(), ibanValido);

        assertTrue("Debería registrarse correctamente con un IBAN válido", resultado);
    }
    @Test
    public void testEliminarUsuario_ContrasenaIncorrecta() {
        String nick = "borradoFallido" + System.currentTimeMillis();
        String correo = nick + "@alumnos.upm.es";
        String passCorrecta = "PasswordValida123";
        controlador.registrarEstudiante(nick, "Usuario a Borrar", correo, passCorrecta, getDniUnico(), "1111222233334444", "MAT123");
        boolean borrado = controlador.eliminarUsuario(correo, "ContrasenaEquivocada123");
        assertFalse("Debería devolver false porque la contraseña no coincide", borrado);
        String[] loginData = controlador.login(correo, passCorrecta);
        assertNotNull("El usuario debería seguir pudiendo loguearse", loginData);
    }
    @Test
    public void testRegistrar_ContrasenasInvalidasEspecificas() {
        String nick = "passTest" + System.currentTimeMillis();
        String correoBase = nick + "@alumnos.upm.es";
        String dni = getDniUnico();

        // 1. Contraseña larga pero sin números
        assertFalse("Debería fallar (sin números)", 
            controlador.registrarEstudiante(nick+"1", "N1", "1"+correoBase, "SoloLetrasMayusYMinus", dni, "1111222233334444", "MAT123"));

        // 2. Contraseña larga pero sin mayúsculas
        assertFalse("Debería fallar (sin mayúsculas)", 
            controlador.registrarEstudiante(nick+"2", "N2", "2"+correoBase, "solominusculas123", getDniUnico(), "1111222233334444", "MAT123"));

        // 3. Contraseña larga pero sin minúsculas
        assertFalse("Debería fallar (sin minúsculas)", 
            controlador.registrarEstudiante(nick+"3", "N3", "3"+correoBase, "SOLOMAYUSCULAS123", getDniUnico(), "1111222233334444", "MAT123"));
            
        // 4. Contraseña válida pero demasiado corta (11 caracteres)
        assertFalse("Debería fallar (11 caracteres)", 
            controlador.registrarEstudiante(nick+"4", "N4", "4"+correoBase, "Corta123456", getDniUnico(), "1111222233334444", "MAT123"));
    }

    @Test
    public void testAniadirPreferencia_UsuarioNoExiste() {
        boolean resultado = controlador.aniadirPreferencia("correo_falso_inventado@test.com", Disciplina.Teatro, 1);

        assertFalse("Debería devolver false si el correo del usuario no existe", resultado);
    }

    @Test
    public void testAniadirPreferencia_RolValidoEstudianteExito() {
        String nick = "estudPref" + System.currentTimeMillis();
        String correo = nick + "@alumnos.upm.es";

        controlador.registrarEstudiante(nick, "Estudiante Preferencias", correo, "PasswordValida123", getDniUnico(), "1111222233334444", "MAT123");

        boolean resultado = controlador.aniadirPreferencia(correo, Disciplina.Teatro, 3);

        assertTrue("Debería devolver true al añadir la preferencia a un Estudiante", resultado);
    }

    @Test
    public void testEliminarPreferencia_PorDefecto() {
        boolean resultado = controlador.eliminarPreferencia("cualquiercorreo@test.com", Disciplina.Pintura);

        assertFalse("Debería devolver false ya que aún no está implementada la lógica de borrado", resultado);
    }
    @Test
    public void testAniadirPreferencia_NivelesFueraDeRango() {
        String nick = "limitesPref" + System.currentTimeMillis();
        String correo = nick + "@alumnos.upm.es";
        controlador.registrarEstudiante(nick, "Estudiante Limites", correo, "PasswordValida123", getDniUnico(), "1111222233334444", "MAT123");
        boolean resultadoBajo = controlador.aniadirPreferencia(correo, Disciplina.Musica, 0);
        assertFalse("No se debería permitir un nivel inferior a 1", resultadoBajo);
        boolean resultadoAlto = controlador.aniadirPreferencia(correo, Disciplina.Pintura, 11);
        assertFalse("No se debería permitir un nivel superior a 10", resultadoAlto);
    }


}