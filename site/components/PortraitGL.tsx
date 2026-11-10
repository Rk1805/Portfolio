'use client'

import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import { LinearFilter, LinearMipmapNearestFilter, NoColorSpace, TextureLoader, Vector2 } from 'three'
import { getLevel, subscribe } from '@/lib/resolution'

// Dial level → columns at rest / under the pointer. 64 is the source width: it never gets finer.
const BASE = [8, 8, 16, 16, 16, 16]
const FINE = [8, 16, 32, 32, 64, 64]

const vertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`

// Luminance of a 64×80 grayscale source, averaged per block (mip level), mapped to the 6-step ramp.
const fragment = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uPointer;
uniform float uActive;
uniform float uBase;
uniform float uFine;

vec3 ramp(float i) {
  if (i < 0.5) return vec3(0.024, 0.027, 0.039);
  if (i < 1.5) return vec3(0.059, 0.165, 0.200);
  if (i < 2.5) return vec3(0.122, 0.435, 0.502);
  if (i < 3.5) return vec3(0.271, 0.784, 0.878);
  if (i < 4.5) return vec3(1.000, 0.604, 0.239);
  return vec3(0.929, 0.914, 0.878);
}

void main() {
  // decide resolution per coarse block so finer blocks always nest inside it
  vec2 coarse = (floor(vUv * vec2(uBase, uBase * 1.25)) + 0.5) / vec2(uBase, uBase * 1.25);
  vec2 d = (coarse - uPointer) * vec2(1.0, 1.25);
  float f = (1.0 - smoothstep(0.08, 0.42, length(d))) * uActive;
  float cols = f > 0.66 ? uFine : f > 0.33 ? min(uFine, uBase * 2.0) : uBase;
  vec2 grid = vec2(cols, cols * 1.25);
  vec2 cell = (floor(vUv * grid) + 0.5) / grid;
  float l = textureLod(uTex, cell, log2(64.0 / cols)).r;
  gl_FragColor = vec4(ramp(floor(l * 5.0 + 0.5)), 1.0);
}`

function Mosaic({ pointer, active }: { pointer: React.RefObject<Vector2>; active: React.RefObject<number> }) {
  const tex = useLoader(TextureLoader, '/media/portrait/portrait-src.png')
  const invalidate = useThree((s) => s.invalidate)
  const uniforms = useMemo(() => {
    tex.colorSpace = NoColorSpace
    tex.generateMipmaps = true
    tex.minFilter = LinearMipmapNearestFilter
    tex.magFilter = LinearFilter
    tex.needsUpdate = true
    return {
      uTex: { value: tex },
      uPointer: { value: new Vector2(0.5, 0.6) },
      uActive: { value: 0 },
      uBase: { value: BASE[getLevel()] },
      uFine: { value: FINE[getLevel()] },
    }
  }, [tex])

  useEffect(
    () =>
      subscribe(() => {
        uniforms.uBase.value = BASE[getLevel()]
        uniforms.uFine.value = FINE[getLevel()]
        invalidate()
      }),
    [uniforms, invalidate],
  )

  // Decorative pointer tracking: ease toward the target, render only while something is moving.
  useFrame(() => {
    const p = uniforms.uPointer.value
    const target = active.current ?? 0
    p.lerp(pointer.current, 0.18)
    uniforms.uActive.value += (target - uniforms.uActive.value) * 0.12
    if (p.distanceTo(pointer.current) > 0.001 || Math.abs(target - uniforms.uActive.value) > 0.005) invalidate()
  })

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      {/* args, not props: the material must keep this exact uniforms object so the frame loop can write to it */}
      <shaderMaterial args={[{ uniforms, vertexShader: vertex, fragmentShader: fragment }]} />
    </mesh>
  )
}

export default function PortraitGL() {
  const pointer = useRef(new Vector2(0.5, 0.6))
  const active = useRef(0)
  const [ready, setReady] = useState(false)
  const wake = useRef<() => void>(() => {})

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    pointer.current.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height)
    active.current = 1
    wake.current()
  }
  const leave = () => {
    active.current = 0
    wake.current()
  }

  return (
    <div data-ready={ready ? '' : undefined} onPointerMove={move} onPointerDown={move} onPointerLeave={leave} onPointerCancel={leave} aria-hidden="true">
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }}
        onCreated={({ invalidate }) => {
          wake.current = () => invalidate()
          // fade in over the poster only once a frame exists
          requestAnimationFrame(() => setReady(true))
        }}
      >
        <Mosaic pointer={pointer} active={active} />
      </Canvas>
    </div>
  )
}
