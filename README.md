# Portfolio

The Universal Production Prompt
"A high-fidelity, interactive 3D System Schema for a professional Computer Science portfolio. The environment is an infinite dark charcoal grey (#121212) canvas with a subtle, non-distracting 3D coordinate grid. The focal point is an asymmetric network of five matte obsidian-black (#000000) spheres, each representing a technical domain. These nodes are interconnected by a complex web of architectural dark grey (#262626) structural lines. A concentrated, emissive crimson-red (#FF0000) energy pulse travels methodically along the connection lines with a heartbeat frequency. The lighting is cold-industrial with high-contrast rim highlights. On user hover, nodes scale dynamically and emit a radiant red bloom effect. On scroll, the entire geometry undergoes a modular assembly animation, transitioning from a loose data cloud into a singular, compact architectural core. Optimized for high-performance WebGL/WebGPU with baked ambient occlusion and responsive camera depth-of-field."
Ultra-Detail Implementation Blueprint
1. The Color System (Hex/Specs)


Background: #121212 (Neutral Charcoal) — Prevents the "Cybersecurity/Hacker" pure-black cliché.

Structural Nodes: #000000 (Matte Obsidian) — Needs a "Roughness" setting of 0.7 to absorb light.

The "Logic" Color: #FF0000 (Pure Red) — Use with a Bloom/Glow strength of 1.2 for that "powered-on" feel.

Typography: Primary: #FFFFFF (Pure White). Secondary/Labels: #888888 (Soft Grey).

2. Cross-Device Optimization


Desktop (Mouse):
• Interaction: 3D scene follows the cursor with a 0.05 damping factor (smooth parallax).
• Effect: Full post-processing enabled (Bloom, SSAO shadows).

Mobile (Touch/Gyro):
• Interaction: The 3D model tilts based on the phone's Accelerometer (Orientation API).
• Optimization: Disable real-time shadows; use Matcap materials to keep the frame rate at 60fps on mobile browsers.

Typography: Use the JetBrains Mono variable font. Set font-size: clamp(14px, 2vw, 18px) to ensure readability on both a watch-sized screen and a 32-inch monitor.

3. The "Action" Sequence (User Experience)


EventVisual ResponseSystem LogicInitial HitText prints: > MAPPING_NODES...Loads 3D Geometry into Cache.Active LoadRed pulse travels faster.Tracks THREE.LoadingManager progress.CompleteA final "Red Flash" fills the lines.Triggers gsap.to(camera.position) to zoom in.The ExitThe 3D scene dissolves into the grid.Unmounts the loader component to save RAM.


4. Background Interaction (The "Invisible" Detail)
As a CS student, you want the background to feel "computed." Add a "Noise Texture" overlay at 0.03 opacity. This makes the grey background feel like a physical screen or a blueprint rather than just a flat digital color.
Final Instruction for the Build:
When you paste the prompt into Spline or your code editor, ensure the "Field of View" (FOV) of your camera is set to 35. This provides a professional, architectural look that prevents the 3D objects from looking "distorted" or "bubbly" on wide desktop monitors.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e0abea8d-a46c-460b-a880-5da16cae9c94).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
