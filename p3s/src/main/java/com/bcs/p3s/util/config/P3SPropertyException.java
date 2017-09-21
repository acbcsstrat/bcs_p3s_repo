package com.bcs.p3s.util.config;

public class P3SPropertyException extends Exception {

	// See P3SPropertyReader javadoc to see the role of this exception
	
	public P3SPropertyException(String message) {
        super(message);
    }
	public P3SPropertyException(String message, Exception e) {
        super(message, e);
    }

}
