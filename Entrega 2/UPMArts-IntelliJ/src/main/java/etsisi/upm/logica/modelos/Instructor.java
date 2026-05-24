package etsisi.upm.logica.modelos;

public class Instructor extends Usuario{
    private String DNI;
    private String IBAN;
    private final String rol = "Instructor";

    public Instructor (String nick,String nombre, String email, String contrasenia,
                        String DNI, String IBAN){
        super(nick,contrasenia,email,nombre);
        this.DNI = DNI;
        this.IBAN = IBAN;
    }

    public String getDNI() {
        return DNI;
    }

    public void setDNI(String DNI) {
        this.DNI = DNI;
    }

    public String getIBAN(){
        return IBAN;
    }

    public void setIBAN(String IBAN) {
        this.IBAN = IBAN;
    }

    @Override
    public String toString() {
        return  rol + ';' + nick + ';' + nombre + ';' +  email + ';' + contrasenia + ';' + DNI + ';' + IBAN;
    }
}
