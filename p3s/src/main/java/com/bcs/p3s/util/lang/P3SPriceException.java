package com.bcs.p3s.util.lang;

public class P3SPriceException extends RuntimeException {

	public P3SPriceException(String message) {
        super(message);
    }

	public P3SPriceException(String message, Exception e) {
        super(message, e);
    }

}