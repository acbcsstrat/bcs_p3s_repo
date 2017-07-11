package com.bcs.p3s.engine;

import com.bcs.p3s.util.lang.Universal;

/**
 * Calculates the current status of a Patent
 * 
 * ASSUMPTIONs:
 * patent:epo_patent_status & patent:lastRenewedDateExEpo is current
 * 
 * OBJECTIVE:
 * Can we sell a renewal of this patent?
 * 
 * LOGIC: for 'this' patent
 * - from filing date, are we in the 9 months? If in doldrums, abort.
 * - get patent:lastRenewedDateExEpo
 * - calculate the patent YEAR (e.g 5) that that renewal represented
 * - for 'this' 9 months, calculate the patent YEAR
 * - if this year NOT= lastRenewedYear+1 - log. PERHAPS CONTINUE ANYWAY? 
 * - if there is already a renewal-in-progress for-this-year, abort.
 * - Calculate Colour and price
 * 
 */
public class PatentStatusEngine extends Universal {

	
}
