/**
 * 
 */
package com.bcs.p3s.automationtest;


import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.AssertJUnit;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import com.gargoylesoftware.htmlunit.BrowserVersion;

//import com.gargoylesoftware.htmlunit.BrowserVersion;

/**
 * @author MerinP
 *
 */
public class TestP3sLogin{
	
	private HtmlUnitDriver driver;
	private String URL;
    private String baseUrl;
    private String indexUrl;
    private StringBuffer verificationErrors = new StringBuffer();
    
    public TestP3sLogin() {
		super();
		
	}

	@BeforeTest
    public void setUp() throws Exception {
			//P3SPropertyReader reader = new P3SPropertyReader();
			driver = new HtmlUnitDriver(BrowserVersion.CHROME ,true);
	    	driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS); 
	    	
	        baseUrl = "http://demo.thepatent.place:8080/p3sweb/login";
		    indexUrl = "http://demo.thepatent.place:8080/p3sweb/index.htm";
		        
    	
    }

    @Test
    public void main() throws Exception {
        
    	//Login with incorrect credentials
    	loginIncorrectCredentials();
    	
    	//Login with correct credentials
    	loginCorrectCredentials();
    	
    	//Logout function check
    	logoutFnCheck();
    	
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

            URL = driver.getCurrentUrl();
            driver.get(URL);
            AssertJUnit.assertEquals(URL, indexUrl);
            //If the message is displayed
            System.out.println("loginCorrectCredentials() ::: PASS");
            
        } catch (Exception e) {

            System.out.println("loginCorrectCredentials() ::: FAIL");
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

            System.out.println("loginIncorrectCredentials() ::: PASS");

        } catch (Exception e) {

            //If the message is not displayed

            System.out.println("loginIncorrectCredentials() ::: FAIL");

            verificationErrors.append(e.toString());

        }
    }

    private void logoutFnCheck(){
    	
    	 try {
             
             //Logout function check
    		 String URL = driver.getCurrentUrl();
             driver.findElement(By.name("logoutLink")).click();
             URL = driver.getCurrentUrl();
             AssertJUnit.assertEquals(URL, baseUrl);
             
             System.out.println("logoutFnCheck() ::: PASS");

         } catch (Exception e) {

             System.out.println("logoutFnCheck() ::: FAIL");

             verificationErrors.append(e.toString());

         }
    }

}
