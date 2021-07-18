/**
 * TODO add error handleing
 **/

//Uses simple Psudo random number generation to generate whole numbers
class RandomWholeNumber {
  //The min and max values for numbers. range [min,max)
  private max: Number;
  private min: Number;
  //General Psudo random numbers
  //The multiplier
  private a: Number;
  //The increment
  private b: Number;
  //The modulus
  private m: Number;
  //The seed
  private X: Number;
  //The seeds initial value
  private Xo: Number;

  public constructor(
    seed?: Number,
    a?: Number,
    b?: Number,
    m?: Number,
    max?: Number,
    min?: Number
  ) {
    this.X = seed ? seed : Date.now() * (1 / 9);
    this.a = a ? a : 1_234_567;
    this.b = b ? b : 123_456;
    this.m = m ? m : 7_654_321;
    this.max = max ? (this.m < max ? this.m : max) : this.m;
    this.min = min ? min : null;
    this.X = Math.floor(+this.a * +this.X + +this.b) % +this.m;
    this.Xo = this.X;
  }

  //Sets max value if valid
  public setMax(max: Number) {
    if (!this.min) {
      this.min = 0;
    }
    if (max > this.min) {
      this.max = max;
      if (this.m < this.max) {
        this.m = max;
      }
    }
  }

  //Sets min if valid
  public setMin(min: Number) {
    if (min < this.max) {
      this.min = min;
    }
  }

  //Sets min and max if valid
  public setMinMax(min: Number, max: Number) {
    if (max > min) {
      this.min = min;
      this.max = max;
    }
  }

  //Gets the next random number in the list
  public next(offset?: Number) {
    this.X =
      Math.floor(
        +this.a * +this.X +
          (+offset ? Math.floor((+offset + +this.X) / +this.X) : 0) +
          +this.b
      ) % +this.m;
    return this.min !== null
      ? +this.min + (+this.X % (+this.max - +this.min))
      : this.X;
  }

  //Resets number generator to inital point
  public reset() {
    this.X = this.Xo;
  }
}

//Generates a randomnumber between [0,1]
class RandomProbability {
  private randomA: RandomWholeNumber;
  private randomB: RandomWholeNumber;
  private precision: Number;

  constructor(seedA?: number, seedB?: number, precision?: number) {
    this.precision = precision ? precision : null;
    this.randomA = seedA
      ? new RandomWholeNumber(seedA)
      : new RandomWholeNumber(Date.now() % 1234567);
    this.randomB = seedB
      ? new RandomWholeNumber(seedB)
      : new RandomWholeNumber(Date.now() % 2345678);
  }

  public next(offset?: number): Number {
    let randA = this.randomA.next(offset);
    let randB = this.randomB.next(offset);
    if (this.precision) {
      return randA > randB
        ? +(+randB / +randA).toFixed(+this.precision)
        : +(+randA / +randB).toFixed(+this.precision);
    }
    return randA > randB ? +randB / +randA : +randA / +randB;
  }

  //Sets percision of generated numbers
  public setPercision(n: Number) {
    if (n) {
      this.precision = n;
    }
  }
}

export { RandomWholeNumber, RandomProbability };
