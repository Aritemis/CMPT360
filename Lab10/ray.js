
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
    return vec3.copy(add(this.A, scale(t, this.B)));
  }
}
