class sphere
{

    constructor(center, radius)
    {
        this.center = center;
        this.radius = radius;
    }

    hit(r, t_min, t_max, rec)
    {
        var oc = subtract(r.origin(), this.center);
        var d = r.direction();

        var a = dot(d, d);
        var b = dot(oc, d);
        var c = dot(oc, oc) - this.radius*this.radius;
        var discriminant = b*b - a*c;

        if(discriminant >= 0)
        {
          var temp = -1 * b - Math.sqrt(discriminant) / a;

              if (temp < t_max && temp > t_min)
              {
                  // rec.setT(temp);
                  // rec.setP(r.pointAt(rec.getT()));
                  rec.setP(r.pointAt(temp));
                  rec.setNormal(normalize(subtract(rec.getP(), this.center)));  // normalize

                  return true;
              }

              temp = -1 * b + Math.sqrt(discriminant) / a;
              if (temp < t_max && temp > t_min)
              {
                  // rec.setT(temp);
                  // rec.setP(r.pointAt(rec.getT()));
                  rec.setP(r.pointAt(temp));
                  rec.setNormal(normalize(subtract(rec.getP(), this.center)));

                  return true;
              }
            }

        return false;
    }

}
