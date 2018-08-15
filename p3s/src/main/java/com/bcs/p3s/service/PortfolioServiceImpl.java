package com.bcs.p3s.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bcs.p3s.display.PortfolioUI;
import com.bcs.p3s.engine.DummyDataEngine;


@Service("PortfolioService")
public class PortfolioServiceImpl implements PortfolioService{

	@Override
	public List<PortfolioUI> getPortfolioData() {

		DummyDataEngine dummyEngine = new DummyDataEngine();
		List<PortfolioUI> portfolioUIS = dummyEngine.getDummyDataForPortfolio();
		return portfolioUIS;
	}

}
