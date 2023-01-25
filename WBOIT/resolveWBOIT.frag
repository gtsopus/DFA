#version 460
#extension GL_NV_gpu_shader5 : enable

in vec2 uv;

//WBOIT textures
uniform layout(binding =0,	rgba32f) coherent image2D accumulationTex;
uniform layout(binding = 1, r32f)	 coherent image2D productTex;

uniform sampler2D opaqueBG;

out vec4 FragColor;

void main(void) {
	
	ivec2 coords=ivec2(gl_FragCoord.xy);
	
	vec4 acc = 	imageLoad(accumulationTex, coords);
	vec4 bgColor = vec4(texture(opaqueBG, uv).rgb,1.0f);
	float product = imageLoad(productTex, coords).r;
	
	//0 transparent fragments
	if(product == 1.0f){
		FragColor = bgColor;
	}
	else{
		vec3 finalColor = (acc.rgb/acc.a)*(1-product)+product*bgColor.rgb;
		FragColor = vec4(finalColor,1.0f);
	}
}