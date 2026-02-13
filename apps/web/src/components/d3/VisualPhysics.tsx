import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { LUMEN_CONFIG } from '../../lumen.config';

interface VisualPhysicsProps {
    bpm: number;
    stress: number;
    vitality: number;
}

const OrganContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
`;

export const VisualPhysics: React.FC<VisualPhysicsProps> = ({ bpm, stress, vitality }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        const width = 400;
        const height = 400;

        // Clear previous renders
        svg.selectAll("*").remove();

        // Color Logic based on stress
        const coreColor = stress > LUMEN_CONFIG.STRESS_COLOR_THRESHOLD ? '#ff4d4d' : '#00f2c3';

        // Base Orb
        const orb = svg.append("circle")
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr("r", LUMEN_CONFIG.DEFAULT_ORB_RADIUS * vitality) // Radius scales with vitality
            .attr("fill", coreColor)
            .attr("fill-opacity", 0.6)
            .attr("filter", "url(#glow)"); // Assuming a glow filter definition exists or we add it

        // Glow Filter Definition
        const defs = svg.append("defs");
        const filter = defs.append("filter")
            .attr("id", "glow");

        filter.append("feGaussianBlur")
            .attr("stdDeviation", "8")
            .attr("result", "coloredBlur");

        const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode").attr("in", "coloredBlur");
        feMerge.append("feMergeNode").attr("in", "SourceGraphic");

        // Pulse Animation Loop
        const pulseEffect = () => {
            const beatDuration = (60 / Math.max(bpm, LUMEN_CONFIG.MIN_PULSE_BPM)) * 1000;

            orb.transition()
                .duration(beatDuration * 0.4) // Contract
                .attr("r", (LUMEN_CONFIG.DEFAULT_ORB_RADIUS * vitality) * 0.9)
                .transition()
                .duration(beatDuration * 0.6) // Expand
                .attr("r", (LUMEN_CONFIG.DEFAULT_ORB_RADIUS * vitality) * 1.05)
                .on("end", pulseEffect);
        };

        pulseEffect();

    }, [bpm, stress, vitality]);

    return (
        <OrganContainer>
            <svg ref={svgRef} viewBox="0 0 400 400" width="100%" height="100%" style={{ maxHeight: '100%', maxWidth: '100%' }} />
        </OrganContainer>
    );
};
