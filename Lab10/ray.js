
class ray
{
  constructor(a, b)
  {
    this.A = a;
    this.B = b;
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
    return this.A + t * this.B;
  }
}
