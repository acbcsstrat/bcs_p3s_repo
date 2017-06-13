package com.bcs.p3s.util;

import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtil {

	public String dateToUSStringWithDayOfWeek(Date date) {
		if (date==null) return "";
		SimpleDateFormat sdf = new SimpleDateFormat("EEE MMM d, yyyy");
		String result = sdf.format(date);
		return result;
	}
	
}
