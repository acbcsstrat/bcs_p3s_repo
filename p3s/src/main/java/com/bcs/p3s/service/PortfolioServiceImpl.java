package com.bcs.p3s.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bcs.p3s.display.PortfolioUI;
import com.bcs.p3s.engine.DummyForm1200Engine;


@Service("PortfolioService")
public class PortfolioServiceImpl implements PortfolioService{

	@Override
	public List<PortfolioUI> getPortfolioData() {

		DummyForm1200Engine dummyEngine = new DummyForm1200Engine();
		List<PortfolioUI> portfolioUIS = dummyEngine.getDummyDataForPortfolio();
		return portfolioUIS;
	}

}
