export class Random {
  constructor(seed) {
    this._seed = seed % 2147483647;
    if (this._seed <= 0) this._seed += 2147483646;
  }

  // [1 and 2^32 - 2]
  nextInt() {
    return this._seed = this._seed * 16807 % 2147483647;
  };


  // [0, 1).
  next() {
    return (this.nextInt() - 1) / 2147483646;
  };
}
