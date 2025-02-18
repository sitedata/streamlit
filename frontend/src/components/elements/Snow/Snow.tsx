/**
 * @license
 * Copyright 2018-2022 Streamlit Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { ReactElement, memo } from "react"

/*
 * IMPORTANT: If you change the asset imports below, make sure they still work if Streamlit is
 * served from a subpath.
 */
import Flake0 from "src/assets/img/snow/flake-0.png"
import Flake1 from "src/assets/img/snow/flake-1.png"
import Flake2 from "src/assets/img/snow/flake-2.png"

import Particles from "../Particles"
import { ParticleProps } from "../Particles/Particles"

import { StyledFlake } from "./styled-components"

export const NUM_FLAKES = 100

const FLAKE_IMAGES: string[] = [Flake0, Flake1, Flake2]

const NUM_FLAKE_TYPES = FLAKE_IMAGES.length

export interface Props {
  scriptRunId: string
}

function Snow({ scriptRunId }: Props): ReactElement {
  // Keys should be unique each time, so React replaces the images in the DOM and their animations
  // actually rerun.
  return (
    <Particles
      className="snow"
      scriptRunId={scriptRunId}
      numParticleTypes={NUM_FLAKE_TYPES}
      numParticles={NUM_FLAKES}
      ParticleComponent={Flake}
    />
  )
}

function Flake({ particleType }: ParticleProps): ReactElement {
  return <StyledFlake src={FLAKE_IMAGES[particleType]} />
}

export default memo(Snow)
