#version 460

layout(location = 2) out vec4 outColor;

uniform sampler2D firstPassDepthTexture;

//Generic color computation
vec4 computeColor(){}

void main()
{
	ivec2 texelCoord = ivec2(gl_FragCoord.xy);
   	vec4 depth = texelFetch(firstPassDepthTexture, texelCoord, 0);
	
	//Get 2nd closest fragment and store in SEPARATE TEXTURES, don't blend it, need to subtract it from color accumulation later
	if(gl_FragCoord.z > depth.r){
		vec4 color = computeColor();
		color.a = alpha;
		outColor = color;
	}
}
