package com.bcs.p3s.engine;

import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

import com.bcs.p3s.util.lang.P3SRuntimeException;
import com.bcs.p3s.util.lang.Universal;

/**
 * The Front-End may POST or PUT data back to the back-end
 * Where necessary, this engine provides support in extracting required data.
 * 
 *  This MIGHT include processing data which arrives in an unpredictable form: e.g. LinkedHashMap OR the requested object

 * @author andyc
 *
 */
public class ExtractSubmittedDataEngine extends Universal {


	/**
	 * Created for development testing, but may be of use later for production use.
	 * @param commaSeparatedListOfIntegerNumbers
	 * @return List<Long>
	 */
	public List<Long> commaSeparatedListOfIntegerNumbersStrToListLongs(String commaSeparatedListOfIntegerNumbers) {
		// Created for development testing of Payments: API action 4.1, 4.2, 4.3.
		String err = "ExtractSubmittedDataEngine extractOrderedPatentIdList ";
		if (commaSeparatedListOfIntegerNumbers==null) {
			err += " given invalid : "+commaSeparatedListOfIntegerNumbers;
			log().fatal(err);
			throw new P3SRuntimeException(err);
		}
		
		List<Long> result = new ArrayList<Long>();
		
		String[] elements = commaSeparatedListOfIntegerNumbers.split(",",-1); 
		System.out.println("   Next Element follows : ");
		for (String element : elements ) {
			System.out.println("   This element is : "+element);
			if (notEmpty(element)) {
				try {
					Long longy = new Long(element.trim());
					result.add(longy);
				}
				catch (NumberFormatException nfe) {
					// Either malicious or code error. To abort or ignore? Abort safest.
					logInternalError().fatal(err+"BadElement:"+element);
					throw new P3SRuntimeException(err+"BadElement:"+element, nfe);
				}
			}
		}
		System.out.println(err+" completed. "+commaSeparatedListOfIntegerNumbers+" has "+result.size()+" items.");
		
		return result;
	}

	
	
	
}
