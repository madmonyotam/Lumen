
'use client';

import { useEffect, useRef, useCallback, memo } from 'react';
import * as d3 from 'd3';
import BaseChart from './BaseChart';

// --- Types ---

export type LifecycleState = 'ENTERING' | 'ACTIVE' | 'EXITING';

export interface MemoryWord {
    id: string;
    text: string;

    // Visual properties
    size: number; // 0.1 to 1.0 (scale factor)
    blur: number; // 0.0 to 1.0
    color: string;

    // Lifecycle properties
    createdAt: number; // timestamp
}

interface BaseNode extends d3.SimulationNodeDatum {
    id: string;
    type: 'word' | 'fragment' | 'dust';
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
}

interface WordNode extends BaseNode {
    type: 'word';
    text: string;

    // Mapped from MemoryWord
    size: number;
    blur: number;
    color: string;
    createdAt: number;

    state: LifecycleState;
    width: number;
    height: number;
    assemblyProgress: number;
}

interface FragmentNode extends BaseNode {
    type: 'fragment';
    color: string;
    opacity: number;
    rotation: number;
    scale: number;
    blur: number; // Inherited from word
    createdAt: number;
}

interface DustNode extends BaseNode {
    type: 'dust';
    targetId: string;
    color: string;
    opacity: number;
}

type SimulationNode = WordNode | FragmentNode | DustNode;

interface LumenMemoryFlowCoreProps {
    words: MemoryWord[];
    speed?: number;
    lifeSpan?: number; // ms, global for all words
    maxWords?: number;
}

// --- Component ---

