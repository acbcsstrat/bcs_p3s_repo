package com.bcs.p3s.util.lang;

public class P3SAuthorisationException extends P3SRuntimeException {

	public P3SAuthorisationException(String message) {
        super(message);
    }

	public P3SAuthorisationException(String message, Exception e) {
        super(message, e);
    }

}
