package com.bcs.p3s.enump3s;

import com.bcs.p3s.util.lang.Universal;

public abstract class P3SAbstractEnum extends Universal {

    protected String value;

    
    public void fail(String message) {
    	logInternalError().fatal(message);
    	throw new P3SEnumException(message);
    }
    
    public String toString() {
                return this.value;
    }

}
