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
 * Model classes that enables us to look up for Settlement dates and Pay By dates
 * calendar_dates table holds information for each day of a year
 * 
 * @author MerinP
 *
 */

@RooJavaBean
@RooToString
@RooJpaActiveRecord(finders = {"findCalendarDatesByToday"})
public class CalendarDate {
	
	@NotNull
    @Temporal(TemporalType.DATE)
    @DateTimeFormat(style = "M-")
	private Date today;
	
	//can be null colour is Red or Black 5 days - TOO_LATE status
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
	private Date colourEndPayBy;
	
  //can be null colour is Red or Black 5 days - TOO_LATE status
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
	private Date colourEndSettlement;
	
    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
	private Date otherPayBy;
	
    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
	private Date otherSettlement;
	
	
}
