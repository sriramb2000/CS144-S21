import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.security.DigestInputStream;
import java.security.MessageDigest;

public class ComputeSHA {
    public static void main(String[] args) throws Exception {
        if (args.length != 1) {
            System.out.println("Too many arguments. Usage: ComputeSHA <filename>");
            return;
        }

        String fileName = args[0];
    
        BufferedInputStream bis;
        try {
            bis = new BufferedInputStream(new FileInputStream(fileName));
        } catch (Exception e) {
            System.out.println("File not found.");
            return;
        }

        MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
        DigestInputStream dis = new DigestInputStream(bis, messageDigest);

        try {
            while (dis.read() != -1);
        } catch (Exception e) {
            System.out.println("There was an error in hashing your file.");
            return;
        } finally {
            bis.close();
        }

        byte[] hash = dis.getMessageDigest().digest();

        System.out.println(byteToHexString(hash));
        return;
    }

    public static String byteToHexString(byte[] bytes) {
        StringBuilder sb = new StringBuilder();

        for(int i=0; i< bytes.length ;i++)
        {
            sb.append(Integer.toString((bytes[i] & 0xff) + 0x100, 16).substring(1));
        }

        return sb.toString();
    } 
}