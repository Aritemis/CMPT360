
class ray
{
  constructor(a, b)
  {
    this.A = a;
    this.B = b;
    console.log("made " + a + " " + b);
  }

  origin()
  {
    return this.A;
  }

  direction()
  {
    return this.B;
  }

  point_at_parameter(t)
  {
    return add(this.A, scale(t, this.B));
  }
}
