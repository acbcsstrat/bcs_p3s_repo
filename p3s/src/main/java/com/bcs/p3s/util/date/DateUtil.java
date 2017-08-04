package com.bcs.p3s.util.date;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateUtil {

	public String dateToUSStringWithDayOfWeek(Date date) {
		if (date==null) return "";
		SimpleDateFormat sdf = new SimpleDateFormat("EEE MMM d, yyyy"); // Tue Oct 31, 2017
		String result = sdf.format(date);
		return result;
	}
	
	public String dateToUSStringWithDayOfWeekandTimeandZone(Date date) {
		if (date==null) return "";
		// z, zz & zzz = BST.  zzzz = British Summer Time
		SimpleDateFormat sdf = new SimpleDateFormat("EEE MMM d, yyyy  HH:mm z"); // Tue Aug 1, 2017  15:11 BST
		String result = sdf.format(date);
		return result;
	}
	
	public Date addDays(Date date, int toAdd){
		Calendar calendar = Calendar.getInstance();
		
		calendar.setTime(date);
        calendar.add(Calendar.DATE, toAdd);
		return calendar.getTime();
		
	}
	
	public Date addMonths(Date date, int toAdd){
		Calendar calendar = Calendar.getInstance();
		
		calendar.setTime(date);
        calendar.add(Calendar.MONTH, toAdd);
		return calendar.getTime();
		
	}
	
	public Date addHours(Date date, int toAdd){
		Calendar calendar = Calendar.getInstance();
		
		calendar.setTime(date);
        calendar.add(Calendar.HOUR, toAdd);
		return calendar.getTime();
		
	}
	
	public Date getMidnight(Date date){
		
		
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		
		return cal.getTime();
	}
	
	public Date get8PM(Date date){
		
		
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.set(Calendar.HOUR_OF_DAY, 20);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		
		return cal.getTime();
	}
	
	public Calendar getLastDayOfMonth(Date date){
			
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(date);
			calendar.add(Calendar.MONTH, 1);  
	        calendar.set(Calendar.DAY_OF_MONTH, 1);  
	        calendar.add(Calendar.DATE, -1);  
	        return calendar;
		}

	public Date getTodaysDate(){
		
		Calendar calendar = Calendar.getInstance();
		int month = calendar.get(Calendar.MONTH);
	    int year = Calendar.getInstance().get(Calendar.YEAR);
	    int day = calendar.get(Calendar.DAY_OF_MONTH);
	    
	    Calendar todays = Calendar.getInstance();
	    todays.set(year, month, day , 00,00);  
	    
	    return todays.getTime();
	}

	public int getYearsBetweenDates(Date first, Date last){
		
		int years =0;
		Calendar a = Calendar.getInstance();
		a.setTime(first);
	    Calendar b = Calendar.getInstance();
	    b.setTime(last);
	    
		years = a.get(Calendar.YEAR) - b.get(Calendar.YEAR);
		return years;
	}
}
