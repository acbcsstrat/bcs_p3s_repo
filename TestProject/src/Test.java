
import java.net.MalformedURLException;
import java.net.URL;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
/*import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;*/
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.AssertJUnit;

import com.gargoylesoftware.htmlunit.BrowserVersion;

import io.github.bonigarcia.wdm.WebDriverManager;

public class Test {

	public static void main(String[] args) throws MalformedURLException {

		/*String baseUrl = "http://demo.thepatent.place:8080/p3sweb/login";
		String indexUrl = "http://demo.thepatent.place:8080/p3sweb/index.htm#!/dashboard";
		System.setProperty("webdriver.firefox.bin","C:/Program Files/Mozilla Firefox");
		System.setProperty("webdriver.gecko.driver", "C:/MERIN/Documents/Selenium Testing Notes/geckodriver-v0.20.0-win32/geckodriver.exe");
		System.setProperty("webdriver.firefox.bin","/opt/AutoDeployment/Firefox/firefox/firefox-bin");
        System.setProperty("webdriver.gecko.driver", "/opt/AutoDeployment/Gecko Driver/geckodriver");
		DesiredCapabilities capabilities=DesiredCapabilities.firefox();
		capabilities.setCapability("marionette", true);*/
		
		//System.setProperty("webdriver.firefox.bin","/opt/AutoDeployment/Firefox/firefox/firefox-bin");
		//System.setProperty("webdriver.firefox.bin","C:\\Program Files\\Mozilla Firefox\\firefox.exe");
		
		/** BELOW FOR FIREFOX SETTINGS **/
		
		/*WebDriverManager.firefoxdriver().setup();
		System.setProperty("webdriver.firefox.bin","file://192.168.200.89/C:/Program Files/Mozilla Firefox/firefox.exe");
		WebDriver driver = new FirefoxDriver();
		driver.get("http://demo.thepatent.place:8080/p3sweb/login");*/
		
		/** BELOW FOR CHROME SETTINGS **/
		/*new DesiredCapabilities();
        URL serverurl = new URL("http://localhost:9515");
        DesiredCapabilities capabilities = DesiredCapabilities.chrome();
        WebDriver driver = new RemoteWebDriver(serverurl,capabilities);
        driver.get("http://demo.thepatent.place:8080/p3sweb/login");*/
		
		//System.setProperty("webdriver.chrome.driver", "/opt/AutoDeployment/Chrome/chromedriver");
		System.setProperty("webdriver.chrome.driver", "C:/MERIN/Documents/Selenium Testing Notes/Chrome/chromedriver_win32/chromedriver.exe");

        // Add options to Google Chrome. The window-size is important for responsive sites
        /*ChromeOptions options = new ChromeOptions();
        options.addArguments("headless");
        options.addArguments("window-size=1200x600");
        
        options.addArguments("disable-extensions");
        //options.addArguments("headless");
        options.addArguments("disable-gpu");
        options.addArguments("no-sandbox");

        WebDriver driver = new ChromeDriver(options);*/
		
		HtmlUnitDriver driver = new HtmlUnitDriver(BrowserVersion.CHROME ,true);
    	driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);  
    	driver.get("http://localhost:8080/p3sweb/login");
    	WebDriverWait wait = new WebDriverWait(driver, 30);

        //driver.get("http://demo.thepatent.place:8080/p3sweb/login");
        
        driver.findElement(By.name("j_username")).clear();
        driver.findElement(By.name("j_username")).sendKeys("merin.paul@boxcleversoftware.com");
        driver.findElement(By.name("j_password")).clear();
        driver.findElement(By.name("j_password")).sendKeys("merin123");
        driver.findElement(By.name("loginBtn")).click();
        
        try {
            //assertEquals(driver.findElement(By.id("Your Id for the message")).getText(), "Invalid UserID or Password Entered");

        	String indexUrl = "http://localhost:8080/p3sweb/index.htm";
            String URL = driver.getCurrentUrl();
            AssertJUnit.assertEquals(URL, indexUrl);
            //If the message is displayed

            System.out.println("PASS");

        } catch (Exception e) {

            //If the message is not displayed

            System.out.println("FAIL");

           // verificationErrors.append(e.toString());

        }
	}

}
