package com.bcs.p3s.docs.email.Populators;

import java.util.List;

import com.bcs.p3s.docs.email.P3sEmail;
import com.bcs.p3s.docs.email.P3sEmailData;
import com.bcs.p3s.util.lang.Universal;

public abstract class AbstractPopulator extends Universal implements PopulatorInterface {

	protected final int MAXTAGS_PER_LINE = 3;
	protected final String CRLF = "\n";
	
	
	protected String templateName = null;
	protected P3sEmailData data = new P3sEmailData();
	
	protected String subject;
	protected String htmlBody;
	protected String attachmentPath;
	protected String attachmentFilename;



	public AbstractPopulator(String templateName) {
		this.templateName = templateName;
	}
	
	public abstract P3sEmail generateEmail(); // Read template, instantiate p3sEmail, do inject


	
	// Code for Injecting values
	final String SQUAREOPEN = "[";
	protected String currentLine = "";		// For temporary use during injection. NEVER null
	StringBuilder bodyWip = new StringBuilder(""); 
	protected abstract boolean doAllInjectionsForCurrentLine();  // Subtype knows which of the below replace*() methods to call 
	/** This has the big loop, and invokes the subtype doAllInjectionsForCurrentLine() for each line **/
	protected String doAllInjectionsIntoBody(List<String> wholeTemplate) { 
		String err = "AbstractPopulator doAllInjectionsIntoBody ("+templateName+") : ";
		// 1st line of template is subject line. Already processed. so remove it
		wholeTemplate.remove(0);
		for (String preInjectLine : wholeTemplate) {
			currentLine = preInjectLine;
			boolean moreInjectionsNeeded = (currentLine.indexOf(SQUAREOPEN)!=-1);
			int attempts = 0;
			while (moreInjectionsNeeded) {
				moreInjectionsNeeded = doAllInjectionsForCurrentLine();
				if (attempts++ >= MAXTAGS_PER_LINE)	
					fail(err+" FAILED to eradicate [s after "+MAXTAGS_PER_LINE
							+" ATTEMPTS. line NOW is "+currentLine+" :: Line WAS : "+preInjectLine);
				zz(err+" attempt "+attempts+" (result:"+moreInjectionsNeeded+") for line: "+currentLine);
			}
			bodyWip.append(CRLF);
			bodyWip.append(currentLine);
		}
		return bodyWip.toString();
	}
	
	
	// Regular getters & setters
	
	public String getTemplateName() {
		return templateName;
	}

	public void setTemplateName(String template) {
		this.templateName = template;
	}

	public P3sEmailData getData() {
		return data;
	}

	public void setData(P3sEmailData data) {
		this.data = data;
	}


	
	protected void zz(String s) {  // acTidy
		System.out.println("zz: "+s);
	}
	
}
