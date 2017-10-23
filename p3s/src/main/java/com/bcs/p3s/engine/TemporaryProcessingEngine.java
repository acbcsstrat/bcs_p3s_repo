package com.bcs.p3s.engine;

import static org.hamcrest.CoreMatchers.instanceOf;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;

import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.enump3s.RenewalStatusEnum;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.Notification;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.BankTransferPreCommitDetails;
import com.bcs.p3s.wrap.BasketContents;
import com.bcs.p3s.wrap.InBasket;

/**
 * This Engine holds processing that should be rendered redundant before long.
 *
 * As an Example, processing that will be redundant once working EPO interfaces are implemented
 *
 * @author andyc
 */
public class TemporaryProcessingEngine extends Universal {

	private final boolean SYSO_VERBOSE = false;
	
	
	private void verbose(String msg) {
		if (SYSO_VERBOSE) System.out.println();
	}

}
