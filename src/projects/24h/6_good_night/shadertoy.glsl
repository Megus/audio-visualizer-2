#define COUNT 5
#define SIZE 4

#define LIGHT_POWER 80.
#define SPECULAR_POWER 20.
#define AMBIENT .3

vec4 spheres[] = vec4[COUNT * SIZE](
    // Spheres: center and radius, color, movement speed, movement amplitude
    // Light source
    vec4(-7.5, 0., 31., 0.1), vec4(1., 1., 1., 1.),
    vec4(2., 1., 0, 0), vec4(0, 2., 0, 0),
    // 1
    vec4(-4., 0., 39., 2), vec4(.2, .9, .2, 1.),
    vec4(1., 1.1, 2., 0), vec4(2, 3, 5.1, 0),
    // 2
    vec4(3., 0., 42., 3.), vec4(.9, .4, .5, 1.),
    vec4(1.3, 1.7, 1.5, 0), vec4(1, 4, 5.1, 0),
    // 3
    vec4(2, -1., 43., 1.5), vec4(.2, .3, 1., 1.),
    vec4(2., 1., 2., 0), vec4(7, 1, 7, 0),
    // "Floor"
    vec4(0, -800006, 0, 800000), vec4(1.7, 1.0, .7, 1),
    vec4(0, 0, 0, 0), vec4(0, 0, 0, 0)
);

// Calculate a moving sphere center
vec3 sphereCenter(int sphere) {
    vec4 sD = spheres[sphere * SIZE];
    vec4 sS = spheres[sphere * SIZE + 2];
    vec4 sA = spheres[sphere * SIZE + 3];
    vec3 c = vec3(
        sD.x + sin(iTime * sS.x) * sA.x,
        sD.y + sin(iTime * sS.y) * sA.y,
        sD.z + cos(iTime * sS.z) * sA.z);
    return c;
}

// Find a nearest ray-sphere intersection
// o - ray origin
// l - ray direction (normalized)
// ignore - sphere to ignore when detecting intersection (used for shadows)
// d - distance output
// Returns sphere number, -1 if no intersection found
int findIntersection(vec3 o, vec3 l, int ignore, out float d) {
    int sphere = -1;
    d = 1e5;

    for (int i = 0; i < COUNT; i++) {
        if (i == ignore) {
            continue;
        }
        vec3 c = sphereCenter(i);
        float r = spheres[i * SIZE].w;

        // Ray-sphere intersection formula
        vec3 t1 = o - c;
        float t1l = length(t1);
        float t2 = dot(l, t1);
        float s = t2 * t2 - t1l * t1l + r * r;
        if (s >= 0.) {
            float ss = sqrt(s);
            float sd = min(-t2 + ss, -t2 - ss);
            if (sd >= 0. && sd < d) {
                sphere = i;
                d = sd;
            }
        }
    }
    return sphere;
}

// Trace a single ray
// camO - camera origin
// camL - camera ray direction (normalized)
// Returns a fragment color
vec3 trace(vec3 camO, vec3 camL) {
    float d = 0.;
    int sphere = findIntersection(camO, camL, -1, d);

    if (sphere == -1) {
        // There was no intersection, return background color
        return vec3(0, 0, 0);
    }

    vec3 lightColor = spheres[1].xyz;

    if (sphere == 0) {
        // It's a light source, don't need to shade it
        return lightColor;
    }

    vec3 lightPoint = sphereCenter(0);

    // Sphere color
    vec3 sColor = spheres[sphere * SIZE + 1].xyz;
    vec3 aColor = sColor * vec3(AMBIENT, AMBIENT, AMBIENT);

    // Intersection point
    vec3 iPoint = camO + camL * d;
    vec3 iNormal = normalize(iPoint - sphereCenter(sphere));

    // Light direction vector
    vec3 lightDir = normalize(lightPoint - iPoint);

    // Check if there's another sphere between this one and the light source
    float dShadow = 0.;
    int shadowedBy = findIntersection(iPoint, lightDir, sphere, dShadow);
    dShadow = float(shadowedBy + 1) / 5.0;
    if (shadowedBy != 0) {
        // We're under shadow, use ambient color
        return aColor;
    }

    // Lighting (diffusion and specular)
    float cosA = clamp(dot(iNormal, lightDir), 0., 1.);
    float cosS = clamp(dot(-camL, reflect(-lightDir, iNormal)), 0., 1.);

    float dSquared = pow(length(iPoint - lightPoint), 2.);

    return aColor +
        sColor * lightColor * cosA * LIGHT_POWER / dSquared +
        lightColor * pow(cosS, SPECULAR_POWER) * LIGHT_POWER / dSquared;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;

    // Camera
    vec3 camO = vec3(0, 0, 0);
    vec3 camL = normalize(vec3(uv.x, uv.y, 7));

    // Ray-tracing
    fragColor = vec4(trace(camO, camL), 1.);
}