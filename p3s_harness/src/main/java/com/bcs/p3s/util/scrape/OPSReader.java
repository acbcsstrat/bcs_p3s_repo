package com.bcs.p3s.util.scrape;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.log;

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

import com.bcs.p3s.util.lang.Universal;

public class OPSReader extends Universal{
	
	protected String PREFIX = this.getClass().getName() + " : "; 
	
	public String readEPO(String patentApplicationNumber) { 
		
		String msg = PREFIX + "readEPO(" + patentApplicationNumber + ")";
		URL url;
		try {
			log().debug(msg + " invoked to connect to EPO");
		
			url = new URL("http://ops.epo.org/3.1/rest-services/register/application/epodoc/" + patentApplicationNumber + "/biblio,procedural-steps");
		
			URLConnection request 	= url.openConnection();
			
			System.out.println("Opening URL connection: " + url);
			log().debug("Opening URL connection: " + url);
			request.connect();
			log().debug("Connected to EPO");
			
			InputStream is		=	request.getInputStream();
		    InputStreamReader isr 	= new InputStreamReader(is, Charset.forName("UTF-8"));
		    BufferedReader br 		= new BufferedReader(isr);
		   
		    StringBuilder content = new StringBuilder();
		   
			String cp;
			while ((cp = br.readLine()) !=null ) {
				content.append( cp);
			}
			byte[] utf8Bytes = content.toString().getBytes("UTF-8");
		    System.out.println("Response has been read. Download size is approximately " + utf8Bytes.length + " bytes");
		    log().debug("Response has been read. Download size is approximately " + utf8Bytes.length + " bytes");
		    
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
		return null;
		
	}

}
