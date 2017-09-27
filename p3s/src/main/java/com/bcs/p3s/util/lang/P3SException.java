package com.bcs.p3s.util.lang;

/**
 * Use when other exceptions don't cut the mustard
 */
public class P3SException extends Exception {

	public P3SException(String message) {
        super(message);
    }

	public P3SException(String message, Exception e) {
        super(message, e);
    }

}
