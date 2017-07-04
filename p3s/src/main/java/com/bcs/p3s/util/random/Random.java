package com.bcs.p3s.util.random;

public class Random {
	
	int seed;

    // initial condition of the random number generator
    public Random(int seed) { this.seed = seed; }

    public int nextInt(int min, int max) {
        
    	int ranNumber = 0;
        int nextNumber = Math.abs(seed) ;
        ranNumber = nextNumber % max;
        return ranNumber;
    }

}
