package com.bcs.p3s.engine;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

import com.bcs.p3s.model.NonWorkingDay;
import com.bcs.p3s.util.lang.P3SRuntimeException;
import com.bcs.p3s.util.lang.Universal;

/**
 * The Auxialliary EpctEngine
 * 
 * EpctEngine is large, but needs many further date calculations
 * 
 * Such code is provided here. 
 * Later, consideration can be given to whether such should be merged into EpctEngine
 */
public class EpctEngineAux extends Universal {

	public static final long AMBER_WORKING_DAYS = 5;
	public static final long RED_WORKING_DAYS = 5;


	LocalDate ldAmberStart;
	LocalDate ldRedStart;
    List<LocalDate> allNonWorkingDayLDs = NonWorkingDay.findAllNonWorkingDayLDs();

	
	
	protected EpctEngineAux(LocalDate ld31monthsAfter) {

		// Calculate ldAmberStart & ldRedStart
		// approach: Start at end date & proceed back in time. Check each day for weekend or non working. Stop when assembled N working days.

		ldRedStart = countBackNworkingDays(ld31monthsAfter, RED_WORKING_DAYS);
		ldAmberStart  = countBackNworkingDays(ldRedStart.minusDays(1L), AMBER_WORKING_DAYS);
		
	}
	
	


	
	
	
	/**
	 * Given an end date, determine the date N working days prior to this. 
	 * The end date itself CAN be a working date, so ..(date,1) COULD return 'date'
	 * @param N the number of working days to calculate. 1<N<15
	 */
	protected LocalDate countBackNworkingDays(LocalDate thisDate, long N) {
		long watchdog = 30; // Safety watchdog
		long workingDaysSoFar = 0;
		long calendarDaysSoFar = 0;
		boolean finished = false;
		while ( ( ! finished) && calendarDaysSoFar < watchdog) {
			if ( ( ! isWeekend(thisDate)  && ( ! isANonWorkingDay(thisDate)) )) {
				workingDaysSoFar++;
			}
			if (workingDaysSoFar >= N) {
				finished = true;
				break;
			}

			thisDate = thisDate.minusDays(1L);
			calendarDaysSoFar++;
		}
		if (calendarDaysSoFar>=watchdog) fail("EpctEngineAux countBackNworkingDays("+thisDate+", "+N+")");
		return thisDate;
	}
	
	public boolean isANonWorkingDay(LocalDate candiDate) {
    	if (candiDate==null) throw new P3SRuntimeException("isANonWorkingDay() passed a null");
    	boolean isANonWorkingDay = (allNonWorkingDayLDs.contains(candiDate));
    	log().debug("zaph Testing for isANonWorkingDay("+candiDate+") yields "+isANonWorkingDay);
    	return isANonWorkingDay;
    }
	
	protected boolean isWeekend(LocalDate ld) {
		boolean isWeekend = false;
		DayOfWeek dow = ld.getDayOfWeek();
		isWeekend = ((DayOfWeek.SATURDAY.equals(dow)) || (DayOfWeek.SUNDAY.equals(dow)));
		return isWeekend ;
	}
	
	// Ordinary Getters
	protected LocalDate getLdAmberStart() {
		return ldAmberStart;
	}
	protected LocalDate getLdRedStart() {
		return ldRedStart;
	}
}
