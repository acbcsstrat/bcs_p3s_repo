package com.bcs.p3s.engine;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;
import java.util.StringTokenizer;

import com.bcs.p3s.util.lang.P3SRuntimeException;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.InBasket;

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
	 * @param commaSeparatedListOfIntegerNumbers eg: patent_id[1,2] - this format because UI cannot send an anonymous array
	 * @return List<Long>
	 */
	public List<Long> commaSeparatedListOfIntegerNumbersStrToListLongs(LinkedHashMap<String, Object> listOfIds) {
		// Created for development testing of Payments: API action 4.1, 4.2, 4.3.
		
		List<Long> result = new ArrayList<Long>();
		String err = "ExtractSubmittedDataEngine extractOrderedPatentIdList ";
		List<String> keys = new ArrayList<String>(listOfIds.keySet());
		/*if (commaSeparatedListOfIntegerNumbers==null) {
			err += " given invalid : "+commaSeparatedListOfIntegerNumbers;
			log().fatal(err);
			throw new P3SRuntimeException(err);
		}*/
		
		if(keys.size() != 1)
			return null;
		
		ArrayList<String> elements =  (ArrayList<String>) listOfIds.get(keys.get(0));
		/*System.out.println("   Next Element follows : ");
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
		}*/
		
		if(! (elements.isEmpty())){
			for (String element : elements){
				if(element instanceof String){
					Long longy = new Long(element.trim());
					result.add(longy);
				}
			}
			
		}
		System.out.println(err+" completed. "+listOfIds+" has "+result.size()+" items.");
		
		return result;
	}

	
	public InBasket getBasketContentsFromCheckOutForm(Object obby){
		
		InBasket basket = new InBasket();
		
		try {

		   	LinkedHashMap<String, Object> basketObject = (LinkedHashMap<String, Object>) obby; 
		   	List<String> keys = new ArrayList<String>(basketObject.keySet());
		   	
		   	for(String key : keys){
		   		
		   		Object obValue = basketObject.get(key);
		   		String strValue = null;
				if(obValue instanceof String)
		   			strValue = (String)obValue;
		   		
		   		if("totalCostUSD".equals(key.trim())){
		   			if(obValue instanceof Double || obValue instanceof Integer){
		   				basket.setExpectedCost(BigDecimal.valueOf((Double) obValue));
		   			}
		   		}
		   		
		   		if ("patent_ids".equals(key.trim())) {
		   			
		   			//LinkedHashMap<String, Object> listOfIds = (LinkedHashMap<String, Object>) obValue;
		   			if(! (obValue instanceof ArrayList<?>))
		   				throw new P3SRuntimeException("PaymentRestController : /rest-prepare-banktransfer/ getBasketContentsFromCheckOutForm() NOT passed Arraylist of patentids");
		   			ArrayList<Integer> elements =  (ArrayList<Integer>) obValue;
		   			
		   			/*List<Long> orderedPatentIds = new ArrayList<Long>();
		   			List<LinkedHashMap<String, Object>> patentsInBasket = (List<LinkedHashMap<String, Object>>) obValue;
		   			
		   			for(LinkedHashMap<String, Object> onePatentItem : patentsInBasket){
		   				Set<String> patentKeys = onePatentItem.keySet();
		   				for(String patentKey : patentKeys){
		   					Object onePatentItemValue = onePatentItem.get(patentKey);
		   					//saving only ID this time
			   				if("id".equals(patentKey.trim())){
			   					orderedPatentIds.add( Long.valueOf(((Integer) onePatentItemValue).longValue()));;
			   				}
		   				}
		   				
		   			}*/
		   			List<Long> orderedPatentIds = new ArrayList<Long>();
		   			if(! (elements.isEmpty())){
		   				//for (String element : elements){ this time passed as Integer
		   				for(Integer element : elements){
		   					if(element instanceof Integer){
		   						Long longy = new Long(element);
		   						orderedPatentIds.add(longy);
		   					}
		   				}
		   				
		   			}
		   			basket.setPatentIds(orderedPatentIds);;
			   	}
		   	}
		   	
		}
		catch (Exception e) {
			// TODO: handle exception
			//Class Cast Exception mostly
			System.out.println(e.getMessage());
		}
		
		return basket;
	}

	
}
