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
	
	protected String PREFIX = this.getClass().getName() + " : "; 

	/** verify link for user verification **/
	
	public String generateUrlVerificationCode(P3SUser seedUser) {
		String userMash = seedUser.getEmailAddress() + seedUser.getId().toString();
		int    qwikInt  = userMash.hashCode(); // may be negative
		if (qwikInt<0) qwikInt = qwikInt * -1; 
		String userHash = Integer.toString(qwikInt); 
		if (userHash.length() < 9) userHash="845396235"+userHash; // ensure len>8. Should be unnecessary
		
		int len = userHash.length();
		String fragment6 = userHash.substring(len-8, len-2); // ignore last 2, then take last 6
		return fragment6;
	}
	
	/** Business PIN & Number Generation **/
	
	public Business generateBusinessPinAndNumber(Business business){
		
		String msg = "generateBusinessPinAndNumber(business)";
		log().debug(msg +" invoked for generating Business Pin and Number");
		//business pin can be a 4 digit random generated number between 1000 and 9999
		int ranNumber = 0;
		do{
			RandomGenerator rand = new RandomGenerator((int) System.currentTimeMillis());
			ranNumber = rand.nextInt(1000,9999);
		}while(ranNumber <= 1000 || ranNumber > 9999);
		
		business.setBusinessPin(ranNumber);
		
		
		//business Number can be a combination of first 2 letters of business Name in UPPERCASE and random 4 digit number(eg, Box Clever Software --> BO2317)
		ranNumber = 0;
		String bName1 = business.getBusinessName().replace(" ", ""); 
		String bName2 = bName1.substring(0, 2).toUpperCase();
		do{
			RandomGenerator rand = new RandomGenerator((int) System.nanoTime());
			ranNumber = rand.nextInt(1000,9999);
		}while(ranNumber <= 1000 || ranNumber > 9999);
		
		log().debug("Generated a random number for Business Number as " + ranNumber);
		
		business.setBusinessNumber(bName2+ranNumber);
		
		log().debug(msg + " returning with Business Pin and number respectively as " + business.getBusinessPin() +" and " + business.getBusinessNumber());
		
		return business;
		
	}
	
	public Business regenerateBusinessNumber(Business business){
		
		String msg = "regenerateBusinessNumber(business)";
		log().debug(msg +" invoked for regenerating Business Number");
		
		//business Number can be a combination of first 2 letters of business Name in UPPERCASE and random 4 digit number(eg, Box Clever Software --> BO2317)
		int ranNumber = 0;
		String bName1 = business.getBusinessName().replace(" ", ""); 
		String bName2 = bName1.substring(0, 2).toUpperCase();
		do{
			RandomGenerator rand = new RandomGenerator((int) System.currentTimeMillis());
			ranNumber = rand.nextInt(1000,9999);
		}while(ranNumber <= 1000 || ranNumber > 9999);
				
		log().debug(msg + " has generated a random number for Business Number as " + ranNumber);
				
		business.setBusinessNumber(bName2+ranNumber);
				
		log().debug(msg + " returning with Business number as "  + business.getBusinessNumber());
				
		return business;
	}

}
