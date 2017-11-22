package com.bcs.p3s.docs.email.template;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import com.bcs.p3s.util.env.P3SEnvironmentKnowledge;
import com.bcs.p3s.util.lang.Universal;

public class EmailTemplateReader extends Universal {

	public List<String> readTemplate(String templateName) {
		String err = "EmailTemplateReader readTemplate : ";
		log().debug(err+"invoked with : "+templateName);
		
		List<String> templateContent = null; 
		
		P3SEnvironmentKnowledge envKnowledge = new P3SEnvironmentKnowledge();
		String templatespath = envKnowledge.getMainPropertyFilePath() + "templates/"; 
		String filename = ""+templateName+".txt";
		//System.out.println("EmailTemplateReader: path = "+templatespath);
		
		Path path = Paths.get(templatespath+filename);
		try {
			templateContent = Files.readAllLines(path); // Read whole template file
		}
		catch (IOException io) {
			fail(err+"Error reading file",io);
		}

		return templateContent;
	}
	
}
