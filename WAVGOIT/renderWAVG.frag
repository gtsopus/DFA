#version 460
#extension GL_NV_gpu_shader5 : enable
#extension GL_NV_fragment_shader_interlock : enable
layout(pixel_interlock_unordered) in;

//WAVG
uniform layout(binding =0, rgba32f) coherent image2D accTex;
uniform layout(binding=1, r32ui) coherent uimage2D fragmentCounterTex;



void main(void) {

	ivec2 coords=ivec2(gl_FragCoord.xy);

	//count +1 fragment
	imageAtomicAdd(fragmentCounterTex,coords,1U);

	vec4 fragColor = computeColor()*alpha;
	fragColor.a = alpha;
	
	beginInvocationInterlockNV();

	//acc
	vec4 prevAcc = imageLoad(accTex, coords);
	prevAcc = prevAcc + fragColor;
	imageStore(accTex, coords,prevAcc);
	
	endInvocationInterlockNV();

}