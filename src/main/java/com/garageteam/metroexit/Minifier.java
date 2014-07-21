package com.garageteam.metroexit;

import java.io.*;

/**
 * Created: vogdb Date: 9/3/12 Time: 10:49 PM
 */
public class Minifier {

    public static void main(String[] args) {
        if (args.length <= 0) {
            println("enter filename");
            System.exit(6);
        }
        File f = new File(args[0]);
        try {
            Minifier minifier = new Minifier();
            minifier.processUnknownTypeFile(f);
        } catch (IOException e) {
            println("entered filename doesn't exist");
            System.exit(6);
        }
    }

    public static <T> void println(T obj) {
        System.out.println(obj);
    }

    public void processUnknownTypeFile(File f) throws IOException {
        if (f.isDirectory()) {
//            println("processing dir: " + f.getAbsolutePath());
            for (File file : f.listFiles()) {
                processUnknownTypeFile(file);
            }
        } else {
//            println("processing file: " + f.getAbsolutePath());
            this.processFile(f);
        }
    }

    public void processFile(File file) throws IOException {
        StringBuilder sb = new StringBuilder();
        BufferedReader br = new BufferedReader(new FileReader(file), 4 * 1024);
        int code;
        char c;
        do {
            code = br.read();
            c = (char) code;
            if (code == -1)
                break;
            switch (c) {
                case '/': {
                    char b;
                    code = br.read();
                    b = (char) code;
                    if (b == '/') {
                        while (c != '\n' || code != -1) {
                            code = br.read();
                            c = (char) code;
                        }
                    } else if (b == '*') {
                        while (c != '*' || b != '/') {
                            code = br.read();
                            if (code == -1)
                                break;
                            else {
                                c = b;
                                b = (char) code;
                            }

                        }
                        c = b;
                    } else {
                        sb.append(c).append(b);
                    }
                    break;
                }
                case '"': {
                    readQuotes(sb, br, c, '"');
                    break;
                }
                case '\'': {
                    readQuotes(sb, br, c, '\'');
                    break;
                }
                case '\t':
                case '\n':
                case ' ': {
                    break;
                }
                default: {
                    sb.append(c);
                }
            }
        } while (code != -1);
        br.close();
        FileWriter fw = new FileWriter(file, false);
        fw.append(sb);
        fw.close();
    }

    private void readQuotes(StringBuilder sb, BufferedReader br, char c, char quote) throws IOException {
        do {
            sb.append(c);
            c = (char) br.read();
        } while (c != quote);
        sb.append(c);
    }

}
