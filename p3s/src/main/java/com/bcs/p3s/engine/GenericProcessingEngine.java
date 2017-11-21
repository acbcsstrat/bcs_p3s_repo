package com.bcs.p3s.engine;

import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.util.random.RandomGenerator;

/**
 * This Engine holds processing data that are common for different controllers
 *
 * @author merinp
 */
public class GenericProcessingEngine extends Universal {

	/** verify link for user verification **/
	
	public String generateUrlVerificationCode(P3SUser seedUser) {
		String userMash = seedUser.getEmailAddress() + seedUser.getId().toString();
		int    qwikInt  = userMash.hashCode(); // may be negative
		if (qwikInt<0) qwikInt = qwikInt * -1; 
		String userHash = Integer.toString(qwikInt); // ensure len>8
		
		int len = userHash.length();
		String fragment6 = userHash.substring(len-8, len-2); // ignore last 2, then take last 6
		return fragment6;
	}
	
	/** PIN Number Generation **/
	
	public Business generatePinNumber(Business business){
		
		//business pin can be a 4 digit random generated number between 1000 and 9999
		int ranNumber = 0;
		do{
			RandomGenerator rand = new RandomGenerator((int) System.currentTimeMillis());
			ranNumber = rand.nextInt(1000,9999);
		}while(ranNumber <= 1000 || ranNumber > 9999);
		business.setBusinessPin(ranNumber);
		
		
		//business Number can be a combination of first 2 letters of bus Name and random 2 digit number(eg, Box Clever Software --> BO23)
		ranNumber = 0;
		String bName1 = business.getBusinessName().replace(" ", "");
		String bName2 = bName1.substring(0, 2).toUpperCase();
		do{
			RandomGenerator rand = new RandomGenerator((int) System.currentTimeMillis());
			ranNumber = rand.nextInt(22,99);
		}while(ranNumber < 22 || ranNumber > 99);
		
		business.setBusinessNumber(bName2+ranNumber);
		
		return business;
		
	}

}
