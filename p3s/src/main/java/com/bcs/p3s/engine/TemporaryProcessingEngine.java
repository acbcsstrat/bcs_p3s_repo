package com.bcs.p3s.engine;

import com.bcs.p3s.util.lang.Universal;

/**
 * This Engine holds processing that should be rendered redundant before long.
 *
 * As an Example, processing that will be redundant once working EPO interfaces are implemented
 *
 * @author andyc
 */
public class TemporaryProcessingEngine extends Universal {

	private final boolean SYSO_VERBOSE = false;
	
	
	private void verbose(String msg) {
		if (SYSO_VERBOSE) System.out.println();
	}

}
