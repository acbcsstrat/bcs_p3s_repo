package com.bcs.p3s.util.random;

public class TestLaunch {
	
	
	
	public static void main(String[] args) {
		
		
		int ranNumber =0;
		int min = 1000;
		int max = 9999;
		/*do{
			Random rand = new Random((int) System.currentTimeMillis());
			ranNumber = rand.nextInt(min,max);
		}while(ranNumber <= min && ranNumber > max);*/
		
		
		do{
			RandomGenerator rand = new RandomGenerator((int) System.currentTimeMillis());
			ranNumber = rand.nextInt(22,99);
		}while(ranNumber <= 22 || ranNumber > 99);
		
		System.out.println("Random number "+ ranNumber);
	}

}
