
class ray
{

    constructor(a, b)
    {
        this.a = a;
        this.b = b;
    }

    origin()
    {
        return this.a;
    }

    direction()
    {
        return this.b;
    }

    pointAt(t)
    {
        return add(this.a, scale(t, this.b));
    }
}
