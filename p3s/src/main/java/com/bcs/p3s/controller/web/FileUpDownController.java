package com.bcs.p3s.controller.web;

import java.io.InputStream;
import java.sql.Blob;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.bcs.p3s.model.Epct;
import com.bcs.p3s.model.Form1200;
import com.bcs.p3s.service.Form1200Service;
import com.bcs.p3s.util.lang.Universal;

/**
 * Controller provided for Upload and Download of files (Images, PDFs, ..)
 * 
 */


@Controller
public class FileUpDownController  extends Universal {

	@Autowired
    Form1200Service form1200Service;

    @Autowired
    HttpSession session ;

	
	
	// ------------------------------ view form1200 PDF from Blob --------------------------------------------

	/**
	 * FE requests the prepared Form1200 PDF. Either to View (Default) or Download
	 * Default filename provided is download.pdf, though optional 'download' parameter changes this
	 * 
	 * @param epctId Identifies which PDF is to be downloaded
	 * @param download OPTIONAL. If true, BE sets filename, which is likely to cause the browser to unconditionally download the file. Filename format is EPnnnnnnnn_form1200.pdf
	 */
	@RequestMapping(value = "/download.pdf", method = RequestMethod.GET, produces = "application/pdf")
	public void streamForm1200Pdf(@RequestParam(required = true) Long epctId, @RequestParam(required = false) Boolean download,
			HttpServletRequest request, HttpServletResponse response) 
	{

		// If 'download' is absent, default to false (ie View, not Download)
		boolean isDownloadNotView = false;
		if (download!=null && ((Boolean) download)==true) isDownloadNotView = true;  
		String err = CLASSNAME + " /download.pdf  = streamForm1200Pdf(epctId="+epctId+", download="+isDownloadNotView+") ";
		log().debug(err + "invoked");

		byte[] bytearray = new byte[4194304]; // 4MB. = Current size limit

		try {

			Epct epct = form1200Service.findEpct(epctId); // Includes safety authorisation check

			Blob blobby = null;
			if (epct != null) {
				Form1200 form1200 = epct.getForm1200();
				if (form1200 != null) {
					blobby = form1200.getPdfBlob();
				}
			}

			if (blobby == null) {
				log().error("IS NO f1200 PDF IN dB FOR Epct ID " + epctId+"   from "+err);
				response.setContentType("application/pdf");
				response.getOutputStream().write(bytearray, 0, 0);
			} else {
				int size = 0;
				InputStream sImage = blobby.getBinaryStream();
				while ((size = sImage.read(bytearray)) != -1) {
					log().debug("in loop reading f1200 pdf. Size this loop iteration is " + size+"    from "+err);
					response.setContentType("application/pdf");
					if (isDownloadNotView) {
						String pdfFilename = epct.getPatent().getEP_ApplicationNumber() + "_Form1200.pdf";
						response.setHeader("Content-Disposition", "attachment;filename=" + pdfFilename);
					}
					response.getOutputStream().write(bytearray, 0, size);
				}
			}

			response.getOutputStream().close();
			// log().debug(PREFIX+" AFTER loop. size NOW = "+size);
			log().debug("Completed serving the Form1200 PDF.  from " + err);
		} catch (Exception ex) {
			logErrorAndContinue("Error retrieving f1200 pdf.     from "+err, ex);
		}
	}

	
}
