#version 300 es

precision mediump float;
out vec4 fragColor;
in vec2 fragCoord;
uniform float iTime;
uniform float iTimeDelta;
uniform float iFrame;
uniform vec4 iMouse;
uniform vec2 iResolution;
