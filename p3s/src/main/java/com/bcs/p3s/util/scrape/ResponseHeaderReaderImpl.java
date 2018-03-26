package com.bcs.p3s.util.scrape;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.stereotype.Service;

import com.bcs.p3s.enump3s.ThrottleStatusEnum;
import com.bcs.p3s.scrape.model.ResponseHeaderPojo;
import com.bcs.p3s.util.lang.Universal;

@RooJavaBean
public class ResponseHeaderReaderImpl extends Universal implements ResponseHeaderReader{
	
	private long quotaUsedPerHour;
	
	private long quotaUsedPerWeek;
	
	private ThrottleStatusEnum throttleStatus;
	
	private long accessInterval;
	
	ResponseHeaderPojo responseHeader = new ResponseHeaderPojo();

	public long getLongValueOf(String headerParameter) {
		// TODO Auto-generated method stub
		return 0;
	}

	public String getStringValueOf(String headerParameterName) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ResponseHeaderPojo readResponseHeaderData(URLConnection conn) {
		
	    Map<String,List<String>> headerMap = new HashMap<String,List<String>>();
	    headerMap = conn.getHeaderFields();
	    
	    List<String> firstData = headerMap.get(headerMap.keySet().toArray()[0]);
	    if(firstData!=null){
	    	//eg: expression -- 		 [HTTP/1.1 200 OK]
	    	Pattern p = Pattern.compile("HTTP/1.1 (\\d*) ([a-zA-Z]*)");
        	Matcher m = p.matcher(firstData.get(0));
        	boolean b = m.matches();
        	if (b) {
        		log().info("EPO Request send a response code of " + m.group(1) + " and message as " + m.group(2) );
        	}
	    }
	    
		String colourCodes = "";
	    List<String> throttlingInformation = headerMap.get("X-Throttling-Control");
	    if (throttlingInformation == null)
	    {
	    	this.accessInterval = 60000000000L/10;
		}
	    else
	    {
        	//Pattern p = Pattern.compile(".*?retrieval=[a-z:]*(\\d*).*?search=[a-z:]*(\\d*).*?");
	    	//eg: expression -- 		  [idle (images=green:200, inpadoc=green:60, other=green:1000, retrieval=green:200, search=green:30)]
	    	Pattern p = Pattern.compile("([a-z]*) \\(images=([a-z]*):(\\d*).*?inpadoc=([a-z]*):(\\d*).*?other=([a-z]*):(\\d*).*?retrieval=([a-z]*):(\\d*).*?search=([a-z]*):(\\d*).*?\\).*");
        	Matcher m = p.matcher(throttlingInformation.get(0));
        	boolean b = m.matches();
        	if (b) 
    		{
        		//System.out.println("Throttling info "+ m.group(1) + " : " + m.group(2) + " : " + m.group(3) + " : " + m.group(4) + " : ");
        		//String temp = m.group(1);
        		String strOb = null;
        		List<String> matcherValues = new ArrayList<String>();
        		int matcherSize = m.groupCount();
        		int n=0;
        		while(n<=matcherSize){
        			Object value = m.group(n);
        			//System.out.println(" ("+value.getClass().getName()+") = >"+value.toString()+"<"); // acDebug
        			strOb = value.toString();
        			if(value instanceof Integer) {
        				value = strOb;
        			}
        			else if (n>1 && strOb.length()>1) {
        				Character chr =  strOb.charAt(0);
        				if (Character.isAlphabetic(chr)) colourCodes += chr;
        			}
        			matcherValues.add(strOb );
        			n++;
        		}
        		
        		if(matcherValues.contains("black")){
        			responseHeader.setHighThrottleStatus(new ThrottleStatusEnum(ThrottleStatusEnum.BLACK));
        			panic("EPO Response resulted in a Throttling Status of BLACK.", null);
        		}
        		else if(matcherValues.contains("red")){
        			responseHeader.setHighThrottleStatus(new ThrottleStatusEnum(ThrottleStatusEnum.RED));
        			panic("EPO Response resulted in a Throttling Status of RED.", null);
        		}
        		else if(matcherValues.contains("yellow"))
        			responseHeader.setHighThrottleStatus(new ThrottleStatusEnum(ThrottleStatusEnum.YELLOW));
        		else if(matcherValues.contains("green"))
        			responseHeader.setHighThrottleStatus(new ThrottleStatusEnum(ThrottleStatusEnum.GREEN));
        		
        		responseHeader.setSystemState(m.group(1));
        		//Finding the highest Throttling Status Colour
        		getResponseHeaderDataForLogs(headerMap);
        		
    		}
	    }
	    
	    List<String> registeredQuotaPerWeekUsed = headerMap.get("X-RegisteredQuotaPerWeek-Used");
	    quotaUsedPerWeek = registeredQuotaPerWeekUsed != null ? Long.valueOf(registeredQuotaPerWeekUsed.get(0)) : 0L;
	    responseHeader.setQuotaUsedPerWeek(quotaUsedPerWeek);

	    List<String> individualQuotaPerHourUsed = headerMap.get("X-IndividualQuotaPerHour-Used");
	    quotaUsedPerHour = individualQuotaPerHourUsed != null ? Long.valueOf(individualQuotaPerHourUsed.get(0)) : 0L;
	    responseHeader.setQuotaUsedPerHour(quotaUsedPerHour);
	    
	    if (throttlingInformation != null) {
	    	responseHeader.setFullThrottlingData(throttlingInformation.get(0));
	    	responseHeader.setConciseColourCodes(emphasise(colourCodes));
	    }
	    
	    return responseHeader;
	}
	
	protected static boolean stringContainsItemFromList(String inputStr, String[] items) {
	    return Arrays.stream(items).parallel().anyMatch(inputStr::contains);
	}
	
	private void getResponseHeaderDataForLogs(Map<String,List<String>> headerMap){
		
		List<String> headerDataArr = new ArrayList<String>();
		String headerD = System.lineSeparator();
		for(Map.Entry<String, List<String>> entry : headerMap.entrySet())
		{
		    //headerDataArr.add(entry.getKey() + ": " + entry.getValue());
			String temp = entry.getKey() + ": " + entry.getValue() + System.lineSeparator();
		    headerD = headerD + temp;
		}
		//return headerDataArr;
		responseHeader.setHeaderData(headerD);
	}

	private String emphasise(String str) {
		if (str==null) return null;
		String emphasised = "";
		Character chr = null; 
		for (int ii = 0 ; ii<str.length() ; ii++) {
			chr = str.charAt(ii);
			if (chr=='r' || chr=='b') chr = Character.toUpperCase(chr);
			emphasised += chr;
		}
		System.out.println("emphasise("+str+") returns "+emphasised);
		return emphasised;
	}

}
