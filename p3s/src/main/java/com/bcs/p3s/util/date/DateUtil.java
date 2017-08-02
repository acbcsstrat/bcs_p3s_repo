package com.bcs.p3s.util.date;

import java.text.SimpleDateFormat;
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
	
}
