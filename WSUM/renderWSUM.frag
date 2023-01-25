#version 460
#extension GL_NV_gpu_shader5 : enable
#extension GL_NV_fragment_shader_interlock : enable
layout(pixel_interlock_unordered) in;

//WSUM
uniform layout(binding=0,	rgba32f) coherent image2D accumulationTex;

out vec4 test;

void main(void) {
	
	ivec2 coords=ivec2(gl_FragCoord.xy);
	vec4 color = computeColor();
	color.a = alpha;

	beginInvocationInterlockNV();

	vec4 acc = imageLoad(accumulationTex, coords);
	acc += vec4(color.rgb*alpha,alpha);
	imageStore(accumulationTex, coords, acc);
	
	endInvocationInterlockNV();

}