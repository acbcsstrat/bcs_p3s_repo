package com.bcs.p3s.controller.rest;

import java.io.DataOutputStream;
import java.io.IOException;
import java.net.URL;

import javax.net.ssl.HttpsURLConnection;

import com.bcs.p3s.util.lang.Universal;


// Yes, this should be refactored somewhere. Likely service.  acTodo
//  could also de-duplicate associated code in forgot* & register* controllers. 


// thanks to : https://www.journaldev.com/7133/how-to-integrate-google-recaptcha-in-java-web-application

public class CaptcaService extends Universal {   // aka VerifyRecaptcha

	// site key = 6LezdHEUAAAAABvniybP4wWGWWztRMQXT5r0_WMs (used in FE)

	public static final String url = "https://www.google.com/recaptcha/api/siteverify";
	public static final String secret = "6LezdHEUAAAAAHEUeZIDA9plFALpnY2D40XPF9eZ";
	private final static String USER_AGENT = "Mozilla/5.0";

	
		
	/**
	 * Provide the g-recaptcha-response to google to determine if it's genuine. 
	 * @param gRecaptchaResponse
	 * @return Return isGenuine result as boolean
	 * @throws IOException
	 */
	public boolean verify(String gRecaptchaResponse) throws IOException {
		if (gRecaptchaResponse == null || "".equals(gRecaptchaResponse)) {
			return false;
		}
		
		URL obj = new URL(url);
		HttpsURLConnection con = (HttpsURLConnection) obj.openConnection();

		// add request header
		con.setRequestMethod("POST");
		con.setRequestProperty("User-Agent", USER_AGENT);
		con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");

		String postParams = "secret=" + secret + "&response=" + gRecaptchaResponse;

		// Send post request
		con.setDoOutput(true);
		DataOutputStream wr = new DataOutputStream(con.getOutputStream());
		wr.writeBytes(postParams);
		wr.flush();
		wr.close();

		int responseCode = con.getResponseCode();
		//log().debug("CaptcaService.verify(). Google response is "+responseCode );
		//			System.out.println("\nSending 'POST' request to URL : " + url);
		//			System.out.println("Post parameters : " + postParams);
		//			System.out.println("Response Code : " + responseCode);

		return (responseCode==200);
	}
	

	// NOTE: !!   (Andy Chapman 27 Sept 2018)
	// Initially tried to process the response JSON message (using glassfish JSON package)
	// as per (in pom)
	//	<!-- This for Json via Glassfish for google reCaptcha -->
	//	<!-- https://mvnrepository.com/artifact/org.glassfish/javax.json -->
	//	<dependency>
	//	    <groupId>org.glassfish</groupId>
	//	    <artifactId>javax.json</artifactId>
	//	    <version>1.1.2</version>
	//	</dependency>
	// which worked on my (Andy) Dell PC, as follows
	//	response.toString() iS {  "success": true,  "challenge_ts": "2018-09-26T12:46:42Z",  "hostname": "localhost"}
	//	tell me about jsonObject
	//	    size = 3
	//	   Got A key of: success
	//	   Got A key of: challenge_ts
	//	   Got A key of: hostname
	//	2018-09-26 13:47:48,779 INFO  STANDARD - The rest-verify-recaptcha ForgotPassword : captonly / Fred / reCAPTCHA experiment yielded duccess = true  ::
	// but on Pat's PC, caused oddities, with a (antique) uncaughtException.jsp (NOT the jspx) being fed to the FE. Hence just read the response code = 200 for success
	//
	// that code WAS
	//	BufferedReader in = new BufferedReader(new InputStreamReader(
	//	con.getInputStream()));
	//String inputLine;
	//StringBuffer response = new StringBuffer();
	//
	//while ((inputLine = in.readLine()) != null) {
	//System.out.println("Got A line : = "+inputLine);
	//	response.append(inputLine);
	//}
	//in.close();
	//
	//// print result
	//System.out.println("response.toString() iS "+response.toString());
	//
	////parse JSON response and return 'success' value
	//JsonReader jsonReader = null;
	//StringReader sRdr = new StringReader(response.toString()); 
	//jsonReader = Json.createReader(sRdr );
	//
	//JsonObject jsonObject = jsonReader.readObject();
	//jsonReader.close();
	//
	//System.out.println("tell me about jsonObject");
	//System.out.println("    size = " + jsonObject.size());
	//Set<String> keys = jsonObject.keySet();
	//for (String str : keys) {
	//	System.out.println("   Got A key of: " + str);
	//}

}
