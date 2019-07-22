package com.bcs.p3s.enump3s;

/**
 * RuntimeException: So avoids needing to catch (we're dead anyway if this happens.
 * But client MUST first logInternalError()
 * 
 * @author andyc
 *
 */
public class P3SEnumException extends RuntimeException {

    public P3SEnumException(String message) {
        super(message);
    }

}
