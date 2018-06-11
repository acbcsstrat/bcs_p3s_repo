package com.bcs.p3s.util.scrape;


import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.Charset;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import com.bcs.p3s.scrape.model.ResponseHeaderPojo;
import com.bcs.p3s.util.config.P3SPropertyNames;
import com.bcs.p3s.util.config.P3SPropertyReader;
import com.bcs.p3s.util.lang.Universal;

public class OPSReader extends Universal{
	
	protected String PREFIX = this.getClass().getName() + " : "; 
	
	private String ACCESS_KEY;
	
	private ResponseHeaderReader responseHeaderReader = new ResponseHeaderReaderImpl();
	
	ResponseHeaderPojo responseHeader = new ResponseHeaderPojo();
	
	private long quotaUsedPerHour;
	
	private long quotaUsedPerWeek;
	
	public String readEPO(String search_url) { 
		
		String msg = PREFIX + "readEPO(" + search_url + ")";
		URL url;
		try {
			
			OPSOAuthEngine authUtilsObj = new OPSOAuthEngine();
			if (ACCESS_KEY == null)
				ACCESS_KEY = authUtilsObj.getAccessKey();
			log().debug(msg + " invoked to connect to EPO");
			
			//String strUrl = "http://ops.epo.org/3.2/rest-services/register/application/epodoc/" + patentApplicationNumber + "/biblio,procedural-steps";
		
			url = new URL(search_url);
		
			URLConnection request 	= url.openConnection();
			
			request.addRequestProperty("Authorization", "Bearer " + ACCESS_KEY);
			
			StringBuilder content = new StringBuilder();
			
			if(ACCESS_KEY == null){
				log().error("Request Authorisation null. Request aborted");
				return null;
			}
			
			//Pre checking for authorisation success before sending request
			
			System.out.println("Opening URL connection: " + url);
			log().debug("Opening URL connection: " + url);
			request.connect();
			log().debug("Connected to EPO");
				
				
			//Digest the Header information
		    responseHeader = this.responseHeaderReader.readResponseHeaderData(request);
		    /*this.setThrottleStatus(this.responseHeaderReader.getThrottleStatus());
		    this.setQuotaUsedPerHour(this.responseHeaderReader.getQuotaUsedPerHour());
		    this.setQuotaUsedPerWeek(this.responseHeaderReader.getQuotaUsedPerWeek());*/
		        
		    InputStream is		=	request.getInputStream();
			InputStreamReader isr 	= new InputStreamReader(is, Charset.forName("UTF-8"));
			BufferedReader br 		= new BufferedReader(isr);
			   
			String cp;
			while ((cp = br.readLine()) !=null ) {
				content.append( cp);
			}
			byte[] utf8Bytes = content.toString().getBytes("UTF-8");
			System.out.println("Response has been read. Download size is approximately " + utf8Bytes.length + " bytes");
			log().debug("Response has been read. Download size is approximately " + utf8Bytes.length + " bytes");
			    
			    
			//Logging for response header starts
			logEpo().debug("\n\n\nResponse Header for request " + search_url);
			logEpo().debug("Full header to follow ");
			logEpo().debug(responseHeader.getHeaderData());

			
			
//			logEpo().info(" ##### Summary header info %29F::: Total downloaded Size for this request :: "+ utf8Bytes.length + " bytes" +
//			    		" && Highest Throttling Status :: " + responseHeader.getHighThrottleStatus() +
//			    		" && System state :: " + responseHeader.getSystemState() + " && Quota Used This Week :: " + responseHeader.getQuotaUsedPerWeek() + 
//			    		" && Quota Used This Hour :: " + responseHeader.getQuotaUsedPerHour() + " && X-Throttling-Control :: " + responseHeader.getFullThrottlingData() +" ##### " );

			String greppableLogSummary = "w~Summary: ccodes=" + responseHeader.getConciseColourCodes()
					+ "; TotSize="+ to8char(utf8Bytes.length) 
		    		+ "; QuotaThisWeek=" + to10char(responseHeader.getQuotaUsedPerWeek())  
		    		+ "; QuotaThisHour=" + to10char(responseHeader.getQuotaUsedPerHour()) 
		    		+ "; WorstColour=" + responseHeader.getHighThrottleStatus() 
		    		+ "; Status=" + responseHeader.getSystemState() 
		    		+ "; X-Throttling-Control :: " + responseHeader.getFullThrottlingData();

			logEpo().info(greppableLogSummary);
			
			logEpo().debug("Authentication app name used is "+ new P3SPropertyReader().getESProperty(P3SPropertyNames.P3S_EPO_APP_NAME));
			logEpo().debug("Response Header Ends");
		    
			return content.toString();	
	
		} catch (MalformedURLException e) {
			
			StringWriter stack = new StringWriter();
		    e.printStackTrace(new PrintWriter(stack));
		    log().debug("Caught exception; inside "+ msg + " : " + stack.toString());
		}
		catch (FileNotFoundException e) {
			log().debug("No data found for search url " + search_url);
			return null;
		}
		catch (IOException e) {
			
			StringWriter stack = new StringWriter();
		    e.printStackTrace(new PrintWriter(stack));
		    log().debug("Caught exception; inside "+ msg + " : " + stack.toString());
		}
		catch (Exception e) {
			
			StringWriter stack = new StringWriter();
		    e.printStackTrace(new PrintWriter(stack));
		    log().debug("Caught exception; inside "+ msg + " : " + stack.toString());
		}
		return null;
	}

	//protected String toKilo(long lFullNumber) {
	//	// Divide by 1,000 (round up), append 'k', add commas 
	//	String num = "";
	//	BigDecimal ONETHOUSAND = new BigDecimal(1000);
	//	BigDecimal bdFullNumber = new BigDecimal(lFullNumber);  
	//	BigDecimal kilo = bdFullNumber.divide(ONETHOUSAND, 0, BigDecimal.ROUND_UP); 
	//	
	//	DecimalFormat df = new DecimalFormat("#,##0");
	//	df.setDecimalFormatSymbols(new DecimalFormatSymbols(Locale.UK));
	//
	//	num = df.format(kilo) + "k";
	//	
	//	return num;
	//}
	
	protected String to10char(long lFullNumber) {
		// Divide by 1,000 (round up), append 'k', add commas
		// 10char being N,nnn,nnnk  pad leading spaces
		String num = "";

		if (lFullNumber > 9900900900L) return "*TOO BIG!*";
		
		BigDecimal ONETHOUSAND = new BigDecimal(1000);
		BigDecimal bdFullNumber = new BigDecimal(lFullNumber);  
		BigDecimal kilo = bdFullNumber.divide(ONETHOUSAND, 0, BigDecimal.ROUND_UP); 
		
		DecimalFormat df = new DecimalFormat("#,##0");
		df.setDecimalFormatSymbols(new DecimalFormatSymbols(Locale.UK));
	
		num = df.format(kilo) + "k";
		
		return String.format("%1$10s", num);
	}
	protected String to8char(long lFullNumber) {
		String big = to10char(lFullNumber);
		if (big.trim().length()>8) return "*TOO BIG";
		else return big.substring(2);

	
	}
	
}
