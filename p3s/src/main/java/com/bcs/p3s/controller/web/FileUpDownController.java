package com.bcs.p3s.controller.web;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.SQLException;

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
import com.bcs.p3s.model.Renewal;
import com.bcs.p3s.model.RenewalBlob;
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


		try {
			streamEpctPreviewPdf(epctId, isDownloadNotView, response);

			log().debug("streamForm1200Pdf() Completed.  from " + err);
		} catch (IOException | SQLException ex) {
			logErrorAndContinue("Error whilst streamForm1200Pdf().     from "+err, ex);
		}
	}
// Below was the sole action - upto 190524 - retain briefly - then acTidy
//	@RequestMapping(value = "/download.pdf", method = RequestMethod.GET, produces = "application/pdf")
//	public void streamForm1200Pdf(@RequestParam(required = true) Long epctId, @RequestParam(required = false) Boolean download,
//			HttpServletRequest request, HttpServletResponse response) 
//	{
//
//		// If 'download' is absent, default to false (ie View, not Download)
//		boolean isDownloadNotView = false;
//		if (download!=null && ((Boolean) download)==true) isDownloadNotView = true;  
//		String err = CLASSNAME + " /download.pdf  = streamForm1200Pdf(epctId="+epctId+", download="+isDownloadNotView+") ";
//		log().debug(err + "invoked");
//
//		byte[] bytearray = new byte[4194304]; // 4MB. = Current size limit
//
//		try {
//
//			Epct epct = form1200Service.findEpct(epctId); // Includes safety authorisation check
//
//			Blob blobby = null;
//			if (epct != null) {
//				Form1200 form1200 = epct.getForm1200();
//				if (form1200 != null) {
//					blobby = form1200.getPdfBlob();
//				}
//			}
//
//			if (blobby == null) {
//				log().error("IS NO f1200 PDF IN dB FOR Epct ID " + epctId+"   from "+err);
//				response.setContentType("application/pdf");
//				response.getOutputStream().write(bytearray, 0, 0);
//			} else {
//				int size = 0;
//				InputStream sImage = blobby.getBinaryStream();
//				while ((size = sImage.read(bytearray)) != -1) {
//					log().debug("in loop reading f1200 pdf. Size this loop iteration is " + size+"    from "+err);
//					response.setContentType("application/pdf");
//					if (isDownloadNotView) {
//						String pdfFilename = epct.getPatent().getEP_ApplicationNumber() + "_Form1200.pdf";
//						response.setHeader("Content-Disposition", "attachment;filename=" + pdfFilename);
//					}
//					response.getOutputStream().write(bytearray, 0, size);
//				}
//			}
//
//			response.getOutputStream().close();
//			// log().debug(PREFIX+" AFTER loop. size NOW = "+size);
//			log().debug("Completed serving the Form1200 PDF.  from " + err);
//		} catch (Exception ex) {
//			logErrorAndContinue("Error retrieving f1200 pdf.     from "+err, ex);
//		}
//	}


	
	@RequestMapping(value = "/downloadEpctReceipt.pdf", method = RequestMethod.GET, produces = "application/pdf")
	public void streamEpctReceiptPdf(@RequestParam(required = true) Long epctId, @RequestParam(required = false) Boolean download,
			HttpServletRequest request, HttpServletResponse response) 
	{
		// If 'download' is absent, default to false (ie View, not Download)
		boolean isDownloadNotView = false;
		if (download!=null && ((Boolean) download)==true) isDownloadNotView = true;  
		String err = CLASSNAME + " /downloadEpctReceipt.pdf  = streamEpctReceitpPdf(epctId="+epctId+", download="+isDownloadNotView+") ";
		log().debug(err + "invoked");
		try {
			streamEpctReceiptPdf(epctId, isDownloadNotView, response);

			log().debug("streamEpctReceiptPdf() Completed.  from " + err);
		} catch (IOException | SQLException ex) {
			logErrorAndContinue("Error whilst streamEpctReceiptPdf().     from "+err, ex);
		}
	}
	
	@RequestMapping(value = "/downloadRenewalReceipt.pdf", method = RequestMethod.GET, produces = "application/pdf")
	public void streamRenewalReceiptPdf(@RequestParam(required = true) Long renewalId, @RequestParam(required = false) Boolean download,
			HttpServletRequest request, HttpServletResponse response) 
	{
		// If 'download' is absent, default to false (ie View, not Download)
		boolean isDownloadNotView = false;
		if (download!=null && ((Boolean) download)==true) isDownloadNotView = true;  
		String err = CLASSNAME + " /downloadRenewalReceipt.pdf  = streamRenewalReceitpPdf(renewalId="+renewalId+", download="+isDownloadNotView+") ";
		log().debug(err + "invoked");
		try {
			streamRenewalReceiptPdf(renewalId, isDownloadNotView, response);

			log().debug("streamRenewalReceiptPdf() Completed.  from " + err);
		} catch (IOException | SQLException ex) {
			logErrorAndContinue("Error whilst streamRenewalReceiptPdf().     from "+err, ex);
		}
	}
	
	
	

	
	
	
	protected void streamEpctPreviewPdf(Long epctId, boolean isDownloadNotView, HttpServletResponse response) throws IOException, SQLException {
		if (epctId==null || response==null) fail("getEpctPreviewPdfBlob() passed a null : "+epctId+(response==null)+"    from "+CLASSNAME);
		String err = "getEpctPreviewPdfBlob(epct="+epctId+", isDownloadNotView="+isDownloadNotView+")    from "+CLASSNAME;

		Epct epct = form1200Service.findEpct(epctId); // Includes safety authorisation check
		if (epct==null) fail("Specified epct does not exist.  In : "+err);
		
		byte[] failedBytearray = new byte[1024]; 
		Form1200 form1200 = epct.getForm1200();
		if (form1200==null) fail("Form1200 blob row for specified epct does not exist.  In : "+err);
		Blob blobby = form1200.getPdfBlob();
		if (blobby==null) {
			response.setContentType("application/pdf");
			response.getOutputStream().write(failedBytearray, 0, 0);
			response.getOutputStream().close();
			fail("Fail to access blob for specified epct.  In : "+err);
		}
		else 
		{
			String pdfFilename = epct.getPatent().getEP_ApplicationNumber() + "_Form1200.pdf";

			streamPdf(pdfFilename, isDownloadNotView, blobby, response);
		}

		log().debug("getEpctPreviewPdfBlob() completed streaming the PDF.  from " + err);
	}
	
	
	protected void streamEpctReceiptPdf(Long epctId, boolean isDownloadNotView, HttpServletResponse response) throws IOException, SQLException {
		if (epctId==null || response==null) fail("getEpctPreviewPdfBlob() passed a null : "+epctId+(response==null)+"    from "+CLASSNAME);
		String err = "streamEpctReceiptPdf(epct="+epctId+", isDownloadNotView="+isDownloadNotView+")    from "+CLASSNAME;

		Epct epct = form1200Service.findEpct(epctId); // Includes safety authorisation check
		if (epct==null) fail("Specified epct does not exist.  In : "+err);
		
		byte[] failedBytearray = new byte[1024]; 
		Form1200 form1200 = epct.getForm1200();
		if (form1200==null) fail("Form1200 blob row for specified epct does not exist.  In : "+err);
		Blob blobby = form1200.getEpoReceiptBlob();
		if (blobby==null) {
			response.setContentType("application/pdf");
			response.getOutputStream().write(failedBytearray, 0, 0);
			response.getOutputStream().close();
			fail("Fail to access blob for specified epct.  In : "+err);
		}
		else 
		{
			String pdfFilename = epct.getPatent().getEP_ApplicationNumber() + "_EuroPCT_Receipt.pdf";

			streamPdf(pdfFilename, isDownloadNotView, blobby, response);
		}

		log().debug("streamEpctReceiptPdf() completed streaming the PDF.  from " + err);
	}
	
	
	
	protected void streamRenewalReceiptPdf(Long renewalId, boolean isDownloadNotView, HttpServletResponse response) throws IOException, SQLException {
		if (renewalId==null || response==null) fail("getEpctPreviewPdfBlob() passed a null : "+renewalId+(response==null)+"    from "+CLASSNAME);
		String err = "streamRenewalReceiptPdf(epct="+renewalId+", isDownloadNotView="+isDownloadNotView+")    from "+CLASSNAME;

		Renewal renewal = form1200Service.findRenewal(renewalId); // Includes safety authorisation check
		if (renewal==null) fail("Specified renewal does not exist.  In : "+err);
		
		byte[] failedBytearray = new byte[1024]; 
		Long renewalBlobId = renewal.getRenewalBlobId();
		RenewalBlob renewalBlob = RenewalBlob.findRenewalBlob(renewalBlobId); 
		if (renewalBlob==null) fail("RenewalBlob blob row for specified renewal does not exist.  In : "+err);
		Blob blobby = renewalBlob.getEpoReceiptBlob();
		if (blobby==null) {
			response.setContentType("application/pdf");
			response.getOutputStream().write(failedBytearray, 0, 0);
			response.getOutputStream().close();
			fail("Fail to access blob for specified epct.  In : "+err);
		}
		else 
		{
			String pdfFilename = renewal.getPatent().getEP_ApplicationNumber() + "_Annuity_Receipt.pdf";

			streamPdf(pdfFilename, isDownloadNotView, blobby, response);
		}

		log().debug("streamRenewalReceiptPdf() completed streaming the PDF.  from " + err);
	}
	
	
	
	
	
	
	
	// Extract common code
	
	protected void streamPdf(String pdfFilename, boolean isDownloadNotView, Blob blobby, HttpServletResponse response) throws IOException, SQLException
	{
		String err = "  streamPdf()   from "+CLASSNAME;
		if (pdfFilename==null || blobby==null || response==null) fail("passed a null : "+(pdfFilename==null)+(blobby==null)+(response==null)+"    from "+err);

		byte[] bytearray = new byte[4194304]; // 4MB. = Current size limit

		int size = 0;
		InputStream sImage = blobby.getBinaryStream();
		while ((size = sImage.read(bytearray)) != -1) {
			log().debug("in loop reading blobby pdf. Size this loop iteration is " + size+"    from "+err);
			response.setContentType("application/pdf");
			if (isDownloadNotView) {
				response.setHeader("Content-Disposition", "attachment;filename=" + pdfFilename);
			}
			response.getOutputStream().write(bytearray, 0, size);
		}
		response.getOutputStream().close();
		log().debug("Completed streamPdf().  from " + err);
	}

}
