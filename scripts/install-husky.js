#!/usr/bin/env node

import { execFileSync } from 'node:child_process'

const initCwd = process.env.INIT_CWD

if (initCwd && initCwd === process.cwd()) {
  execFileSync('husky', [], { stdio: 'inherit' })
}
