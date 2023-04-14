#version 460

layout(location = 0) out vec4 outColor;
layout(location = 1) out vec4 outDepth;

//Generic color computation
vec4 computeColor(){}

void main()
{
	ivec2 texelCoord = ivec2(gl_FragCoord.xy);

	vec4 color = computeColor();
	color.a = alpha; //Your own alpha value
	outColor = color; //Store closest fragments in SEPARATE TEXTURES, don't blend
	outDepth = vec4(gl_FragCoord.z,0,0,1); //Store closest depth for second pass
}
