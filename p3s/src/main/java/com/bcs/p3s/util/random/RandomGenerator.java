package com.bcs.p3s.util.random;

public class RandomGenerator {
	
	int seed;

    // initial condition of the random number generator
    public RandomGenerator(int seed) { this.seed = seed; }

    public int nextInt(int min, int max) {
        
    	int ranNumber = 0;
        int nextNumber = Math.abs(seed) ;
        ranNumber = nextNumber % max;
        return ranNumber;
    }

}
