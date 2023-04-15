#version 460

layout(location = 0) out vec3 fragCount;
layout(location = 1) out vec3 colorAcc;
layout(location = 2) out vec3 pmColorAcc;

vec4 computeColor(){}

void main()
{
	//Use additive blending to accumulate the values
	vec4 color = computeColor();
    	fragCount = vec3(1.0f,alpha,1-alpha); //fragCount and alpha accumulation, multiplication for last channel - background coefficient
    	colorAcc  = color.rgb; 
	pmColorAcc = color.rgb*alpha; //Premultiplied accumulation
}
