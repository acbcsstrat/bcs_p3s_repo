package harnessjdbc;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Properties;

import com.bcs.p3s.util.env.P3SEnvironmentKnowledge;
import com.bcs.p3s.util.lang.Universal;

public class DBConnection extends Universal{
	
	
	public Connection connectToDB(){
		
		Connection connection = null;
		
		String msg = "DBConnection: connectToDB()";
		log().debug(msg +" invoked");
		try{
			DBCredentials db = getDBCredentails();
			Class.forName(db.getDriverClass());
			connection = DriverManager.getConnection(db.getDbUrl(), db.getDbUserName(), db.getDbPwd());
			
			if(connection == null){
				log().error("DB connection failed");
				return null;
			}
			
			log().debug("DB Connected successfully");
				
		}
		catch(Exception e){
			log().error("Error connecting to DB ");
		}
		
		return connection;
	}
	
	
	protected DBCredentials getDBCredentails(){
		
		Properties prop = new Properties();
		
		DBCredentials db = new DBCredentials();
		InputStream input = null;
	
		try {
	
			String property_path = new P3SEnvironmentKnowledge().getDatabaseConfigFilespec();
			
			input = new FileInputStream(property_path);
			//input = DBConnection.class.getClassLoader().getResourceAsStream("/META-INF/spring/database.properties");
	
			// load a properties file
			prop.load(input);
			
			db.setDriverClass(prop.getProperty("database.driverClassName"));
			db.setDbUrl(prop.getProperty("database.url"));
			db.setDbUserName(prop.getProperty("database.username"));
			db.setDbPwd(prop.getProperty("database.password"));
			
			return db;
		}
		
		catch (IOException ex) {
			ex.printStackTrace();
			log().error("Error reading DB properties");
		}
		finally {
			if (input != null) {
				try {
					input.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		
		return db;
	}
	

}
