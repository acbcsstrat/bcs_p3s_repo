/**
 * 
 */
package com.bcs.p3s.model;

import java.util.Date;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;

/**
 * Model classes that enables us to look up for phase change dates based on Renewal Due Date
 * @author MerinP
 *
 */

@RooJavaBean
@RooToString
@RooJpaActiveRecord(finders = {"findCalendarColoursByRenewalDueDate"})
public class CalendarColour {
	
	@NotNull
    @Temporal(TemporalType.DATE)
    @DateTimeFormat(style = "M-")
	private Date renewalDueDate;
	
	@NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
	private Date greenStart;
	
	@NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
	private Date amberStart;
	
	@NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
	private Date redStart;
	
	@NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
	private Date blueStart;
	
	@NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
	private Date blackStart;
	
	@NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
	private Date blackPhoneUpStart;
	
	@NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
	private Date blackAllEnd;
	
	

}
