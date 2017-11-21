package com.bcs.p3s.engine;

import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.util.lang.Universal;

/**
 * This Engine holds processing data that are common for different controllers
 *
 * @author merinp
 */
public class GenericProcessingEngine extends Universal {

	public String generateUrlVerificationCode(P3SUser seedUser) {
		String userMash = seedUser.getEmailAddress() + seedUser.getId().toString();
		int    qwikInt  = userMash.hashCode(); // may be negative
		if (qwikInt<0) qwikInt = qwikInt * -1; 
		String userHash = Integer.toString(qwikInt); // ensure len>8
		
		int len = userHash.length();
		String fragment6 = userHash.substring(len-8, len-2); // ignore last 2, then take last 6
		return fragment6;
	}

}
