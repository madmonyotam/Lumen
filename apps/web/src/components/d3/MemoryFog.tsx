import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';
import { useOrgan } from '../../context/OrganContext';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  pointer-events: none;
  overflow: hidden;
`;

interface FogParticle extends d3.SimulationNodeDatum {
    id: string;
    text: string;
    importance: number;
    createdAt: number;
    opacity: number;
    vx: number;
    vy: number;
}

export const MemoryFog: React.FC = () => {
    const { organState } = useOrgan();
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const particlesRef = useRef<FogParticle[]>([]);
    const lastProcessedMemoryIds = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!organState?.status?.activeMemories) return;

        const now = Date.now();
        const activeMemories = organState.status.activeMemories;

        activeMemories.forEach(memory => {
            if (!lastProcessedMemoryIds.current.has(memory.id)) {
                lastProcessedMemoryIds.current.add(memory.id);

                if (memory.keywords && memory.keywords.length > 0) {
                    memory.keywords.forEach((keyword, index) => {
                        particlesRef.current.push({
                            id: `${memory.id}-${index}-${now}`,
                            text: keyword,
                            importance: memory.importance || 0.5,
                            createdAt: now,
                            opacity: 0,
                            x: Math.random() * (window.innerWidth || 800),
                            y: Math.random() * (window.innerHeight || 600),
                            vx: (Math.random() - 0.5) * 0.7, // תנועה ראשונית מעט מהירה יותר
                            vy: (Math.random() - 0.5) * 0.7
                        });
                    });

                    // --- תיקון 1: הגדלת המכסה ל-60 חלקיקים ---
                    // זה מאפשר לערפל להצטבר לאורך זמן ולא להימחק בפתאומיות
                    if (particlesRef.current.length > 60) {
                        particlesRef.current.sort((a, b) => b.createdAt - a.createdAt);
                        particlesRef.current = particlesRef.current.slice(0, 60);
                    }
                }
            }
        });
    }, [organState?.status?.activeMemories]);

    useEffect(() => {
        if (!containerRef.current || !svgRef.current) return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        const svg = d3.select(svgRef.current);

        const simulation = d3.forceSimulation<FogParticle>(particlesRef.current)
            .force("charge", d3.forceManyBody().strength(-40))
            // --- תיקון 2: רדיוס התנגשות גדול יותר למניעת חפיפת טקסט בעברית ---
            .force("collide", d3.forceCollide<FogParticle>().radius(d => 30 + (d.importance * 40)))
            .alphaDecay(0);

        const tick = () => {
            const now = Date.now();
            const lifespan = 15000;

            particlesRef.current = particlesRef.current.filter(p => {
                const age = now - p.createdAt;
                if (age > lifespan) return false;

                // --- תיקון 3: שיפור ה-Opacity ---
                if (age < 3000) { // Fade in איטי יותר (3 שניות)
                    p.opacity = age / 3000;
                } else if (age > 10000) { // Fade out ב-5 השניות האחרונות
                    p.opacity = (lifespan - age) / 5000;
                } else {
                    // רצפת שקיפות של 0.4 גם לחשיבות נמוכה
                    p.opacity = 0.4 + (p.importance * 0.6);
                }

                // תנועה חופשית
                p.vx! += (Math.random() - 0.5) * 0.08;
                p.vy! += (Math.random() - 0.5) * 0.08;
                p.vx! *= 0.98;
                p.vy! *= 0.98;

                if (p.x! < -100) p.x = width + 100;
                if (p.x! > width + 100) p.x = -100;
                if (p.y! < -100) p.y = height + 100;
                if (p.y! > height + 100) p.y = -100;

                return true;
            });

            const nodes = svg.selectAll<SVGTextElement, FogParticle>(".fog-word")
                .data(particlesRef.current, d => d.id);

            const enter = nodes.enter()
                .append("text")
                .attr("class", "fog-word")
                .attr("text-anchor", "middle")
                .style("fill", "white")
                .style("font-weight", "300")
                .style("pointer-events", "auto")
                .text(d => d.text);

            nodes.merge(enter)
                .attr("x", d => d.x!)
                .attr("y", d => d.y!)
                .style("opacity", d => d.opacity)
                // --- תיקון 4: פונט קריא יותר וטשטוש מופחת ---
                .style("font-size", d => `${1.1 + d.importance * 1.8}rem`)
                .style("filter", d => `blur(${Math.max(0, (0.8 - d.importance) * 2)}px)`);

            nodes.exit().remove();
            simulation.nodes(particlesRef.current);
        };

        simulation.on("tick", tick);
        return () => {
            simulation.stop();
        };
    }, []);

    return (
        <Container ref={containerRef}>
            <svg ref={svgRef} width="100%" height="100%" style={{ overflow: 'visible' }} />
        </Container>
    );
};