package com.bcs.p3s.cron.notification.provider;


/**
 * A finder class to find out which Noitification to be sent for CalendarColour
 * 
 */
import java.util.Calendar;
import java.util.Date;

import com.bcs.p3s.display.RenewalDates;
import com.bcs.p3s.docs.email.template.EmailTemplates;
import com.bcs.p3s.enump3s.NotificationNameEnum;
import com.bcs.p3s.model.CalendarColour;
import com.bcs.p3s.util.config.P3SPropertyNames;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.util.lang.Universal;

public class NotificationFinder extends Universal{
	
	Calendar cal = Calendar.getInstance();
	
	public String isGreenStarts(CalendarColour currentColorDates){
		
		Date green = currentColorDates.getGreenStart();
		if(new DateUtil().isSameDay(green, cal.getTime())){
			log().debug("NotificationFinder found condition isGreenStarts as true");
			return NotificationNameEnum.GREEN_STARTS;
		}
		
		return "";
	}
	
	public String isGreen6weeksToGo(CalendarColour currentColorDates){
		
		//Date green = currentColorDates.getGreenStart();
		Date amber = currentColorDates.getAmberStart();
		
		if(new DateUtil().daysBetween(cal.getTime(),amber) == P3SPropertyNames.SIX_WEEKS_IN_DAYS){
			log().debug("NotificationFinder found condition isGreen6weeksToGo as true");
			return NotificationNameEnum.GREEN_6WEEKS_TO_GO;
		}
			
		return "";
		
	}
	
	public String isGreen2weeksToGo(CalendarColour currentColorDates){
		
		//Date green = currentColorDates.getGreenStart();
		Date amber = currentColorDates.getAmberStart();
		
		if(new DateUtil().daysBetween(cal.getTime(), amber) == P3SPropertyNames.TWO_WEEKS_IN_DAYS){
			log().debug("NotificationFinder found condition isGreen2weeksToGo as true");
			return NotificationNameEnum.GREEN_2WEEKS_TO_GO;
		}
		return "";
		
	}
	
	public String isGreen1weeksToGo(CalendarColour currentColorDates){
		
		//Date green = currentColorDates.getGreenStart();
		Date amber = currentColorDates.getAmberStart();
		
		if(new DateUtil().daysBetween(cal.getTime(), amber) == P3SPropertyNames.ONE_WEEK_IN_DAYS){
			log().debug("NotificationFinder found condition isGreen1weekToGo as true");
			return NotificationNameEnum.GREEN_1WEEK_TO_GO;
		}
		return "";
		
	}
	
	public String isGreen2DaysToGo(CalendarColour currentColorDates){
		
		//Date green = currentColorDates.getGreenStart();
		Date amber = currentColorDates.getAmberStart();
		
		if(new DateUtil().daysBetween(cal.getTime(), amber) == 2 ){
			log().debug("NotificationFinder found condition isGreen2DaysToGo as true");
			return NotificationNameEnum.GREEN_2DAYS_TO_GO;
		}
		return "";
		
	}
	
	//is actually when Amber starts
	public String isAmber3DaysToGo(CalendarColour currentColorDates){
		
		//Date green = currentColorDates.getGreenStart();
		Date amber = currentColorDates.getAmberStart();
		
		if(new DateUtil().isSameDay(amber, cal.getTime())){
			log().debug("NotificationFinder found condition isAmber3DaysToGo as true");
			return NotificationNameEnum.AMBER_3DAYS_TO_GO;
		}
		return "";
		
	}
	
	public String isAmber1DayToGo(CalendarColour currentColorDates){
		
		//Date green = currentColorDates.getGreenStart();
		Date red = currentColorDates.getRedStart();
		
		if(new DateUtil().daysBetween(cal.getTime(), red) == 1 ){
			log().debug("NotificationFinder found condition isAmber1DayToGo as true");
			return NotificationNameEnum.AMBER_1DAY_TO_GO;
		}
		return "";
		
	}
	
