#version 460
#extension GL_NV_gpu_shader5 : enable

in vec2 uv;

//WSUM textures
uniform layout(binding =0,	rgba32f) coherent image2D accumulationTex;

uniform sampler2D opaqueBG;

out vec4 FragColor;

void main(void) {
		
	ivec2 coords=ivec2(gl_FragCoord.xy);
	
	vec4 acc = 	imageLoad(accumulationTex, coords);
	vec4 bgColor = vec4(texture(opaqueBG, uv).rgb,1.0f);
	
	FragColor = vec4(acc.rgb+ (1-acc.a)*bgColor.rgb,1.0f);

}