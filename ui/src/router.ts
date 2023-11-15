// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/clip`
  | `/clips`
  | `/explore-rss`
  | `/feed-deck`
  | `/login`
  | `/page`
  | `/register`
  | `/setting`
  | `/tools`
  | `/tools/business-analysis`
  | `/tools/markdown-editor`
  | `/tools/reading-time`
  | `/tools/reddit-reader`
  | `/tools/word-counter`
  | `/tools/youtube-transcriber`
  | `/wiki/builder`

export type Params = {
  
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
