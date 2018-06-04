package com.bcs.p3s.util.date;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.SimpleTimeZone;

import org.joda.time.DateTime;
import org.joda.time.Interval;
import org.joda.time.Period;

public class DateUtil implements Comparable<String>{

	// acToDo: DateUtil many unused methods (eg rely on timezone?) + Massive duplication. Make more efficient. - cron & web

	public String dateToUSStringWithoutDayOfWeek(Date date) {
		if (date==null) return "";
		SimpleDateFormat sdf = new SimpleDateFormat("MMM d, yyyy"); // Oct 31, 2017
		String result = sdf.format(date);
		return result;
	}
	
	public String dateToUSStringWithDayOfWeek(Date date) {
		if (date==null) return "";
		SimpleDateFormat sdf = new SimpleDateFormat("EEE MMM d, yyyy"); // Tue Oct 31, 2017
		String result = sdf.format(date);
		return result;
	}
	
	public String dateToUSStringWithTimeZone(Date date) {
		if (date==null) return "";
		SimpleDateFormat sdf = new SimpleDateFormat("MMM d, yyyy  HH:mm z"); // Oct 31, 2017 21:00 UTC
		String result = sdf.format(date);
		return result;
	}
	
	public String dateToUSformatWithDayOfWeek2200UTC(Date date) { // Tue Oct 31, 2017 22:00 UTC
		if (date==null) return "";
		SimpleDateFormat sdf = new SimpleDateFormat("EEE MMM d, yyyy"); 
		String result = sdf.format(date);
		return result + " 22:00 UTC";
	}
	
	public String dateToUSStringWithDayOfWeekandTimeandZone(Date date) {
		if (date==null) return "";
		// z, zz & zzz = BST.  zzzz = British Summer Time
		SimpleDateFormat sdf = new SimpleDateFormat("EEE MMM d, yyyy  HH:mm z"); // Tue Aug 1, 2017  15:11 BST
		String result = sdf.format(date);
		return result;
	}
	
	public String dateToUSStringWithTimeandZone(Date date) {
		if (date==null) return "";
		// dd/MM/yyyy
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy"); // Aug 1, 2017  15:11 BST
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
	
	public Date getEndOfDate(Date date){
		
		
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.set(Calendar.HOUR_OF_DAY, 23);
		cal.set(Calendar.MINUTE, 59);
		cal.set(Calendar.SECOND, 59);
		
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
		
		//@SuppressWarnings("deprecation")
		//Date date = new Date(2017, 5, 28, 00, 00);
		//calendar.setTime(date);
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
	
	public String dateForMoneyCorpFiles(Date date) {
		if (date==null) return "";
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss z"); // Tue Oct 31, 2017
		String result = sdf.format(date);
		return result;
	}

	@Override
	public int compareTo(String o) {
		// TODO Auto-generated method stub
		return 0;
	}
	
	public Date stringToDate(String strDate) throws ParseException{
		
		DateFormat formatter = new SimpleDateFormat("yyyyMMdd"); 
		Date date = formatter.parse(strDate);
		DateFormat newFormat = new SimpleDateFormat("dd/MM/yyyy");
		String newDate = newFormat.format(date);
		return newFormat.parse(newDate);
	}

	public int daysBetween(Date d1, Date d2){
		long diff = d2.getTime() - d1.getTime();
		int days = (int) (diff / (1000 * 60 * 60 * 24));
        return days;
        
       
	}
	
	public int getWeeksBetweenDates(Date d1, Date d2){
		
	    Calendar c1 = Calendar.getInstance();
	    Calendar c2 = Calendar.getInstance();
	    c1.setTime(d1);
	    c2.setTime(d2);
	    DateTime start = new DateTime(c1.YEAR, c1.MONTH, c1.DAY_OF_MONTH, 0, 0, 0, 0);
	    DateTime end   = new DateTime(c2.YEAR, c2.MONTH, c2.DAY_OF_MONTH, 0, 0, 0, 0);
	    Interval interval = new Interval(start, end);
	    Period p = interval.toPeriod();
	    return p.getWeeks();
	}
	
	public int getNumberOfWeeks(Date d1, Date d2){
		long diff = d2.getTime() - d1.getTime();
		int weeks = (int) (diff / (7 * 24 * 60 * 60 * 1000 ));
		
		return weeks;
	}
	
	public boolean isSameDay(Date d1, Date d2){
		Calendar cal1 = Calendar.getInstance();
		Calendar cal2 = Calendar.getInstance();
		cal1.setTime(d1);
		cal2.setTime(d2);
		boolean sameDay = cal1.get(Calendar.YEAR) == cal2.get(Calendar.YEAR) &&
		                  cal1.get(Calendar.DAY_OF_YEAR) == cal2.get(Calendar.DAY_OF_YEAR);
		
		return sameDay;
	}
	
	public int getHoursBetweenDates(Date d1, Date d2){
		
		long diff = d2.getTime() - d1.getTime();
		int hours = (int) (diff / (60 * 60 * 1000 ));
		
		return hours;
	}
	
	
	public Date getUTCTime(Date originalDate) throws ParseException{
		
		Date yourUtcDate = new Date();
		
		SimpleDateFormat sdf = new SimpleDateFormat("EEE MMM d, yyyy  HH:mm z"); // Tue Aug 1, 2017  15:11 BST
		String result = sdf.format(originalDate);
		SimpleDateFormat sdfUTC = new SimpleDateFormat();
		sdfUTC.setTimeZone(new SimpleTimeZone(SimpleTimeZone.UTC_TIME, "UTC"));
		yourUtcDate = sdf.parse(result);
		//remove later
		System.out.println("UTC Date is "+yourUtcDate);
		return yourUtcDate;
	}
	
}
