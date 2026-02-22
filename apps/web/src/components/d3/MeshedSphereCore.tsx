'use client';

import { useEffect, useRef, useCallback, memo, useMemo } from 'react';
import { useTheme } from 'styled-components';
import * as d3 from 'd3';
import BaseChart from './BaseChart';
import { LUMEN_CONFIG } from '../../lumen.config';

interface MeshedSphereCoreProps {
    biometricsRef: React.RefObject<{
        bpm: number;
        stress: number;
        vitality: number;
        ageRatio: number;
    }>;
    isPlaying: boolean;
}

const MeshedSphereCore = memo(({
    biometricsRef,
    isPlaying = true
}: MeshedSphereCoreProps) => {
    console.log('[MeshedSphereCore] Initial Mount');

    const timerRef = useRef<d3.Timer | null>(null);
    const rotationRef = useRef({ x: 0, y: 0, dx: 0.2, dy: 0.1 });
    const lastDirectionChangeRef = useRef<number>(0);
    const lastComplexityRef = useRef<number>(50);

    // Selection refs for imperative updates
    const linesGRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
    const pointsGRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
    const selectionRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
    const currentDataRef = useRef<{ points: any[], connections: [number, number][] } | null>(null);

    const theme = useTheme();

    const sphereColors = useMemo(() => ({
        cold: theme.palette.visuals.sphere.cold,
        neutral: theme.palette.visuals.sphere.neutral,
        hot: theme.palette.visuals.sphere.hot
    }), [theme]);

    // 1. Organic Color Palette (Cold Loneliness -> Warm Storm)
    const colorScale = useMemo(() => d3.scaleLinear<string>()
        .domain([0, 0.5, 1])
        .range([sphereColors.cold, sphereColors.neutral, sphereColors.hot])
        .interpolate(d3.interpolateHsl), [sphereColors]);

    // 2. Opacity Scale based on Vitality
    const opacityScale = d3.scaleLinear<number>()
        .domain([0, 0.4, 1])
        .range([0.2, 0.6, 1]);

    // 3. Radius Factor Scale (Vitality-driven size)
    const radiusScale = d3.scaleLinear<number>()
        .domain([0, 1])
        .range([0.2, 0.55]); // Radius as fraction of container size

    // Geometry generator (imperative)
    const generateData = useCallback((comp: number) => {
        const numPoints = Math.floor(d3.scaleLinear().domain([1, 100]).range([20, 200])(comp));
        const points = d3.range(numPoints).map(() => {
            const phi = Math.acos(-1 + (2 * Math.random()));
            const theta = Math.random() * 2 * Math.PI;
            return {
                phi,
                theta,
                originalX: Math.sin(phi) * Math.cos(theta),
                originalY: Math.sin(phi) * Math.sin(theta),
                originalZ: Math.cos(phi),
                offset: Math.random() * Math.PI * 2
            };
        });

        const connections: [number, number][] = [];
        const threshold = d3.scaleLinear().domain([1, 100]).range([0.8, 0.4])(comp);

        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const dist = Math.sqrt(
                    Math.pow(points[i].originalX - points[j].originalX, 2) +
                    Math.pow(points[i].originalY - points[j].originalY, 2) +
                    Math.pow(points[i].originalZ - points[j].originalZ, 2)
                );
                if (dist < threshold) {
                    connections.push([i, j]);
                }
            }
        }
        return { points, connections };
    }, []);

    const onReady = useCallback((
        selection: d3.Selection<SVGGElement, unknown, null, undefined>,
        dimensions: { width: number; height: number }
    ) => {
        const { width, height } = dimensions;
        const radius = Math.min(width, height) * 0.4;
        const centerX = width / 2;
        const centerY = height / 2;

        selection.selectAll('*').remove();
        selectionRef.current = selection;

        const container = selection.append('g')
            .attr('transform', `translate(${centerX}, ${centerY})`);

        linesGRef.current = container.append('g').attr('class', 'lines');
        pointsGRef.current = container.append('g').attr('class', 'points');

        const projection = d3.geoOrthographic()
            .scale(radius)
            .translate([0, 0]);

        if (timerRef.current) timerRef.current.stop();

        timerRef.current = d3.timer((elapsed) => {
            if (!isPlaying || !biometricsRef.current) return;

            const { bpm, stress, vitality, ageRatio } = biometricsRef.current;

            // Age-based complexity bell curve: [0, 1] -> [0.3, 1.0]
            const lifeFactor = 0.3 + 0.7 * Math.sin(Math.PI * ageRatio);

            // Dynamic derived values - Boosted for better visual density
            const baseComplexity = 20 + (vitality * 80);
            const complexity = baseComplexity * lifeFactor;

            const movementSize = stress * 10;
            const rotationInterval = (60 / Math.max(bpm, LUMEN_CONFIG.MIN_PULSE_BPM)) * 5000;
            const strokeColor = colorScale(stress);
            const strokeOpacity = opacityScale(vitality);

            // Dynamic Radius based on Vitality and Stress (contracts under stress)
            const baseRadiusFactor = radiusScale(vitality);
            const stressContractFactor = 1.0 - (stress * 0.4); // Shrink by up to 40% under high stress
            const pulseAmount = Math.sin(elapsed * 0.002) * (stress * 0.05); // Slower, more organic pulse speed
            const radius = Math.min(width, height) * (baseRadiusFactor * stressContractFactor + pulseAmount);

            projection.scale(radius);


            // Handle complexity changes (requires re-generation)
            if (Math.abs(complexity - lastComplexityRef.current) > 5 || !currentDataRef.current) {
                currentDataRef.current = generateData(complexity);
                lastComplexityRef.current = complexity;
                if (linesGRef.current) linesGRef.current.selectAll('*').remove();
                if (pointsGRef.current) pointsGRef.current.selectAll('*').remove();
            }

            const data = currentDataRef.current;
            if (!data || !linesGRef.current || !pointsGRef.current) return;

            // Handle direction change
            if (elapsed - lastDirectionChangeRef.current > rotationInterval) {
                rotationRef.current.dx = (Math.random() - 0.5) * 0.5;
                rotationRef.current.dy = (Math.random() - 0.5) * 0.5;
                lastDirectionChangeRef.current = elapsed;
            }

            // Update rotation
            rotationRef.current.x += rotationRef.current.dx;
            rotationRef.current.y += rotationRef.current.dy;
            projection.rotate([rotationRef.current.x, rotationRef.current.y]);

            const breathingFactor = movementSize * 0.02;

            const projectedPoints = data.points.map(p => {
                const breathing = Math.sin(elapsed * 0.002 + p.offset) * breathingFactor;
                const r = 1 + breathing;
                const d = projection([
                    (p.theta * 180) / Math.PI,
                    (p.phi * 180) / Math.PI - 90
                ]);
                return {
                    x: d ? d[0] * r : 0,
                    y: d ? d[1] * r : 0,
                    visible: d ? (projection.clipAngle() ? d3.geoDistance([p.theta * 180 / Math.PI, p.phi * 180 / Math.PI - 90], [-rotationRef.current.x, -rotationRef.current.y]) < Math.PI / 2 : true) : false
                };
            });

            // Draw Lines
            const lines = linesGRef.current.selectAll<SVGLineElement, [number, number]>('line')
                .data(data.connections);

            lines.enter()
                .append('line')
                .merge(lines as any)
                .attr('x1', d => projectedPoints[d[0]].x)
                .attr('y1', d => projectedPoints[d[0]].y)
                .attr('x2', d => projectedPoints[d[1]].x)
                .attr('y2', d => projectedPoints[d[1]].y)
                .attr('stroke', strokeColor)
                .attr('stroke-width', 0.7)
                .attr('stroke-opacity', d => {
                    const p1 = projectedPoints[d[0]];
                    const p2 = projectedPoints[d[1]];
                    const baseOpacity = (p1.visible && p2.visible) ? 0.4 : 0.05;
                    return baseOpacity * strokeOpacity;
                });

            lines.exit().remove();

            // Draw Points
            const circles = pointsGRef.current.selectAll<SVGCircleElement, any>('circle')
                .data(projectedPoints);

            circles.enter()
                .append('circle')
                .attr('r', 2)
                .merge(circles as any)
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .attr('fill', strokeColor)
                .attr('fill-opacity', d => (d.visible ? 0.8 : 0.1) * strokeOpacity);

            circles.exit().remove();
        });

    }, [biometricsRef, generateData, isPlaying, colorScale]);

    useEffect(() => {
        return () => {
            if (timerRef.current) timerRef.current.stop();
        };
    }, []);

    return (
        <BaseChart onReady={onReady} />
    );
}, () => true); // Never re-render after mount

MeshedSphereCore.displayName = 'MeshedSphereCore';

export default MeshedSphereCore;
