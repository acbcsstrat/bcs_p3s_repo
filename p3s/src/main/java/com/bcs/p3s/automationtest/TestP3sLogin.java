/**
 * 
 */
package com.bcs.p3s.automationtest;


import org.testng.annotations.Test;
import org.testng.annotations.BeforeMethod;
import org.testng.Assert;
import org.testng.AssertJUnit;
import java.io.File;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxBinary;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.testng.Assert;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import com.bcs.p3s.util.config.P3SPropertyException;
import com.bcs.p3s.util.config.P3SPropertyNames;
import com.bcs.p3s.util.config.P3SPropertyReader;
import com.bcs.p3s.util.env.Hostname;
import com.bcs.p3s.util.lang.Universal;

/**
 * @author MerinP
 *
 */
public class TestP3sLogin extends Universal{
	
	private WebDriver driver;
    private String baseUrl;
    private String indexUrl;
    private StringBuffer verificationErrors = new StringBuffer();
    String host = Hostname.getHostname();
    
    public TestP3sLogin() {
		super();
		
	}


    @BeforeMethod
	@BeforeTest
    public void setUp() throws Exception {
    	try{
			P3SPropertyReader reader = new P3SPropertyReader();
			//driver = new FirefoxDriver(new FirefoxBinary("/opt/AutoDeployment/Firefox/firefox/firefox-bin"), new FirefoxProfile());
	        
	        if("tomcatb".equals(host)){
	        	System.out.println("Hostname is " + host);
	        	baseUrl = "http://demo.thepatent.place:8080/p3sweb/login";
		        indexUrl = "http://demo.thepatent.place:8080/p3sweb/index.htm#!/dashboard";
		        //System.setProperty("webdriver.firefox.bin","/opt/AutoDeployment/Firefox/firefox/firefox-bin");
		        //System.setProperty("webdriver.gecko.driver", "/opt/AutoDeployment/Gecko Driver/geckodriver");
		        System.setProperty("webdriver.firefox.bin","C:/Program Files/Mozilla Firefox/firefox.exe");
		        System.setProperty("webdriver.gecko.driver", "C:/MERIN/Documents/Selenium Testing Notes/geckodriver-v0.20.0-win32/geckodriver.exe");
		        DesiredCapabilities capabilities=DesiredCapabilities.firefox();
		        capabilities.setCapability("marionette", true);
		        driver = new FirefoxDriver();
	        }
	        else{
	        	System.out.println("Hostname is " + host);
	        	baseUrl = "http://localhost:8080/p3sweb/login";
		        indexUrl = "http://localhost:8080/p3sweb/index.htm#!/dashboard";
				/*System.setProperty("webdriver.firefox.bin",
	                    "/opt/AutoDeployment/Firefox/firefox/firefox-bin");*/
				System.setProperty("webdriver.gecko.driver", "C:/MERIN/Documents/Selenium Testing Notes/geckodriver-v0.20.0-win32/geckodriver.exe");
				driver = new FirefoxDriver();
	        }
	        
	        
		}
		catch (P3SPropertyException e) {
            Assert.fail("com.bcs.p3s.automationtest.TestP3sLogin : setUp() - EPO Request Authorisation property read failed",e);
        }
    	
    }

    @Test
   // public void testLoginClass() throws Exception {
    public void main() throws Exception {
        
    	//Login with incorrect credentials
    	loginIncorrectCredentials();
    	
    	//Login with correct credentials
    	loginCorrectCredentials();
    	
    }
    
    private void loginCorrectCredentials(){
    	driver.get(baseUrl);
        //driver.manage().timeouts().implicitlyWait(60, TimeUnit.SECONDS);

        driver.findElement(By.name("j_username")).clear();
        driver.findElement(By.name("j_username")).sendKeys("merin.paul@boxcleversoftware.com");
        driver.findElement(By.name("j_password")).clear();
        driver.findElement(By.name("j_password")).sendKeys("merin123");
        driver.findElement(By.name("loginBtn")).click();
        
        try {
            //assertEquals(driver.findElement(By.id("Your Id for the message")).getText(), "Invalid UserID or Password Entered");

            String URL = driver.getCurrentUrl();
            AssertJUnit.assertEquals(URL, indexUrl);
            //If the message is displayed

            System.out.println("PASS");

        } catch (Exception e) {

            //If the message is not displayed

            System.out.println("FAIL");

            verificationErrors.append(e.toString());

        }
    }
    
    private void loginIncorrectCredentials(){
    	driver.get(baseUrl);
        //driver.manage().timeouts().implicitlyWait(60, TimeUnit.SECONDS);

        driver.findElement(By.name("j_username")).clear();
        driver.findElement(By.name("j_username")).sendKeys("merin@p3s.me");
        driver.findElement(By.name("j_password")).clear();
        driver.findElement(By.name("j_password")).sendKeys("merin");
        driver.findElement(By.name("loginBtn")).click();
        
        try {
            //assertEquals(driver.findElement(By.id("Your Id for the message")).getText(), "Invalid UserID or Password Entered");

            String URL = driver.getCurrentUrl();
            AssertJUnit.assertEquals(URL, baseUrl+"?login_error=t");
            //If the message is displayed
            
            String error_msg=driver.findElement(By.id("loginMessage")).getText();
            String expected_msg = "The username and password do not match our records. Please try again.";
            AssertJUnit.assertEquals(error_msg, expected_msg);

            System.out.println("PASS");

        } catch (Exception e) {

            //If the message is not displayed

            System.out.println("FAIL");

            verificationErrors.append(e.toString());

        }
    }

    /*@AfterTest
    public void tearDown() throws Exception {
        driver.quit();
        String verificationErrorString = verificationErrors.toString();
        if (!"".equals(verificationErrorString)) {
            fail(verificationErrorString);
        }
    }

    @SuppressWarnings("unused")
    private boolean isElementPresent(By by) {
        try {
            driver.findElement(by);
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
    }*/

}
