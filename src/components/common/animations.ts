// https://github.com/revoltchat/components/blob/master/src/components/common/animations.ts

import { keyframes } from "styled-components";

export const animationFadeIn = keyframes`
    0% {opacity: 0;}
    70% {opacity: 0;}
    100% {opacity: 1;}
`;

export const animationFadeOut = keyframes`
    0% {opacity: 1;}
    70% {opacity: 0;}
    100% {opacity: 0;}
`;

export const animationZoomIn = keyframes`
    0% {transform: scale(0.5);}
    98% {transform: scale(1.01);}
    100% {transform: scale(1);}
`;

export const animationZoomOut = keyframes`
    0% {transform: scale(1);}
    100% {transform: scale(0.5);}
`;
