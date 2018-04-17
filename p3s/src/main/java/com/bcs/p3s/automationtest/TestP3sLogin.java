/**
 * 
 */
package com.bcs.p3s.automationtest;


import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
//import org.openqa.selenium.chrome.ChromeDriver;
//import org.openqa.selenium.chrome.ChromeOptions;
//import org.openqa.selenium.firefox.FirefoxDriver;
//import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.AssertJUnit;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import com.bcs.p3s.util.config.P3SPropertyException;
import com.bcs.p3s.util.config.P3SPropertyReader;
import com.bcs.p3s.util.env.Hostname;
import com.bcs.p3s.util.lang.Universal;
import com.gargoylesoftware.htmlunit.BrowserVersion;

//import com.gargoylesoftware.htmlunit.BrowserVersion;

/**
 * @author MerinP
 *
 */
public class TestP3sLogin extends Universal{
	
	private HtmlUnitDriver driver;
    private String baseUrl;
    private String indexUrl;
    private StringBuffer verificationErrors = new StringBuffer();
    String host = Hostname.getHostname();
    
    public TestP3sLogin() {
		super();
		
	}

	@BeforeTest
    public void setUp() throws Exception {
    	try{
			P3SPropertyReader reader = new P3SPropertyReader();
			driver = new HtmlUnitDriver(BrowserVersion.CHROME ,true);
	    	driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS); 
	    	
	        if("tomcatb".equals(host)){
	        	System.out.println("Hostname is " + host);
	        	baseUrl = "http://demo.thepatent.place:8080/p3sweb/login";
		        indexUrl = "http://demo.thepatent.place:8080/p3sweb/index.htm#!/dashboard";
		        
	        }
	        else{
	        	System.out.println("Hostname is " + host);
	        	baseUrl = "http://demo.thepatent.place:8080/p3sweb/login";
		        indexUrl = "http://demo.thepatent.place:8080/p3sweb/index.htm";
	        }
	        
	        
		}
		catch (P3SPropertyException e) {
            Assert.fail("com.bcs.p3s.automationtest.TestP3sLogin : setUp() - EPO Request Authorisation property read failed",e);
        }
    	
    }

    @Test
    public void main() throws Exception {
        
    	//Login with incorrect credentials
    	loginIncorrectCredentials();
    	
    	//Login with correct credentials
    	loginCorrectCredentials();
    	
    }
    
    private void loginCorrectCredentials(){
    	
    	
    	//stackoverflow suggestion starts
    	driver.get(baseUrl);
    	WebDriverWait wait = new WebDriverWait(driver, 30);
    	//stackoverflow suggestion ends
    	
    	
    	driver.findElement(By.name("j_username")).clear();
        driver.findElement(By.name("j_username")).sendKeys("merin.paul@boxcleversoftware.com");
        driver.findElement(By.name("j_password")).clear();
        driver.findElement(By.name("j_password")).sendKeys("merin123");
        driver.findElement(By.name("loginBtn")).click();
        try {

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


}
