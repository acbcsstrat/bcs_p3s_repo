package com.bcs.p3s.engine;

import com.bcs.p3s.enump3s.P3SProductTypeEnum;
import com.bcs.p3s.enump3s.RenewalColourEnum;
import com.bcs.p3s.util.lang.Universal;


/**
 * 'What colour comes next' provider 
 * A simple implementation. 
 *
 * Greater complexity may be needed later for 'whats after Black'
 */
public class ColourManager extends Universal {

	/**
	 * whatColourComesNext
	 * @param existing colour - as a RenewalColourEnum String
	 * @param the product type being used - as a P3SProductTypeEnum String
	 * @return the appropriate RenewalColourEnum.toString()
	 */
	public String whatColourComesNext(
			String existingRenewalColourEnum, String p3SProductTypeEnum) {
		
		// Ignore param checking. Enums take care othe that
		String now = (new RenewalColourEnum(existingRenewalColourEnum)).toString();
		String product = (new P3SProductTypeEnum(p3SProductTypeEnum)).toString();
		String failMsg = "ColourManager given BAD DATA : "+existingRenewalColourEnum+", "+p3SProductTypeEnum;
		
		String next = null;
		
		if (P3SProductTypeEnum.RENEWAL.equals(product)) {
			switch (now) {
				case RenewalColourEnum.GREEN:		next = RenewalColourEnum.AMBER; break;
				case RenewalColourEnum.AMBER:		next = RenewalColourEnum.RED; break;
				case RenewalColourEnum.RED:			next = RenewalColourEnum.BLUE; break;
				case RenewalColourEnum.BLUE:		next = RenewalColourEnum.BLACK; break;
				case RenewalColourEnum.BLACK:		next = RenewalColourEnum.BLACK; break;
				case RenewalColourEnum.GREY:		next = RenewalColourEnum.GREY; break;
				default:							fail(failMsg);							
			}
		}

		else if (P3SProductTypeEnum.FORM1200.equals(product)) {
			switch (now) {
				case RenewalColourEnum.GREEN:		next = RenewalColourEnum.AMBER; break;
				case RenewalColourEnum.AMBER:		next = RenewalColourEnum.RED; break;
				case RenewalColourEnum.RED:			next = RenewalColourEnum.GREY; break;
				case RenewalColourEnum.BLUE:		fail(failMsg);
				case RenewalColourEnum.BLACK:		fail(failMsg);
				case RenewalColourEnum.GREY:		next = RenewalColourEnum.GREY; break;
				default:							fail(failMsg);							
			}
		}

		else fail(failMsg);
		if (next==null) fail(failMsg);
		
		return next;
	}
	
	
}