const LumenMemoryFlowCore = memo(({
    words,
    speed = 1,
    lifeSpan = 5000,
    maxWords = 20
}: LumenMemoryFlowCoreProps) => {
    const simulationRef = useRef<d3.Simulation<SimulationNode, undefined> | null>(null);
    const nodesRef = useRef<SimulationNode[]>([]);
    const widthRef = useRef(0);
    const heightRef = useRef(0);

    // Track previous words to identify new ones
    const prevWordsRef = useRef<Set<string>>(new Set());

    // Queue for words waiting to enter the simulation
    const pendingWordsRef = useRef<MemoryWord[]>([]);
    const lastSpawnRef = useRef<number>(0);

    const propsRef = useRef({ words, speed, lifeSpan, maxWords });

    useEffect(() => {
        propsRef.current = { words, speed, lifeSpan, maxWords };
    }, [words, speed, lifeSpan, maxWords]);

    // --- Logic ---

    const createWordNode = (wordData: MemoryWord, w: number, h: number): { word: WordNode, dust: DustNode[] } => {
        const fontSize = 12 + wordData.size * 24; // 12px to 36px
        const charWidth = fontSize * 0.6;
        const width = wordData.text.length * charWidth + 20;
        const height = fontSize + 10;

        const x = Math.random() * w;
        const y = Math.random() * h;

        const wordNode: WordNode = {
            id: wordData.id,
            type: 'word',
            text: wordData.text,
            size: wordData.size,
            blur: wordData.blur,
            color: wordData.color,
            createdAt: wordData.createdAt,
            state: 'ENTERING',
            width,
            height,
            assemblyProgress: 0,
            x,
            y,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        };

        const dustNodes: DustNode[] = [];
        const numDust = 5 + Math.floor(Math.random() * 5);
        for (let i = 0; i < numDust; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 20 + Math.random() * 40;
            dustNodes.push({
                id: `dust-${wordData.id}-${i}`,
                type: 'dust',
                targetId: wordData.id,
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist,
                vx: 0,
                vy: 0,
                color: wordData.color,
                opacity: 0.5 + Math.random() * 0.5
            });
        }

        return { word: wordNode, dust: dustNodes };
    };

    const shatterWord = (word: WordNode, nodes: SimulationNode[]) => {
        const numFragments = 15 + Math.floor(Math.random() * 25);
        for (let i = 0; i < numFragments; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = 5 + Math.random() * 8;
            nodes.push({
                id: `frag-${word.id}-${i}`,
                type: 'fragment',
                x: word.x! + (Math.random() - 0.5) * word.width * 0.8,
                y: word.y! + (Math.random() - 0.5) * word.height * 0.8,
                vx: Math.cos(angle) * velocity + (word.vx || 0),
                vy: Math.sin(angle) * velocity + (word.vy || 0),
                color: word.color,
                opacity: 1,
                rotation: Math.random() * 360,
                scale: 0.3 + Math.random() * 0.8, // Increased size significantly
                blur: word.blur, // Inherit blur
                createdAt: Date.now()
            });
        }
    };



    const limitRef = useRef(20); // Default limit

    useEffect(() => {
        limitRef.current = maxWords;
    }, [maxWords]);


    // Sync words prop with pending queue
    useEffect(() => {
        // 1. Identify New Words ONLY
        // We iterate through the incoming words and only process those we haven't seen before.
        const newWordsData = words.filter(w => !prevWordsRef.current.has(w.id));

        if (newWordsData.length > 0) {
            // Add new words to the pending queue
            pendingWordsRef.current.push(...newWordsData);

            // Mark them as 'seen' so we don't re-queue them
            newWordsData.forEach(w => prevWordsRef.current.add(w.id));

            // Ensure simulation is running to pick them up
            if (simulationRef.current) {
                simulationRef.current.alpha(0.3).restart();
            }
        }
    }, [words]);

    const onReady = useCallback((
        selection: d3.Selection<SVGGElement, unknown, null, undefined>,
        dimensions: { width: number; height: number }
    ) => {
        const { width, height } = dimensions;
        widthRef.current = width;
        heightRef.current = height;

        if (simulationRef.current) simulationRef.current.stop();
        selection.selectAll('*').remove();

        const dustG = selection.append('g').attr('class', 'dust');
        const fragmentsG = selection.append('g').attr('class', 'fragments');
        const wordsG = selection.append('g').attr('class', 'words');

        const simulation = d3.forceSimulation<SimulationNode>(nodesRef.current)
            .alphaDecay(0)
            .velocityDecay(0.6)
            .force('charge', d3.forceManyBody().strength((d) => {
                const node = d as SimulationNode;
                if (node.type === 'word') return -30 - (node as WordNode).width;
                return 0;
            }))
            .force('collide', d3.forceCollide().radius((d) => {
                const node = d as SimulationNode;
                if (node.type === 'word') return (node as WordNode).width * 0.55;
                return 0;
            }).strength(0.5).iterations(2))
            .force('boundary', () => {
                for (const nodeDatum of nodesRef.current) {
                    const node = nodeDatum as SimulationNode;
                    if (node.type === 'word') {
                        const word = node as WordNode;
                        const r = word.width / 2;
                        if (word.x! < r) { word.vx! += 0.5; }
                        if (word.x! > width - r) { word.vx! -= 0.5; }
                        if (word.y! < r) { word.vy! += 0.5; }
                        if (word.y! > height - r) { word.vy! -= 0.5; }
                    }
                }
            });

        simulationRef.current = simulation;

        simulation.on('tick', () => {
            const { speed, lifeSpan } = propsRef.current;
            const nodesToRemove = new Set<string>();
            const newNodes: SimulationNode[] = [];
            const now = Date.now();

            const activeWords = nodesRef.current.filter(n => n.type === 'word') as WordNode[];
            const wordPositions = new Map<string, { x: number, y: number }>();
            activeWords.forEach(w => wordPositions.set(w.id, { x: w.x!, y: w.y! }));

            nodesRef.current.forEach(node => {
                if (node.type === 'word') {
                    const w = node as WordNode;
                    const age = now - w.createdAt;

                    if (w.state === 'ENTERING') {
                        w.assemblyProgress += 0.02 * speed;
                        if (w.assemblyProgress >= 1) {
                            w.state = 'ACTIVE';
                            w.assemblyProgress = 1;
                        }
                    }

                    if (w.state === 'ACTIVE') {
                        // Check exact lifespan
                        if (age >= lifeSpan) {
                            w.state = 'EXITING';
                            shatterWord(w, newNodes);
                            nodesToRemove.add(w.id);
                            prevWordsRef.current.delete(w.id); // Allow re-entry
                        }
                    }
                } else if (node.type === 'fragment') {
                    const f = node as FragmentNode;
                    f.opacity -= 0.01 * speed;
                    if (f.opacity <= 0) nodesToRemove.add(f.id);
                } else if (node.type === 'dust') {
                    const d = node as DustNode;
                    const target = wordPositions.get(d.targetId);
                    if (!target) {
                        nodesToRemove.add(d.id);
                    } else {
                        d.x! += (target.x - d.x!) * 0.1 * speed;
                        d.y! += (target.y - d.y!) * 0.1 * speed;
                        d.opacity -= 0.02 * speed;
                        if (d.opacity <= 0) nodesToRemove.add(d.id);
                    }
                }
            });

            // --- Process Pending / Queue ---
            const currentActiveWords = nodesRef.current.filter(n => n.type === 'word' && (n as WordNode).state !== 'EXITING') as WordNode[];
            const currentCount = currentActiveWords.length;

            const max = propsRef.current.maxWords ?? 20;

            if (currentCount < max && pendingWordsRef.current.length > 0) {
                // Determine minimum time between spawns to avoid visual overlap
                const spawnDelay = (200 + Math.random() * 600) / speed;

                if (now - lastSpawnRef.current > spawnDelay) {
                    const wordData = pendingWordsRef.current.shift()!;

                    // Fix: Reset creation time. 
                    // Words queued here would otherwise use their fetch time from MemoryFog,
                    // causing them to spawn and instantly die if they sat in the pending queue too long.
                    wordData.createdAt = now;

                    const { word, dust } = createWordNode(wordData, widthRef.current, heightRef.current);
                    newNodes.push(word, ...dust);

                    lastSpawnRef.current = now;
                }
            }

            if (newNodes.length > 0 || nodesToRemove.size > 0) {
                nodesRef.current = nodesRef.current.filter(n => !nodesToRemove.has(n.id)).concat(newNodes);
                simulation.nodes(nodesRef.current);
                simulation.alpha(0.3).restart();
            }

            // Update forces for growing words
            (simulation.force('collide') as d3.ForceCollide<SimulationNode>).radius((d) => {
                const node = d as SimulationNode;
                if (node.type === 'word') {
                    const w = node as WordNode;
                    const scale = w.state === 'ENTERING' ? Math.max(0.1, w.assemblyProgress) : 1;
                    return w.width * 0.55 * scale;
                }
                return 0;
            });

            (simulation.force('charge') as d3.ForceManyBody<SimulationNode>).strength((d) => {
                const node = d as SimulationNode;
                if (node.type === 'word') {
                    const w = node as WordNode;
                    const scale = w.state === 'ENTERING' ? Math.max(0.1, w.assemblyProgress) : 1;
                    return (-30 - w.width) * scale;
                }
                return 0;
            });

            // --- Drawing ---

            const wordSelection = wordsG.selectAll<SVGTextElement, WordNode>('text.word')
                .data(nodesRef.current.filter(n => n.type === 'word') as WordNode[], d => d.id);

            const wordEnter = wordSelection.enter()
                .append('text')
                .attr('class', 'word')
                .attr('text-anchor', 'middle')
                .attr('dy', '0.35em')
                .style('font-family', '"Share Tech Mono", monospace')
                .style('font-weight', 'bold');

            wordEnter.merge(wordSelection)
                .attr('transform', d => `translate(${d.x},${d.y})`)
                .text(d => d.text)
                .style('font-size', d => {
                    const baseSize = 12 + d.size * 24;
                    const scale = d.state === 'ENTERING' ? d.assemblyProgress : 1;
                    return `${baseSize * scale}px`;
                })
                .style('fill', d => d.color)
                .style('opacity', d => {
                    if (d.state === 'ENTERING') return d.assemblyProgress;
                    // Fade based on age vs lifespan
                    const age = now - d.createdAt;
                    const lifeRatio = 1 - (age / lifeSpan);
                    return Math.max(0.1, 0.5 + 0.5 * lifeRatio);
                })
                .style('filter', d => {
                    const entryBlur = (1 - d.assemblyProgress) * 8;
                    const persistentBlur = d.blur * 4;
                    return `blur(${entryBlur + persistentBlur}px)`;
                });

            wordSelection.exit().remove();

            const dustSelection = dustG.selectAll<SVGCircleElement, DustNode>('circle.dust')
                .data(nodesRef.current.filter(n => n.type === 'dust') as DustNode[], d => d.id);

            dustSelection.enter()
                .append('circle')
                .attr('class', 'dust')
                .attr('r', 1)
                .merge(dustSelection)
                .attr('cx', d => d.x!)
                .attr('cy', d => d.y!)
                .style('fill', d => d.color)
                .style('opacity', d => d.opacity);

            dustSelection.exit().remove();

            const fragmentSelection = fragmentsG.selectAll<SVGPathElement, FragmentNode>('path.frag')
                .data(nodesRef.current.filter(n => n.type === 'fragment') as FragmentNode[], d => d.id);

            fragmentSelection.enter()
                .append('path')
                .attr('class', 'frag')
                .attr('d', d => {
                    const s = (d.scale || 1) * 3;
                    return `M0,${-s} L${s},${s} L${-s},${s} Z`;
                })
                .merge(fragmentSelection)
                .attr('transform', d => `translate(${d.x},${d.y}) rotate(${d.rotation})`)
                .style('fill', d => d.color)
                .style('opacity', d => d.opacity)
                .style('filter', d => `blur(${d.blur * 4}px)`);

            fragmentSelection.exit().remove();

            nodesRef.current.forEach(node => {
                if (node.type === 'word') {
                    const maxSpeed = 1.5 * speed;
                    if (node.vx && Math.abs(node.vx) > maxSpeed) node.vx = (node.vx / Math.abs(node.vx)) * maxSpeed;
                    if (node.vy && Math.abs(node.vy) > maxSpeed) node.vy = (node.vy / Math.abs(node.vy)) * maxSpeed;
                } else if (node.type === 'fragment') {
                    if (node.vx) node.vx *= 0.98;
                    if (node.vy) node.vy *= 0.98;
                }
            });
        });

    }, []);

    useEffect(() => {
        return () => {
            if (simulationRef.current) simulationRef.current.stop();
        };
    }, []);

    return (
        <BaseChart onReady={onReady} />
    );
});

LumenMemoryFlowCore.displayName = 'LumenMemoryFlowCore';

export default LumenMemoryFlowCore;
