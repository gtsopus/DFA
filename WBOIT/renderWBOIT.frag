#version 460
#extension GL_NV_gpu_shader5 : enable
#extension GL_NV_fragment_shader_interlock : enable
layout(pixel_interlock_unordered) in;

//WBOIT
uniform layout(binding=0,	rgba32f) coherent image2D accumulationTex;
uniform layout(binding = 1, r32f) coherent image2D productTex;

out vec4 test;

void main(void) {
	
	ivec2 coords=ivec2(gl_FragCoord.xy);

	vec4 color = computeColor();

	beginInvocationInterlockNV();

	vec4 acc = 	imageLoad(accumulationTex, coords);
	float product = imageLoad(productTex, coords).r;
	
	product = product * (1-alpha);
	acc = acc + vec4(color.rgb*alpha*weight,alpha*weight);

	imageStore(accumulationTex, coords, acc);
	imageStore(productTex, coords, vec4(product));
	
	endInvocationInterlockNV();

}
