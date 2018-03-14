package com.bcs.p3s.sftp.service;

public class P3sSftpException extends Exception {

    public P3sSftpException(String message) {
        super(message);
    }
    public P3sSftpException(String message, Exception e) {
        super(message, e);
    }
}
