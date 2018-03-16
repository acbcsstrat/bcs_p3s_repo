package com.bcs.p3s.util.scrape;

/**
 * Dynamic fair use monitoring
 * @author MerinP
 */

import java.net.URLConnection;

import com.bcs.p3s.scrape.model.ResponseHeaderPojo;


public interface ResponseHeaderReader{
	
	ResponseHeaderPojo readResponseHeaderData(URLConnection conn);
	
}
