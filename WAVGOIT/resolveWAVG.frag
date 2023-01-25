#version 460
#extension GL_NV_gpu_shader5 : enable

in vec2 uv;

//WAVG textures
uniform layout(binding =0,	rgba32f) coherent image2D accumulationTex;
uniform layout(binding=1, r32ui) coherent uimage2D fragmentCounterTex;

uniform sampler2D opaqueBG;

out vec4 FragColor;

void main(void) {
	
	ivec2 coords=ivec2(gl_FragCoord.xy);
	vec4 bgColor = vec4(texture(opaqueBG, uv).rgb,1.0f);

	float frag = float(uint(imageLoad(fragmentCounterTex,coords).r));
	if(frag==0){
		FragColor = bgColor;
	}
	else{
		vec4 acc = 	imageLoad(accumulationTex, coords);

		float prod = pow(max(0.0,1.0-(1/frag)*acc.a),frag);

		vec3 finalColor = acc.rgb/max(acc.a,0.00001);
		FragColor = vec4(finalColor*(1-prod)+prod*bgColor.rgb,1.0f);

	}
}