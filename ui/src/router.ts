// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/clip`
  | `/clips`
  | `/login`
  | `/register`
  | `/setting`
  | `/tools`
  | `/tools/markdown-editor`
  | `/tools/reading-time`
  | `/tools/word-counter`

export type Params = {
  
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