	//RED_3DAYS_TO_GO == RED_STARTS . May changed later
	public String isRedStarts(CalendarColour currentColorDates){
		
		Date red = currentColorDates.getRedStart();
		if(new DateUtil().getHoursBetweenDates(red, cal.getTime()) < 24 && new DateUtil().getHoursBetweenDates(red, cal.getTime()) > 0 ){
			log().debug("NotificationFinder found condition isRedStarts as true");
			return NotificationNameEnum.RED_3DAYS_TO_GO;
		}
		return "";
	}
	
	public String isBlueStarts(CalendarColour currentColorDates){
		
		Date blue = currentColorDates.getBlueStart();
		if(blue.equals(cal.getTime())){
			log().debug("NotificationFinder found condition isBlueStarts as true");
			return NotificationNameEnum.BLUE_STARTS;
		}
		return "";
	}
	
	public String isBlue12weeksToGo(CalendarColour currentColorDates){
		
		//Date green = currentColorDates.getGreenStart();
		Date black = currentColorDates.getBlackStart();
		
		if(new DateUtil().daysBetween(cal.getTime(),black) == P3SPropertyNames.TWELVE_WEEKS_IN_DAYS){
			log().debug("NotificationFinder found condition isBlue12weeksToGo as true");
			return NotificationNameEnum.BLUE_12WEEKS_TO_GO;
		}
		return "";
		
	}
	
	public String isBlue6weeksToGo(CalendarColour currentColorDates){
		
		//Date green = currentColorDates.getGreenStart();
		Date black = currentColorDates.getBlackStart();
		
		if(new DateUtil().daysBetween(cal.getTime(), black) == P3SPropertyNames.SIX_WEEKS_IN_DAYS){
			log().debug("NotificationFinder found condition isBlue6weeksToGo as true");
			return NotificationNameEnum.BLUE_6WEEKS_TO_GO;
		}
		return "";
		
	}
	
	public String isBlue2weeksToGo(CalendarColour currentColorDates){
		
		//Date green = currentColorDates.getGreenStart();
		Date black = currentColorDates.getBlackStart();
		
		if(new DateUtil().daysBetween(cal.getTime(), black) == P3SPropertyNames.TWO_WEEKS_IN_DAYS){
			log().debug("NotificationFinder found condition isBlue2weeksToGo as true");
			return NotificationNameEnum.BLUE_2WEEKS_TO_GO;
		}
		return "";
		
	}
	
	public String isBlue1weeksToGo(CalendarColour currentColorDates){
		
		//Date green = currentColorDates.getGreenStart();
		Date black = currentColorDates.getBlackStart();
		
		if(new DateUtil().daysBetween(cal.getTime(), black) == P3SPropertyNames.ONE_WEEK_IN_DAYS){
			log().debug("NotificationFinder found condition isBlue1weekToGo as true");
			return NotificationNameEnum.BLUE_1WEEK_TO_GO;
		}
		return "";
		
	}
	
	public String isBlue2DaysToGo(CalendarColour currentColorDates){
		
		//Date green = currentColorDates.getGreenStart();
		Date black = currentColorDates.getBlackStart();
		
		if(new DateUtil().daysBetween(cal.getTime(), black) == 2 ){
			log().debug("NotificationFinder found condition isBlue2DaysToGo as true");
			return NotificationNameEnum.BLUE_2DAYS_TO_GO;
		}
		return "";
		
	}
	
	
	public String isBlackStarts(CalendarColour currentColorDates){
		
		Date black = currentColorDates.getBlackStart();
		if(new DateUtil().isSameDay(black, cal.getTime())){
			log().debug("NotificationFinder found condition isBlackStarts as true");
			return NotificationNameEnum.BLACK_STARTS;
		}
		return "";
	}
	
	public String isBlackPhoneUpStarts(CalendarColour currentColorDates){
		
		//Date green = currentColorDates.getGreenStart();
		Date black = currentColorDates.getBlackPhoneUpStart();
		
		if(new DateUtil().getHoursBetweenDates(black, cal.getTime()) < 24 && new DateUtil().getHoursBetweenDates(black, cal.getTime()) > 0 ){
			log().debug("NotificationFinder found condition isBlackPhoneUpStarts as true");
			return NotificationNameEnum.BLACK_PHONE_UP_STARTS;
		}
		return "";
		
	}
	
	

}
