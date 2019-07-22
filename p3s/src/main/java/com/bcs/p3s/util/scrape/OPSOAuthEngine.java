package com.bcs.p3s.util.scrape;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.StringReader;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.Charset;
import java.util.Base64;
import java.util.LinkedList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;



import org.springframework.util.StringUtils;

import com.bcs.p3s.enump3s.ThrottleStatusEnum;
import com.bcs.p3s.util.config.P3SPropertyException;
import com.bcs.p3s.util.config.P3SPropertyNames;
import com.bcs.p3s.util.config.P3SPropertyReader;
import com.bcs.p3s.util.lang.Universal;



public class OPSOAuthEngine extends Universal{
	
	/*final static String CONSUMER_KEY = "oBAMyeG2LwnzJgzhiGjndDuwvJyR9pgP";	
	
	final static String CONSUMER_SECRET = "ZoBsGMP3F5LMgmwJ";
	
	final static String EPO_APP_NAME = "";*/
	private String epoAppName = null;
    private String epoAppKey  = null;
    private String epoSecret  = null;
	 
	private static final String ACCESS_URL = "https://ops.epo.org/3.2/auth/accesstoken";

    private long quotaUsedPerHour;
	
	private long quotaUsedPerWeek;
	
	private ThrottleStatusEnum throttleStatus;
	
	private long accessInterval;

	
	
	public OPSOAuthEngine() {
		
		
        try {
	        P3SPropertyReader reader = new P3SPropertyReader();
	        epoAppName = reader.getESProperty(P3SPropertyNames.P3S_EPO_APP_NAME); 
	        epoAppKey  = reader.getESProperty(P3SPropertyNames.P3S_EPO_CONSUMER_KEY); 
	        epoSecret  = reader.getESProperty(P3SPropertyNames.P3S_EPO_CONSUMER_SECRET_KEY); 
	        
	        log().debug("EPO Request Authorisation property read success ");
        } catch (P3SPropertyException e) {
            fail("com.bcs.p3s.util.scrape.OAuthOPSUtils : OAuthOPSUtils() - EPO Request Authorisation property read failed",e);
        }

	}



	/**
	 * @param args
	 */
	public String getAccessKey() {
		
		String msg = "com.bcs.p3s.util.scrape.OAuthOPSUtils : getAccessKey()";
		
		String ACCESS_TOKEN = null;
		URL url = null;
		
	    try {
	        url = new URL(ACCESS_URL);
	    } 
	    catch (MalformedURLException e) {
	        System.out.println("MalformedUrlException: " + e.getMessage());
	        e.printStackTrace();
	        return ACCESS_TOKEN;
	    }

	    HttpURLConnection uc = null;
	    
	    try {
	        uc = (HttpURLConnection) url.openConnection();
	        uc.setRequestMethod("POST");
	    } 
	    catch (IOException e) {
	        System.out.println("IOException: " + e.getMessage());
	        e.printStackTrace();
	        return ACCESS_TOKEN;
	    }

	    try{
	    	
	    	if(epoAppKey ==null || epoSecret == null){
	    		log().error("EPO Request Authorisation property read failed. App key/secret key is/are null " + msg);
	    		return null;
	    	}
		    String userpass = epoAppKey + ":" + epoSecret;
		    
		    String base64EncodedStr = Base64.getEncoder().encodeToString(userpass.getBytes("UTF-8"));
		    //String old = javax.xml.bind.DatatypeConverter.printBase64Binary(userpass.getBytes());
		    //System.out.println("New value is :" + base64EncodedStr +" and old value is " + old);
		    
		    //String basicAuth = "Basic " + javax.xml.bind.DatatypeConverter.printBase64Binary(userpass.getBytes());
		    log().debug("Base64Encode(CONSUMER_KEY:CONSUMER_SECRET) is " + base64EncodedStr);
		    String basicAuth = "Basic " + base64EncodedStr;
	
		    uc.setRequestProperty("Authorization", basicAuth);
		    uc.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
		    uc.setDoOutput(true);
		    uc.setDoInput(true);
		    
		    OutputStream output = uc.getOutputStream();
		    output.write("grant_type=client_credentials".getBytes("UTF-8"));
	    } catch (UnsupportedEncodingException e) {
	    	StringWriter stack = new StringWriter();
		    e.printStackTrace(new PrintWriter(stack));
		    log().debug("Caught exception; inside "+ msg + " : " + stack.toString());
		} catch (IOException e) {
			StringWriter stack = new StringWriter();
		    e.printStackTrace(new PrintWriter(stack));
		    log().debug("Caught exception; inside "+ msg + " : " + stack.toString());
		}

	    InputStream is = null;
	    System.out.println(uc.getHeaderFields());
	    
	    try {
	        is = uc.getInputStream();
	    } catch (IOException e) {
	    	StringWriter stack = new StringWriter();
		    e.printStackTrace(new PrintWriter(stack));
		    log().debug("Caught exception; inside "+ msg + " : " + stack.toString());
	        return null;
	    }
	    
	    if (true) {
	        BufferedReader buffReader = new BufferedReader(new InputStreamReader(is));
	        StringBuffer response = new StringBuffer();

	        String line = null;
	        try {
	            line = buffReader.readLine();
	        } catch (IOException e) {
	        	StringWriter stack = new StringWriter();
			    e.printStackTrace(new PrintWriter(stack));
			    log().debug("Caught exception; inside "+ msg + " : " + stack.toString());
	            return null;
	        }
	        while (line != null) {
	            response.append(line);
	            response.append('\n');
	            try {
	                line = buffReader.readLine();
	            } catch (IOException e) {
	            	StringWriter stack = new StringWriter();
	    		    e.printStackTrace(new PrintWriter(stack));
	    		    log().debug("Caught exception; inside "+ msg + " : " + stack.toString());
	                return null;
	            }
	        }
	        try {
	            buffReader.close();
	        } catch (IOException e) {
	        	StringWriter stack = new StringWriter();
			    e.printStackTrace(new PrintWriter(stack));
			    log().debug("Caught exception; inside "+ msg + " : " + stack.toString());
	            return null;
	        }

	        Pattern p = Pattern.compile("\\\"access_token\\\": \\\"([a-zA-Z0-9]+?)\\\".*");
	        Matcher m = p.matcher(response.toString());
	        
	        if (m.find()) { 
	        	System.out.println("Access Token: " + (ACCESS_TOKEN = m.group(1))); 
	        	log().info("ACCESS_TOKEN obtained is " + ACCESS_TOKEN);
	        }
	       
	    }
	    return ACCESS_TOKEN;
	}

}
