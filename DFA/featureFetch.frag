#version 460
#extension GL_NV_gpu_shader5 : enable
#extension GL_NV_fragment_shader_interlock : enable
layout(pixel_interlock_unordered) in;

//DFA
uniform layout(binding=0, rgb32ui) coherent uimage2D fragmentCounterTex;
uniform layout(binding =1, rgba16f) coherent image2D accTex;
uniform layout(binding =2, rgba16f) coherent image2D averageTex;
uniform layout(binding =3, rgba32f) coherent image2DArray bucketTex;

void main(void) {
	ivec2 coords=ivec2(gl_FragCoord.xy);

	vec4 fragColor = computeColor();
	float depth = gl_FragCoord.z;	

	vec4 temp;
	float tempD;

	beginInvocationInterlockNV();

	//avg color/alpha
	vec4 prevAvg = imageLoad(averageTex, coords);
	prevAvg = prevAvg + vec4(fragColor.rgb,alpha);
	imageStore(averageTex, coords,prevAvg);
	
	//acc - prod
	vec4 prevAcc = imageLoad(accTex, coords);
	prevAcc.rgb = prevAcc.rgb + (fragColor.rgb * alpha);
	prevAcc.a = prevAcc.a * (1-alpha);
	imageStore(accTex, coords,prevAcc);

	//1st,2nd fragment
	vec4 fragments[2];
	fragments[0] = imageLoad(bucketTex,ivec3(coords,0));
	fragments[1] = imageLoad(bucketTex,ivec3(coords,1));
	
	//Count +1 fragment
	uvec3 fragsAndDepths = uvec3(imageLoad(fragmentCounterTex,coords));
	fragsAndDepths.r += 1U;
	
	//Increase count before 
	imageStore(fragmentCounterTex,(coords,0),uvec4(fragsAndDepths,0U));
	float depth1 = uintBitsToFloat(fragsAndDepths.g);
	float depth2 = uintBitsToFloat(fragsAndDepths.b);

	if(depth <= depth1)
	{
		temp  = fragColor;
		tempD = depth;
		fragColor = fragments[0];
		depth = depth1;
		fragments[0] = temp;
		depth1 = depth;
	    imageStore(bucketTex,ivec3(coords,0),temp);
	    fragsAndDepths.g = floatBitsToUint(depth1)
	    imageStore(fragmentCounterTex,coords,uvec4(fragsAndDepths,0U));	
	}
	if(depth <= depth2)
	{
		temp  = fragColor;
		tempD = depth;
		fragColor = fragments[1];
		depth = depth2;
		fragments[1] = temp;
		depth1 = depth;
	    imageStore(bucketTex,ivec3(coords,1),temp);
	    fragsAndDepths.g = floatBitsToUint(depth2)
	    imageStore(fragmentCounterTex,coords,uvec4(fragsAndDepths,0U));	
	}
	
	endInvocationInterlockNV();

}