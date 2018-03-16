package com.bcs.p3s.util.scrape;


import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.Charset;
import java.util.List;
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
	
	public String readEPO(String patentApplicationNumber) { 
		
		String msg = PREFIX + "readEPO(" + patentApplicationNumber + ")";
		URL url;
		try {
			
			OPSOAuthEngine authUtilsObj = new OPSOAuthEngine();
			if (ACCESS_KEY == null)
				ACCESS_KEY = authUtilsObj.getAccessKey();
			log().debug(msg + " invoked to connect to EPO");
			
			String strUrl = "http://ops.epo.org/3.2/rest-services/register/application/epodoc/" + patentApplicationNumber + "/biblio,procedural-steps";
		
			url = new URL(strUrl);
		
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
			logEpo().debug("\n\n\nResponse Header for request " + strUrl);
			logEpo().debug("Full header to follow ");
			logEpo().debug(responseHeader.getHeaderData());
			logEpo().info(" ##### Summary header info %29F::: Total downloaded Size for this request :: "+ utf8Bytes.length + " bytes" +
			    		" && Highest Throttling Status :: " + responseHeader.getHighThrottleStatus() +
			    		" && System state :: " + responseHeader.getSystemState() + " && Quota Used This Week :: " + responseHeader.getQuotaUsedPerWeek() + 
			    		" && Quota Used This Hour :: " + responseHeader.getQuotaUsedPerHour() + " && X-Throttling-Control :: " + responseHeader.getFullThrottlingData() +" ##### " );
			logEpo().debug("Authentication app name used is "+ new P3SPropertyReader().getESProperty(P3SPropertyNames.P3S_EPO_APP_NAME));
			logEpo().debug("Response Header Ends");
		    
			return content.toString();	
	
		} catch (MalformedURLException e) {
			
			StringWriter stack = new StringWriter();
		    e.printStackTrace(new PrintWriter(stack));
		    log().debug("Caught exception; inside "+ msg + " : " + stack.toString());
		}
		catch (FileNotFoundException e) {
			log().debug("No data found for application number " + patentApplicationNumber);
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
		
}
