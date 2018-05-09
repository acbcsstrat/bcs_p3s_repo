/**
 * 
 */
package com.bcs.p3s.automationtest;


import java.io.File;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

import org.apache.commons.io.FileUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.phantomjs.PhantomJSDriver;
import org.openqa.selenium.phantomjs.PhantomJSDriverService;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.AssertJUnit;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import com.bcs.p3s.util.Hostname;


/**
 * @author MerinP
 *
 */
public class TestP3sLogin{
	
	private WebDriver driver;
	private String URL;
    private String baseUrl;
    private String indexUrl;
    private StringBuffer verificationErrors = new StringBuffer();
    protected String host = Hostname.getHostname();
    String screenshotPath = null;
    
    public TestP3sLogin() {
		super();
		
	}

	@BeforeTest
    public void setUp() throws Exception {
		
		/*File file = new File("C:/Program Files/phantomjs-2.1.1-windows/bin/phantomjs.exe");				
	    System.setProperty("phantomjs.binary.path", file.getAbsolutePath());		
	    driver = new PhantomJSDriver();	*/
		
		DesiredCapabilities caps = new DesiredCapabilities();
	    caps.setJavascriptEnabled(true);
	    caps.setCapability("takesScreenshot", true);
	    
	    //Local testing in Merin's PC
	    if("avid-ox790-013".equals(host)){
	    	caps.setCapability(PhantomJSDriverService.PHANTOMJS_EXECUTABLE_PATH_PROPERTY, "C:/Program Files/phantomjs-2.1.1-windows/bin/phantomjs.exe");
	    	screenshotPath = "C:/MERIN/Workspace/P3S-workspace/PhantomJSTest/test-output/";
	    	/** for local testing **/
			baseUrl = "http://localhost:8080/p3sweb/login";
			indexUrl = "http://localhost:8080/p3sweb/index.htm#!/dashboard";
	    }
	    else{
	    	caps.setCapability(PhantomJSDriverService.PHANTOMJS_EXECUTABLE_PATH_PROPERTY, "/opt/PhantomJS/phantomjs-2.1.1-linux-x86_64/bin/phantomjs");
	    	screenshotPath = "/var/automated testing/screens/";
	    	baseUrl = "http://demo.thepatent.place:8080/p3sweb/login";
	        indexUrl = "http://demo.thepatent.place:8080/p3sweb/index.htm#!/dashboard";
	    }

	    driver = new PhantomJSDriver(caps);
	    driver.manage().timeouts().pageLoadTimeout(2000, TimeUnit.SECONDS);
	    
		        
    }

    @Test(priority = 1)
    private void loginCorrectCredentials(){
    	
        driver.get(baseUrl);
    	driver.findElement(By.name("j_username")).clear();
    	if("avid-ox790-013".equals(host))
    		driver.findElement(By.name("j_username")).sendKeys("merin@p3s.me");
    	else
    		driver.findElement(By.name("j_username")).sendKeys("merin.paul@boxcleversoftware.com");
        driver.findElement(By.name("j_password")).clear();
        driver.findElement(By.name("j_password")).sendKeys("merin123");
        driver.findElement(By.name("loginBtn")).click();
        try {

            URL = driver.getCurrentUrl();
            driver.get(URL);
            Assert.assertEquals(URL, indexUrl);
            
            //wait till dashboard loads completely
            WebDriverWait wait = new WebDriverWait(driver, 40);
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("recentactivitywidget")));
            
            captureScreenshots("dashboard.png");
            
        } catch (Exception e) {

            verificationErrors.append(e.toString());
        }
        
    }
    
    @Test(priority = 0)
    private void loginIncorrectCredentials(){
    	driver.get(baseUrl);

        driver.findElement(By.name("j_username")).clear();
        driver.findElement(By.name("j_username")).sendKeys("merin@p3s.me");
        driver.findElement(By.name("j_password")).clear();
        driver.findElement(By.name("j_password")).sendKeys("merin");
        driver.findElement(By.name("loginBtn")).click();
        
        try {

            String URL = driver.getCurrentUrl();
            Assert.assertEquals(URL, baseUrl+"?login_error=t");
            
            String error_msg=driver.findElement(By.id("loginMessage")).getText();
            String expected_msg = "The username and password do not match our records. Please try again.";
            AssertJUnit.assertEquals(error_msg, expected_msg);
            
            captureScreenshots("loginInCorrect.png");
            
        } catch (Exception e) {

            //If the message is not displayed

            //System.out.println("loginIncorrectCredentials() ::: FAIL");

            verificationErrors.append(e.toString());
            System.out.println("Error occured");
            e.printStackTrace();

        }
    }

    //@Test(dependsOnMethods = { "loginCorrectCredentials" })
    @Test(priority=2)
    private void logoutFnCheck(){
    	
    	
    	driver.findElement(By.name("logoutLink")).click();
    	driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
    	 try {
             
    		 URL = driver.getCurrentUrl();
             //Logout function check
             Assert.assertEquals(URL, baseUrl);
             
             captureScreenshots("logoutPassed.png");

         } catch (Exception e) {

             verificationErrors.append(e.toString());

         }
    }

    protected void captureScreenshots(String screenshotName){
    	
    	System.out.println("Taking screenshot now for "+ screenshotName);
    	try {
    		 //driver = (PhantomJSDriver) new Augmenter().augment(driver);
	        File srcFile = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
	        System.out.println("File:" + srcFile);
			FileUtils.copyFile(srcFile, new File(screenshotPath+screenshotName));
		} catch (IOException e) {
			e.printStackTrace();
		}
        System.out.println("Screenshots captured for " + screenshotName);
    }

}
