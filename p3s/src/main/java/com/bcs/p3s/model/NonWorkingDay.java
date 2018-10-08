package com.bcs.p3s.model;

import java.util.Date;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import org.springframework.format.annotation.DateTimeFormat;

/**
 * Instances of this class indicate which days should not/maybe not be included in the T+n banking day calculations, 
 * due to such days not being a working day in certain parts of the world.
 * 
 *  See NonWorkingDayLocalityEnum for valid locality values
 */
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

    
}
