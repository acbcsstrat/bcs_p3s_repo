package com.bcs.p3s.util.lang;

public class P3SRuntimeException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public P3SRuntimeException(String message) {
        super(message);
    }

	public P3SRuntimeException(String message, Exception e) {
        super(message, e);
    }

}
