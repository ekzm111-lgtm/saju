"use client";

import React, { useEffect, useRef } from 'react';

export function StarBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // 기존 별 제거
        container.innerHTML = '';

        // 별 생성 (200개)
        for (let i = 0; i < 200; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            const size = Math.random() * 2 + 1;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 3 + 2;

            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.setProperty('--delay', `${delay}s`);
            star.style.setProperty('--duration', `${duration}s`);
            
            container.appendChild(star);
        }

        // 유성 생성 로직
        const createShootingStar = () => {
            const star = document.createElement('div');
            star.className = 'shooting-star';
            
            const startX = Math.random() * window.innerWidth + 300;
            const startY = Math.random() * (window.innerHeight / 3) - 100;
            
            star.style.left = `${startX}px`;
            star.style.top = `${startY}px`;
            
            const duration = Math.random() * 0.8 + 0.4;
            star.style.animation = `shooting-animation ${duration}s ease-in forwards`;
            
            container.appendChild(star);
            
            setTimeout(() => {
                star.remove();
            }, 2000);
        };

        const shootingInterval = setInterval(createShootingStar, 6000);

        // 패러랙스 효과
        const handleMouseMove = (e: MouseEvent) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
            container.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
        };

        const handleScroll = () => {
            const scrollPos = window.pageYOffset;
            container.style.top = `${scrollPos * 0.03}px`;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        return () => {
            clearInterval(shootingInterval);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div id="star-background" ref={containerRef} />
    );
}
