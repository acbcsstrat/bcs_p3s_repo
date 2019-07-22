package com.bcs.p3s.model;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;

import com.bcs.p3s.util.lang.P3SRuntimeException;

/**
 * Instances of this class indicate which days should not/maybe not be included in the T+n banking day calculations, 
 * due to such days not being a working day in certain parts of the world.
 * 
 *  See NonWorkingDayLocalityEnum for valid locality values
 *  
 *  If multiple localities for same day, enter just one.
 */
@RooJavaBean
@RooToString
@RooJpaActiveRecord
public class NonWorkingDay {

    /**
     */
    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date date;

    /**
     */
    @NotNull
    private String locality; // See NonWorkingDayLocalityEnum 

    
    
    
    public static synchronized List<LocalDate> findAllNonWorkingDayLDs() {
    	List<LocalDate> ldNwds = new ArrayList<LocalDate>(); 
    	for (NonWorkingDay obNwd : findAllNonWorkingDays()) {
    		LocalDate ld = obNwd.getDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    		ldNwds.add(ld);
    	}
    	return ldNwds;
    }

}
